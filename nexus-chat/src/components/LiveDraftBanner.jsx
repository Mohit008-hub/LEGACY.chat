import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Sparkles } from 'lucide-react';

export default function LiveDraftBanner({ activeContactDraft, contactName, isDark }) {
  return (
    <AnimatePresence>
      {activeContactDraft && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="px-5 mb-2 pointer-events-none"
        >
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-md backdrop-blur-md text-xs transition-all pointer-events-auto ${
              isDark
                ? 'bg-[#182030]/95 border-cyan-500/40 text-cyan-300 shadow-glow-cyan'
                : 'bg-white/95 border-cyan-400 text-cyan-800 shadow-sm'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>

            <Edit3 className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />

            <span className="font-semibold text-[11px] uppercase tracking-wider text-cyan-400">
              Live Keystroke Stream:
            </span>

            <span className="italic font-normal truncate max-w-[320px] sm:max-w-[450px]">
              {contactName || 'Contact'} is drafting: "{activeContactDraft}"
            </span>

            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
