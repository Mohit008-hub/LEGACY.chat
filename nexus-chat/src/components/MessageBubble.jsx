import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck, ShieldAlert, Ban } from 'lucide-react';

export default function MessageBubble({ message, isDark }) {
  const {
    id,
    text,
    timestamp,
    fromMe,
    status = 'read',
    isDeletedAttempt = false,
    deletedNotice = 'Sender attempted to delete',
    revokedAt,
  } = message;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      className={`flex w-full mb-3 ${fromMe ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`relative max-w-[80%] sm:max-w-[70%] md:max-w-[62%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 ${
          isDeletedAttempt
            ? 'border-2 border-rose-500/80 bg-rose-500/[0.12] text-rose-100 shadow-glow-rose'
            : fromMe
            ? isDark
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-xs shadow-glow-indigo'
              : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-xs shadow-md'
            : isDark
            ? 'bg-[#151C2C]/90 text-slate-100 border border-white/[0.07] rounded-bl-xs'
            : 'bg-white text-slate-900 border border-slate-200/90 rounded-bl-xs shadow-xs'
        }`}
      >
        {/* Anti-Delete Interception Warning Header if Revoked */}
        {isDeletedAttempt && (
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-rose-500/30 text-rose-400 font-bold text-[11px] tracking-wide uppercase">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Anti-Delete Intercepted • Original Preserved</span>
          </div>
        )}

        {/* 100% VISIBLE & READABLE Message Text */}
        <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words select-text font-normal">
          {text}
        </p>

        {/* Footer Meta Row (Timestamp + Anti-Delete Badge + Delivery Status) */}
        <div className="flex items-center justify-end gap-2 mt-1.5 pt-1">
          {/* Anti-Delete Red Tag at Bottom-Right */}
          {isDeletedAttempt && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600/30 text-rose-200 border border-rose-500/50 text-[10px] font-semibold tracking-tight shadow-sm">
              <Ban className="w-3 h-3 text-rose-400" />
              <span>🚫 Sender attempted to delete</span>
              {revokedAt && <span className="opacity-75">({revokedAt})</span>}
            </span>
          )}

          {/* Timestamp */}
          <span
            className={`text-[10px] font-medium ${
              isDeletedAttempt
                ? 'text-rose-300/80'
                : fromMe
                ? 'text-white/80'
                : isDark
                ? 'text-slate-400'
                : 'text-slate-500'
            }`}
          >
            {timestamp}
          </span>

          {/* Outgoing Message Read Status */}
          {fromMe && (
            <span className="text-cyan-300">
              {status === 'read' ? (
                <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
              ) : (
                <Check className="w-3.5 h-3.5 opacity-80" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
