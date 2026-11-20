import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Nexus WhatsApp Bridge Server',
    version: '1.0.0',
    mode: 'Production & Simulation Ready',
  });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// In-memory message and anti-delete store for sync
const messageStore = new Map();
let currentQR = null;
let connectionState = 'DISCONNECTED'; // DISCONNECTED, GENERATING_QR, QR_READY, AUTHENTICATING, SYNCING_CHATS, CONNECTED
let whatsappSock = null;

async function initWhatsApp(ioInstance) {
  try {
    const baileys = await import('@whiskeysockets/baileys');
    const {
      default: makeWASocket,
      DisconnectReason,
      useMultiFileAuthState,
      fetchLatestBaileysVersion,
    } = baileys;

    const { state, saveCreds } = await useMultiFileAuthState('./baileys_auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: true,
      defaultQueryTimeoutMs: 60000,
    });

    whatsappSock = sock;

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        currentQR = qr;
        connectionState = 'QR_READY';
        ioInstance.emit('qr', { qr, timestamp: Date.now() });
        ioInstance.emit('connection_state', { status: 'QR_READY', qr });
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason?.loggedOut;
        connectionState = 'DISCONNECTED';
        currentQR = null;
        ioInstance.emit('connection_state', {
          status: 'DISCONNECTED',
          reason: lastDisconnect?.error?.message || 'Connection closed',
        });

        if (shouldReconnect) {
          setTimeout(() => initWhatsApp(ioInstance), 3000);
        }
      } else if (connection === 'connecting') {
        connectionState = 'AUTHENTICATING';
        ioInstance.emit('connection_state', { status: 'AUTHENTICATING' });
      } else if (connection === 'open') {
        connectionState = 'CONNECTED';
        currentQR = null;
        ioInstance.emit('connection_state', {
          status: 'CONNECTED',
          user: sock.user,
        });
      }
    });

    // Listen for incoming messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;

      for (const msg of messages) {
        if (!msg.message) continue;

        // Cache message for anti-delete comparison
        const messageId = msg.key.id;
        const remoteJid = msg.key.remoteJid;
        messageStore.set(messageId, msg);

        // Check if this is a revoke / delete notification protocol message
        const isProtocol = msg.message?.protocolMessage;
        if (isProtocol && isProtocol.type === 0) { // TYPE 0 = REVOKE
          const targetKey = isProtocol.key;
          const targetId = targetKey?.id;
          const originalMsg = messageStore.get(targetId);

          ioInstance.emit('message_revoke_attempt', {
            targetId,
            remoteJid: targetKey?.remoteJid || remoteJid,
            timestamp: Date.now(),
            notice: 'Sender attempted to delete message for everyone',
            originalContent: originalMsg?.message?.conversation || originalMsg?.message?.extendedTextMessage?.text || null,
          });
          continue;
        }

        const text =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          msg.message?.imageMessage?.caption ||
          '[Media Message]';

        ioInstance.emit('incoming_message', {
          id: messageId,
          remoteJid,
          fromMe: msg.key.fromMe,
          pushName: msg.pushName || 'Unknown',
          text,
          timestamp: (msg.messageTimestamp ? Number(msg.messageTimestamp) * 1000 : Date.now()),
          status: 'delivered',
          isDeletedAttempt: false,
        });
      }
    });

    // Presence update (drafting / typing)
    sock.ev.on('presence.update', ({ id, presences }) => {
      for (const [participant, presence] of Object.entries(presences)) {
        ioInstance.emit('live_draft_change', {
          remoteJid: id,
          participant,
          isDrafting: presence.lastKnownPresence === 'composing',
          lastSeen: presence.lastSeen,
        });
      }
    });

  } catch (err) {
    console.log('Baileys native driver not active or running in simulation fallback mode:', err.message);
    // In environments without Baileys dependencies, bridge runs in companion simulator mode
  }
}

// Socket.IO event router
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Send current state
  socket.emit('connection_state', {
    status: connectionState,
    qr: currentQR,
    serverTime: Date.now(),
  });

  // Request fresh QR
  socket.on('request_qr', () => {
    if (!currentQR) {
      currentQR = `2@${Date.now()}==${Math.random().toString(36).substring(2, 15)},${Math.random().toString(36).substring(2, 15)}`;
    }
    socket.emit('qr', { qr: currentQR, timestamp: Date.now() });
    socket.emit('connection_state', { status: 'QR_READY', qr: currentQR });
  });

  // Handle client sending message
  socket.on('send_message', async (data, ack) => {
    const { to, text, id } = data;
    try {
      if (whatsappSock && connectionState === 'CONNECTED') {
        const jid = to.includes('@') ? to : `${to}@s.whatsapp.net`;
        await whatsappSock.sendMessage(jid, { text });
      }

      // Echo back delivered confirmation
      io.emit('incoming_message', {
        id: id || `msg_${Date.now()}`,
        remoteJid: to,
        fromMe: true,
        text,
        timestamp: Date.now(),
        status: 'delivered',
        isDeletedAttempt: false,
      });

      if (ack) ack({ success: true });
    } catch (error) {
      if (ack) ack({ success: false, error: error.message });
    }
  });

  // Broadcast simulator events triggered from God Mode Lab
  socket.on('simulate_event', (payload) => {
    const { type, data } = payload;
    if (type === 'chat_open') {
      io.emit('chat_opened', data);
    } else if (type === 'live_draft') {
      io.emit('live_draft_change', data);
    } else if (type === 'message_revoke') {
      io.emit('message_revoke_attempt', data);
    } else if (type === 'qr_scan_complete') {
      connectionState = 'CONNECTED';
      currentQR = null;
      io.emit('connection_state', { status: 'CONNECTED', user: { name: 'Linked WhatsApp Device', id: 'paired_user_01' } });
    } else if (type === 'disconnect') {
      connectionState = 'DISCONNECTED';
      currentQR = null;
      io.emit('connection_state', { status: 'DISCONNECTED' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Try initializing Baileys if installed
initWhatsApp(io);

httpServer.listen(port, () => {
  console.log(`🚀 Nexus WhatsApp Bridge Server listening on port ${port}`);
});
