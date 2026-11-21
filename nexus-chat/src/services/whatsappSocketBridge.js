import { io } from 'socket.io-client';
import { createClient } from '@supabase/supabase-js';

// Configuration keys for localStorage
const STORAGE_KEYS = {
  BRIDGE_URL: 'nexus_bridge_url',
  SUPABASE_URL: 'nexus_supabase_url',
  SUPABASE_ANON_KEY: 'nexus_supabase_anon_key',
};

class WhatsAppSocketBridgeService {
  constructor() {
    this.socket = null;
    this.supabase = null;
    this.listeners = {
      qrUpdate: new Set(),
      pairingCode: new Set(),
      connectionState: new Set(),
      incomingMessage: new Set(),
      messageRevokeAttempt: new Set(),
      liveDraftChange: new Set(),
      chatOpened: new Set(),
    };

    this.connectionState = 'DISCONNECTED'; // DISCONNECTED, GENERATING_QR, QR_READY, AUTHENTICATING, SYNCING_CHATS, CONNECTED
    this.currentQr = null;
    this.currentPairingCode = null;
    this.isSandbox = true;
    this.init();
  }

  getConfig() {
    return {
      bridgeUrl: localStorage.getItem(STORAGE_KEYS.BRIDGE_URL) || import.meta.env.VITE_BRIDGE_URL || '',
      supabaseUrl: localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || import.meta.env.VITE_SUPABASE_URL || '',
      supabaseAnonKey: localStorage.getItem(STORAGE_KEYS.SUPABASE_ANON_KEY) || import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    };
  }

  saveConfig({ bridgeUrl, supabaseUrl, supabaseAnonKey }) {
    if (bridgeUrl !== undefined) localStorage.setItem(STORAGE_KEYS.BRIDGE_URL, bridgeUrl.trim());
    if (supabaseUrl !== undefined) localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, supabaseUrl.trim());
    if (supabaseAnonKey !== undefined) localStorage.setItem(STORAGE_KEYS.SUPABASE_ANON_KEY, supabaseAnonKey.trim());
    
    // Re-initialize with updated credentials
    this.init();
  }

  init() {
    const config = this.getConfig();

    // Setup Supabase Realtime if keys are present
    if (config.supabaseUrl && config.supabaseAnonKey) {
      try {
        this.supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
        this.setupSupabaseSubscription();
      } catch (err) {
        console.warn('Supabase initialization fallback:', err);
      }
    }

    // Setup Socket.IO if Bridge URL is present
    if (config.bridgeUrl) {
      this.isSandbox = false;
      this.connectSocket(config.bridgeUrl);
    } else {
      // Sandbox fallback mode - simulated bridge
      this.isSandbox = true;
      this.initSandboxMode();
    }
  }

  connectSocket(url) {
    if (this.socket) {
      this.socket.disconnect();
    }

    try {
      this.socket = io(url, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        this.isSandbox = false;
        this.emitStateChange({ status: 'AUTHENTICATING' });
        this.socket.emit('request_qr');
      });

      this.socket.on('qr', (data) => {
        this.currentQr = data.qr;
        this.emitQrUpdate(data.qr);
        this.emitStateChange({ status: 'QR_READY', qr: data.qr });
      });

      this.socket.on('pairing_code', (data) => {
        this.currentPairingCode = data.code;
        this.notifyListeners('pairingCode', data.code);
      });

      this.socket.on('connection_state', (data) => {
        this.connectionState = data.status;
        this.emitStateChange(data);
      });

      this.socket.on('incoming_message', (msg) => {
        this.notifyListeners('incomingMessage', msg);
      });

      this.socket.on('message_revoke_attempt', (revokeData) => {
        this.notifyListeners('messageRevokeAttempt', revokeData);
      });

      this.socket.on('live_draft_change', (draftData) => {
        this.notifyListeners('liveDraftChange', draftData);
      });

      this.socket.on('chat_opened', (alertData) => {
        this.notifyListeners('chatOpened', alertData);
      });

      this.socket.on('connect_error', () => {
        this.isSandbox = true;
        this.emitStateChange({ status: 'DISCONNECTED', error: 'Bridge server unreachable. Operating in Sandbox.' });
      });
    } catch (e) {
      this.isSandbox = true;
      this.emitStateChange({ status: 'DISCONNECTED', error: e.message });
    }
  }

  setupSupabaseSubscription() {
    if (!this.supabase) return;
    try {
      this.supabase
        .channel('public:nexus_chat_events')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            this.notifyListeners('incomingMessage', payload.new);
          } else if (payload.eventType === 'UPDATE' && payload.new.isDeletedAttempt) {
            this.notifyListeners('messageRevokeAttempt', payload.new);
          }
        })
        .subscribe();
    } catch (e) {
      console.warn('Supabase Realtime channel subscription skipped:', e);
    }
  }

  initSandboxMode() {
    this.connectionState = 'DISCONNECTED';
    this.currentQr = 'https://nexus.chat/sandbox-link-protocol-v1';
    this.emitStateChange({ status: 'DISCONNECTED', isSandbox: true });
  }

  // --- Public Subscription Handlers ---

  onQrUpdate(callback) {
    this.listeners.qrUpdate.add(callback);
    if (this.currentQr) callback(this.currentQr);
    return () => this.listeners.qrUpdate.delete(callback);
  }

  onPairingCode(callback) {
    this.listeners.pairingCode.add(callback);
    if (this.currentPairingCode) callback(this.currentPairingCode);
    return () => this.listeners.pairingCode.delete(callback);
  }

  onConnectionState(callback) {
    this.listeners.connectionState.add(callback);
    callback({ status: this.connectionState, isSandbox: this.isSandbox });
    return () => this.listeners.connectionState.delete(callback);
  }

  onIncomingMessage(callback) {
    this.listeners.incomingMessage.add(callback);
    return () => this.listeners.incomingMessage.delete(callback);
  }

  onMessageRevokeAttempt(callback) {
    this.listeners.messageRevokeAttempt.add(callback);
    return () => this.listeners.messageRevokeAttempt.delete(callback);
  }

  onLiveDraftChange(callback) {
    this.listeners.liveDraftChange.add(callback);
    return () => this.listeners.liveDraftChange.delete(callback);
  }

  onChatOpened(callback) {
    this.listeners.chatOpened.add(callback);
    return () => this.listeners.chatOpened.delete(callback);
  }

  notifyListeners(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => {
        try {
          cb(payload);
        } catch (e) {
          console.error(`Error in listener for ${event}:`, e);
        }
      });
    }
  }

  emitStateChange(stateData) {
    this.connectionState = stateData.status || this.connectionState;
    this.notifyListeners('connectionState', {
      ...stateData,
      status: this.connectionState,
      isSandbox: this.isSandbox,
    });
  }

  emitQrUpdate(qr) {
    this.currentQr = qr;
    this.notifyListeners('qrUpdate', qr);
  }

  sendMessage({ to, text, senderId = 'user_self' }) {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const msgObj = {
      id: messageId,
      senderId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fromMe: true,
      status: 'delivered',
      isDeletedAttempt: false,
    };

    if (this.socket && this.socket.connected) {
      this.socket.emit('send_message', { to, text, id: messageId });
    }

    return msgObj;
  }

  requestPairingCode(phoneNumber) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('request_pairing_code', { phoneNumber });
    } else {
      // Sandbox fallback demo pairing code
      setTimeout(() => {
        const dummyCode = `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        this.currentPairingCode = dummyCode;
        this.notifyListeners('pairingCode', dummyCode);
      }, 500);
    }
  }

  simulateEvent(type, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('simulate_event', { type, data });
    }

    if (type === 'chat_open') {
      this.notifyListeners('chatOpened', data);
    } else if (type === 'live_draft') {
      this.notifyListeners('liveDraftChange', data);
    } else if (type === 'message_revoke') {
      this.notifyListeners('messageRevokeAttempt', data);
    } else if (type === 'qr_scan_complete') {
      this.connectionState = 'CONNECTED';
      this.emitStateChange({ status: 'CONNECTED', isSandbox: this.isSandbox });
    } else if (type === 'disconnect') {
      this.connectionState = 'DISCONNECTED';
      this.emitStateChange({ status: 'DISCONNECTED', isSandbox: this.isSandbox });
    }
  }

  requestQrGeneration() {
    this.emitStateChange({ status: 'GENERATING_QR' });
    if (this.socket && this.socket.connected) {
      this.socket.emit('request_qr');
    } else {
      setTimeout(() => {
        const dummyQr = `2@NEXUS_SALT_${Date.now()}==${Math.random().toString(36).substring(2, 10)}`;
        this.emitQrUpdate(dummyQr);
        this.emitStateChange({ status: 'QR_READY', qr: dummyQr });
      }, 600);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.connectionState = 'DISCONNECTED';
    this.emitStateChange({ status: 'DISCONNECTED' });
  }
}

export const bridgeService = new WhatsAppSocketBridgeService();
