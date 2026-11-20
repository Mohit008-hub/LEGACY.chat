import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  ShieldAlert,
  Radio,
  CheckCheck,
  Sparkles,
  Command,
} from 'lucide-react';
import StatusStories from './StatusStories';

export default function Sidebar({
  contacts,
  activeContactId,
  onSelectContact,
  theme,
  connectionStatus,
  isSandbox,
  onOpenQrModal,
  onOpenNewChatModal,
  currentUser,
  isMobileDrawerOpen,
  onCloseMobileDrawer,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const isDark = theme === 'dark';

  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = c.name.toLowerCase().includes(q);
    const msgMatch = c.lastMessage?.text?.toLowerCase().includes(q);
    return nameMatch || msgMatch;
  });

  const isConnected = connectionStatus === 'CONNECTED';

  return (
    <motion.div
      initial={{ x: -15, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
      className={`w-[320px] rounded-2xl flex flex-col overflow-hidden shrink-0 border transition-all duration-300 z-10 ${
        isDark
          ? 'glass-panel-dark text-slate-100 shadow-glass-dark'
          : 'glass-panel-light text-slate-800 shadow-glass-light'
      }`}
    >
      {/* Top Header Drawer */}
      <div
        className={`p-4 border-b flex flex-col gap-3 transition-colors ${
          isDark ? 'border-white/[0.06] bg-black/20' : 'border-slate-100 bg-slate-50/60'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black tracking-tight flex items-center gap-1.5">
              <span>Messages</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-700'
              }`}>
                {contacts.length}
              </span>
            </h2>
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              End-to-End Encrypted Session
            </p>
          </div>

          {/* New Chat Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenNewChatModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white text-xs font-semibold shadow-glow-indigo transition-all hover:brightness-110"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </motion.button>
        </div>

        {/* Live Connection Status Pill */}
        <motion.div
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={onOpenQrModal}
          className={`cursor-pointer rounded-xl px-3 py-2 flex items-center justify-between border transition-all backdrop-blur-md ${
            isConnected
              ? isDark
                ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300'
                : 'bg-cyan-50/80 border-cyan-200 text-cyan-800'
              : isDark
              ? 'bg-amber-950/20 border-amber-500/25 text-amber-300'
              : 'bg-amber-50/80 border-amber-200 text-amber-800'
          }`}
          title="Click to view WhatsApp QR Device Pairing"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isConnected ? 'bg-cyan-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected ? 'bg-cyan-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <span className="text-xs font-bold tracking-tight">
              {isConnected ? 'Device Linked' : 'Sandbox Mode'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-medium opacity-80">
            <Radio className="w-3 h-3" />
            <span>{isConnected ? 'Live Bridge' : 'Ready'}</span>
          </div>
        </motion.div>
      </div>

      {/* Ephemeral Status Stories Bar */}
      <StatusStories isDark={isDark} />

      {/* Rounded Pill Search Bar */}
      <div className="px-3 py-2 border-b border-transparent">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
            isDark
              ? 'bg-black/25 border-white/[0.07] focus-within:border-indigo-500/60 focus-within:bg-black/40'
              : 'bg-slate-100/90 border-slate-200 focus-within:border-indigo-500 focus-within:bg-white'
          }`}
        >
          <Search className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="w-full bg-transparent text-xs focus:outline-none placeholder-slate-400 font-medium"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          ) : (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-400'
            }`}>
              ⌘K
            </span>
          )}
        </div>
      </div>

      {/* Scrollable Contact Cards */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center text-slate-400">
            <Search className="w-7 h-7 opacity-30 mb-2" />
            <p className="text-xs font-semibold">No contacts found</p>
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const isSelected = contact.id === activeContactId;
            const hasDraft = !!contact.draft;

            return (
              <motion.div
                key={contact.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => {
                  onSelectContact(contact.id);
                  if (onCloseMobileDrawer) onCloseMobileDrawer();
                }}
                className={`relative group cursor-pointer p-2.5 rounded-xl transition-all duration-200 flex items-center gap-3 border ${
                  isSelected
                    ? isDark
                      ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 border-indigo-500/40 text-white shadow-glow-indigo'
                      : 'bg-indigo-50/90 border-indigo-200 text-slate-900 shadow-sm'
                    : isDark
                    ? 'hover:bg-white/[0.04] border-transparent text-slate-300'
                    : 'hover:bg-slate-50 border-transparent text-slate-700'
                }`}
              >
                {/* Active Indicator Bar */}
                {isSelected && (
                  <motion.div
                    layoutId="activeContactPill"
                    className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-400"
                  />
                )}

                {/* Avatar with status ring */}
                <div className="relative shrink-0 ml-1">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
                  />
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-[#0E131F]" />
                    </span>
                  )}
                </div>

                {/* Info & Last message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className={`text-xs font-bold truncate ${
                        isSelected
                          ? isDark
                            ? 'text-white'
                            : 'text-indigo-950'
                          : isDark
                          ? 'text-slate-100'
                          : 'text-slate-800'
                      }`}
                    >
                      {contact.name}
                    </span>
                    <span
                      className={`text-[10px] shrink-0 font-medium ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {contact.lastMessage?.timestamp || ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate text-[11px]">
                      {contact.hasRevokeAttempt && (
                        <ShieldAlert
                          className="w-3 h-3 text-rose-500 shrink-0 animate-pulse"
                          title="Anti-Delete alert intercepted"
                        />
                      )}

                      {hasDraft ? (
                        <span className="text-cyan-400 italic font-medium flex items-center gap-1 truncate text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                          typing: "{contact.draft}"
                        </span>
                      ) : (
                        <span
                          className={`truncate text-[11px] ${
                            contact.unreadCount > 0
                              ? isDark
                                ? 'text-white font-semibold'
                                : 'text-slate-900 font-semibold'
                              : isDark
                              ? 'text-slate-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {contact.lastMessage?.fromMe && (
                            <span className="text-indigo-400 mr-1 font-semibold">You:</span>
                          )}
                          {contact.lastMessage?.text || 'No messages yet'}
                        </span>
                      )}
                    </div>

                    {contact.unreadCount > 0 && (
                      <span className="shrink-0 bg-indigo-600 text-white font-bold text-[9px] px-1.5 min-w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
