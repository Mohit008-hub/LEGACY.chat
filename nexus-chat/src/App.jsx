import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './components/LoginPage';
import NavRail from './components/NavRail';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import LiveDraftBanner from './components/LiveDraftBanner';
import ChatOpenToast from './components/ChatOpenToast';
import QrLinkModal from './components/QrLinkModal';
import ConnectionSettingsModal from './components/ConnectionSettingsModal';
import AntiDeleteVaultModal from './components/AntiDeleteVaultModal';
import NewChatModal from './components/NewChatModal';
import ContactInfoDrawer from './components/ContactInfoDrawer';
import LandingPage from './components/LandingPage';
import { bridgeService } from './services/whatsappSocketBridge';
import { sounds } from './services/soundEffects';
import { CURRENT_USER, INITIAL_CONTACTS, INITIAL_MESSAGES } from './mock/initialData';

export default function App() {
  // Theme state: dark (Obsidian) default or light (Floating Light)
  const [theme, setTheme] = useState(() => localStorage.getItem('nexus_theme') || 'dark');
  const isDark = theme === 'dark';

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nexus_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null; // Prompt login by default so the user sees the new login page
  });

  // Navigation and active view ('chats' or 'landing')
  const [activeView, setActiveView] = useState('chats');
  const [activeContactId, setActiveContactId] = useState('contact_sarah');

  // Contact Drawer state for mobile & right info drawer
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Contacts and Messages State
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  // Modals state
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // Connection Bridge state
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
  const [isSandbox, setIsSandbox] = useState(true);
  const [qrString, setQrString] = useState('');

  // God Mode Features State
  const [activeContactDraft, setActiveContactDraft] = useState('');
  const [chatOpenAlert, setChatOpenAlert] = useState(null);

  // Sync theme to root class
  useEffect(() => {
    localStorage.setItem('nexus_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auth Handlers
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('nexus_current_user', JSON.stringify(user));
    sounds.playReceive();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nexus_current_user');
  };

  // Subscribe to real-time events from bridgeService
  useEffect(() => {
    const unsubQr = bridgeService.onQrUpdate((qr) => {
      setQrString(qr);
    });

    const unsubConn = bridgeService.onConnectionState((data) => {
      setConnectionStatus(data.status);
      setIsSandbox(data.isSandbox);
      if (data.qr) setQrString(data.qr);
    });

    const unsubMsg = bridgeService.onIncomingMessage((newMsg) => {
      const contactId = newMsg.remoteJid || activeContactId;

      sounds.playReceive();

      setMessages((prev) => {
        const currentList = prev[contactId] || [];
        return {
          ...prev,
          [contactId]: [
            ...currentList,
            {
              id: newMsg.id || `msg_${Date.now()}`,
              senderId: newMsg.fromMe ? (currentUser?.id || 'user_self') : contactId,
              text: newMsg.text,
              timestamp: new Date(newMsg.timestamp || Date.now()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              fromMe: newMsg.fromMe || false,
              status: newMsg.status || 'delivered',
              isDeletedAttempt: newMsg.isDeletedAttempt || false,
            },
          ],
        };
      });

      // Update sidebar preview
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId
            ? {
                ...c,
                lastMessage: {
                  text: newMsg.text,
                  timestamp: 'Just now',
                  fromMe: newMsg.fromMe,
                },
                unreadCount: c.id === activeContactId ? 0 : c.unreadCount + 1,
              }
            : c,
        ),
      );
    });

    const unsubRevoke = bridgeService.onMessageRevokeAttempt((revokeData) => {
      const { targetId, remoteJid, notice } = revokeData;
      const contactId = remoteJid || activeContactId;

      sounds.playAlert();

      // Mark the message as anti-deleted while keeping original text 100% visible
      setMessages((prev) => {
        const contactMsgs = prev[contactId] || [];
        const updated = contactMsgs.map((m) => {
          if (m.id === targetId || (!targetId && !m.fromMe)) {
            return {
              ...m,
              isDeletedAttempt: true,
              deletedNotice: notice || 'Sender attempted to delete message for everyone',
              revokedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          }
          return m;
        });
        return { ...prev, [contactId]: updated };
      });

      // Mark contact row with warning shield
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, hasRevokeAttempt: true } : c)),
      );
    });

    const unsubDraft = bridgeService.onLiveDraftChange((draftData) => {
      const { remoteJid, isDrafting, text } = draftData;
      const targetContactId = remoteJid || activeContactId;

      const draftText = isDrafting ? text || 'Drafting a response...' : '';

      setContacts((prev) =>
        prev.map((c) => (c.id === targetContactId ? { ...c, draft: draftText } : c)),
      );

      if (targetContactId === activeContactId) {
        setActiveContactDraft(draftText);
      }
    });

    const unsubChatOpen = bridgeService.onChatOpened((data) => {
      sounds.playAlert();
      setChatOpenAlert(data);
    });

    return () => {
      unsubQr();
      unsubConn();
      unsubMsg();
      unsubRevoke();
      unsubDraft();
      unsubChatOpen();
    };
  }, [activeContactId, currentUser]);

  // Active contact & active messages
  const activeContact = useMemo(() => {
    return contacts.find((c) => c.id === activeContactId) || contacts[0];
  }, [contacts, activeContactId]);

  const activeMessages = useMemo(() => {
    return messages[activeContact?.id] || [];
  }, [messages, activeContact]);

  // Synchronize activeContact draft state
  useEffect(() => {
    if (activeContact) {
      setActiveContactDraft(activeContact.draft || '');
    }
  }, [activeContact]);

  // Send message handler
  const handleSendMessage = useCallback(
    (text) => {
      if (!activeContact) return;

      sounds.playSend();

      const newMsg = bridgeService.sendMessage({
        to: activeContact.id,
        text,
        senderId: currentUser?.id || 'user_self',
      });

      setMessages((prev) => {
        const list = prev[activeContact.id] || [];
        return {
          ...prev,
          [activeContact.id]: [...list, newMsg],
        };
      });

      // Update contact preview
      setContacts((prev) =>
        prev.map((c) =>
          c.id === activeContact.id
            ? {
                ...c,
                lastMessage: {
                  text,
                  timestamp: newMsg.timestamp,
                  fromMe: true,
                },
              }
            : c,
        ),
      );
    },
    [activeContact, currentUser],
  );

  // Select contact
  const handleSelectContact = (id) => {
    setActiveContactId(id);
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    );
  };

  // Add new contact
  const handleAddContact = ({ name, phone }) => {
    const newId = `contact_${Date.now()}`;
    const newContact = {
      id: newId,
      name,
      phone,
      handle: `@${name.toLowerCase().replace(/\s+/g, '')}`,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      online: true,
      lastSeen: 'online',
      unreadCount: 0,
      hasRevokeAttempt: false,
      lastMessage: {
        text: 'Conversation initiated',
        timestamp: 'Just now',
        fromMe: true,
      },
      draft: '',
    };

    setContacts((prev) => [newContact, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newId]: [
        {
          id: `msg_init_${Date.now()}`,
          senderId: currentUser?.id || 'user_self',
          text: `Hi ${name}! Secure session initiated over Nexus protocol.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fromMe: true,
          status: 'delivered',
          isDeletedAttempt: false,
        },
      ],
    }));
    setActiveContactId(newId);
  };

  // --- GOD MODE SIMULATOR ACTIONS ---

  // 1. Simulate Chat Open Toast
  const handleSimulateChatOpen = () => {
    bridgeService.simulateEvent('chat_open', {
      contactId: activeContact?.id,
      contactName: activeContact?.name || 'Contact',
      timestamp: Date.now(),
    });
  };

  // 2. Simulate Live Draft Keystrokes
  const handleSimulateLiveDraft = () => {
    const mockDraftStrings = [
      'Hey, let me revise that proposal figure...',
      'Can you review the AWS egress pricing?',
      'Just saw the security patch notes for Baileys!',
      'Working on the new responsive design tokens now...',
    ];
    const randomDraft = mockDraftStrings[Math.floor(Math.random() * mockDraftStrings.length)];

    bridgeService.simulateEvent('live_draft', {
      remoteJid: activeContact?.id,
      isDrafting: true,
      text: randomDraft,
    });

    setTimeout(() => {
      bridgeService.simulateEvent('live_draft', {
        remoteJid: activeContact?.id,
        isDrafting: false,
        text: '',
      });
    }, 6000);
  };

  // 3. Mark Last Message Anti-Deleted
  const handleSimulateAntiDelete = () => {
    if (!activeContact) return;
    const currentMsgs = messages[activeContact.id] || [];

    let targetMsg = [...currentMsgs].reverse().find((m) => !m.fromMe);
    if (!targetMsg && currentMsgs.length > 0) {
      targetMsg = currentMsgs[currentMsgs.length - 1];
    }

    if (!targetMsg) {
      const fallbackId = `msg_rev_${Date.now()}`;
      setMessages((prev) => ({
        ...prev,
        [activeContact.id]: [
          ...(prev[activeContact.id] || []),
          {
            id: fallbackId,
            senderId: activeContact.id,
            text: 'Here is the sensitive confidential staging credential: root_access_token_99x',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            fromMe: false,
            status: 'read',
            isDeletedAttempt: true,
            revokedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            deletedNotice: 'Sender attempted to delete message for everyone',
          },
        ],
      }));
      setContacts((prev) =>
        prev.map((c) => (c.id === activeContact.id ? { ...c, hasRevokeAttempt: true } : c)),
      );
      sounds.playAlert();
      return;
    }

    bridgeService.simulateEvent('message_revoke', {
      targetId: targetMsg.id,
      remoteJid: activeContact.id,
      timestamp: Date.now(),
      notice: 'Sender attempted to delete message for everyone',
    });
  };

  // QR Device Pairing actions
  const handleRequestQr = () => {
    bridgeService.requestQrGeneration();
  };

  const handleSimulateScan = () => {
    bridgeService.simulateEvent('qr_scan_complete', {
      user: { name: 'Linked Phone', id: 'paired_device_99' },
    });
    setIsQrModalOpen(false);
  };

  const handleDisconnect = () => {
    bridgeService.simulateEvent('disconnect', {});
  };

  // Calculate vault count for badge
  const allRevokedMessages = useMemo(() => {
    const list = [];
    Object.entries(messages).forEach(([contactId, msgList]) => {
      const contact = contacts.find((c) => c.id === contactId);
      msgList.forEach((m) => {
        if (m.isDeletedAttempt) {
          list.push({
            ...m,
            contactId,
            contactName: contact?.name || 'Contact',
          });
        }
      });
    });
    return list;
  }, [messages, contacts]);

  // If user is not logged in, show the brand new Login Page!
  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // If activeView is 'landing', show the public showcase landing page
  if (activeView === 'landing') {
    return (
      <LandingPage
        onLaunchApp={() => setActiveView('chats')}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div
      className={`h-screen w-screen overflow-hidden p-3 gap-3 flex transition-colors duration-500 font-sans ${
        isDark ? 'bg-[#090C12] text-slate-100' : 'bg-[#F4F6F9] text-slate-800'
      }`}
    >
      {/* 1. Far-Left Slim Icon Rail */}
      <NavRail
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenVaultModal={() => setIsVaultModalOpen(true)}
        onToggleLanding={() => setActiveView('landing')}
        onLogout={handleLogout}
        currentUser={currentUser}
        connectionStatus={connectionStatus}
        deletedVaultCount={allRevokedMessages.length}
      />

      {/* 2. Middle Contact Drawer (Desktop + Responsive Mobile Overlay) */}
      <div className="hidden md:flex shrink-0">
        <Sidebar
          contacts={contacts}
          activeContactId={activeContactId}
          onSelectContact={handleSelectContact}
          theme={theme}
          connectionStatus={connectionStatus}
          isSandbox={isSandbox}
          onOpenQrModal={() => setIsQrModalOpen(true)}
          onOpenNewChatModal={() => setIsNewChatModalOpen(true)}
          currentUser={currentUser}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <div className="relative z-10 p-3 h-full">
              <Sidebar
                contacts={contacts}
                activeContactId={activeContactId}
                onSelectContact={handleSelectContact}
                theme={theme}
                connectionStatus={connectionStatus}
                isSandbox={isSandbox}
                onOpenQrModal={() => setIsQrModalOpen(true)}
                onOpenNewChatModal={() => setIsNewChatModalOpen(true)}
                currentUser={currentUser}
                isMobileDrawerOpen={isMobileDrawerOpen}
                onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Right Main Chat Card */}
      <main
        className={`flex-1 rounded-2xl flex flex-col relative overflow-hidden border transition-all duration-300 ${
          isDark
            ? 'glass-panel-dark text-slate-100 shadow-glass-dark'
            : 'glass-panel-light text-slate-800 shadow-glass-light'
        }`}
      >
        {/* Floating Chat-Open Pill Alert Dropdown */}
        <ChatOpenToast
          alert={chatOpenAlert}
          onDismiss={() => setChatOpenAlert(null)}
          isDark={isDark}
        />

        {/* Chat Header with Collapsible God Mode Lab Simulator & Contact Info toggle */}
        <ChatHeader
          activeContact={activeContact}
          theme={theme}
          isDrafting={!!activeContactDraft}
          onSimulateChatOpen={handleSimulateChatOpen}
          onSimulateLiveDraft={handleSimulateLiveDraft}
          onSimulateAntiDelete={handleSimulateAntiDelete}
          onToggleContactInfo={() => setIsContactInfoOpen(!isContactInfoOpen)}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        />

        {/* Scrollable Message Stage */}
        <MessageList
          messages={activeMessages}
          activeContact={activeContact}
          theme={theme}
        />

        {/* Floating Live Keystroke Capsule */}
        <LiveDraftBanner
          activeContactDraft={activeContactDraft}
          contactName={activeContact?.name}
          isDark={isDark}
        />

        {/* Floating Composer Footer */}
        <ChatInput
          onSendMessage={handleSendMessage}
          theme={theme}
          onSelfDraftChange={() => {}}
        />
      </main>

      {/* 4. Contact Overview & Shared Media Drawer (Collapsible Right Side) */}
      <AnimatePresence>
        {isContactInfoOpen && (
          <ContactInfoDrawer
            isOpen={isContactInfoOpen}
            onClose={() => setIsContactInfoOpen(false)}
            contact={activeContact}
            isDark={isDark}
          />
        )}
      </AnimatePresence>

      {/* MODALS */}

      {/* QR Device Link Modal */}
      <QrLinkModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        qrString={qrString}
        connectionState={connectionStatus}
        onRequestQr={handleRequestQr}
        onSimulateScan={handleSimulateScan}
        onDisconnect={handleDisconnect}
        isSandbox={isSandbox}
        theme={theme}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
      />

      {/* Connection & Cloud Settings Modal */}
      <ConnectionSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        theme={theme}
      />

      {/* Anti-Delete Vault / Audit Feed Modal */}
      <AntiDeleteVaultModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        revokedMessages={allRevokedMessages}
        onSelectContact={handleSelectContact}
        theme={theme}
      />

      {/* Start New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onAddContact={handleAddContact}
        theme={theme}
      />
    </div>
  );
}
