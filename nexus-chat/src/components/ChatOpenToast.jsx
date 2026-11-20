import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, BellRing, X } from 'lucide-react';

export default function ChatOpenToast({ alert, onDismiss, isDark }) {
  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);

    return () => clearTimeout(timer);
  }, [alert, onDismiss]);

  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          className="absolute top-16 left-0 right-0 z-40 flex justify-center pointer-events-none px-4"
        >
          <div
            className={`pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-full border shadow-2xl backdrop-blur-xl ${
              isDark
                ? 'bg-[#181F2F]/95 border-amber-500/40 text-amber-200 shadow-glow-indigo'
                : 'bg-white/95 border-amber-400 text-slate-800 shadow-floating-light'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-amber-400">🚨</span>
              <span>
                <strong className={isDark ? 'text-white' : 'text-slate-950 font-bold'}>
                  {alert.contactName || 'Contact'}
                </strong>{' '}
                just opened your chat.
              </span>
            </div>

            <button
              onClick={onDismiss}
              className={`ml-2 p-1 rounded-full transition-colors ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
