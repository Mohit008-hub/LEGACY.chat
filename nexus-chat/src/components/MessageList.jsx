import React, { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import { ShieldCheck, MessageSquareDashed } from 'lucide-react';

export default function MessageList({ messages = [], activeContact, theme }) {
  const messagesEndRef = useRef(null);
  const isDark = theme === 'dark';

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, [activeContact?.id]);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length, messages[messages.length - 1]?.isDeletedAttempt]);

  return (
    <div
      className={`flex-1 overflow-y-auto px-6 py-4 flex flex-col justify-start transition-colors duration-300 relative ${
        isDark ? 'bg-[#0E121B]' : 'bg-[#FAFCFF]'
      }`}
    >
      {/* End-to-End Encryption / Privacy Pill Notice */}
      <div className="flex justify-center my-3">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${
            isDark
              ? 'bg-[#161B28]/80 border-[#252E42] text-slate-400'
              : 'bg-white border-slate-200 text-slate-500 shadow-sm'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Encrypted with Baileys Session • Anti-Delete Safeguard Active</span>
        </div>
      </div>

      {/* Date Divider */}
      <div className="flex items-center justify-center my-4">
        <div
          className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isDark
              ? 'bg-[#1A2234] text-slate-400 border border-[#252E42]'
              : 'bg-slate-200/80 text-slate-600'
          }`}
        >
          Today
        </div>
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
          <MessageSquareDashed className="w-12 h-12 mb-3 text-indigo-400" />
          <p className="text-sm font-semibold">No messages in this conversation yet</p>
          <p className="text-xs text-slate-400 mt-1">Say hello to start the chat!</p>
        </div>
      ) : (
        <div className="space-y-1">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isDark={isDark} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Anchor for auto-scroll */}
      <div ref={messagesEndRef} className="h-2" />
    </div>
  );
}
