import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Ban, Clock, User, ArrowRight, X, Sparkles } from 'lucide-react';

export default function AntiDeleteVaultModal({
  isOpen,
  onClose,
  revokedMessages = [],
  onSelectContact,
  theme,
}) {
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh] ${
            isDark
              ? 'bg-[#131722] border-[#252E42] text-slate-100 shadow-floating-dark'
              : 'bg-white border-slate-200 text-slate-800 shadow-floating-light'
          }`}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b flex items-center justify-between ${
              isDark ? 'border-[#202738] bg-[#161B28]' : 'border-slate-100 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-tight">Anti-Delete Vault & Audit Feed</h3>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold">
                    {revokedMessages.length} Intercepted
                  </span>
                </div>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  WhatsApp "Delete for Everyone" attempts preserved in full clarity
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors ${
                isDark ? 'hover:bg-[#1E2433] text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of Intercepted Revoked Messages */}
          <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
            {revokedMessages.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center text-slate-400">
                <ShieldAlert className="w-12 h-12 opacity-30 text-rose-400 mb-3" />
                <p className="text-sm font-semibold">No delete attempts recorded yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  When a remote sender deletes a message for everyone, Nexus captures the original payload before it disappears.
                </p>
              </div>
            ) : (
              revokedMessages.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border transition-all ${
                    isDark
                      ? 'bg-[#181E2C] border-rose-500/30 shadow-glow-rose hover:border-rose-500/50'
                      : 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs flex items-center gap-1.5 text-rose-400">
                        <Ban className="w-3.5 h-3.5" />
                        Sender Attempted Revoke
                      </span>
                      <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        from <strong>{item.contactName || 'Contact'}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>

                  {/* Preserved Content */}
                  <div
                    className={`p-3 rounded-xl border text-xs font-mono select-text my-2.5 ${
                      isDark
                        ? 'bg-[#0E121B] border-[#2A344A] text-slate-200'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    "{item.text}"
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-rose-400/90 italic flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Captured via Baileys protocolMessage type 0
                    </span>

                    <button
                      onClick={() => {
                        onSelectContact(item.contactId);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      <span>Jump to Chat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
