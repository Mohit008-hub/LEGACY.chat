import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Phone, User, MessageSquare } from 'lucide-react';

export default function NewChatModal({ isOpen, onClose, onAddContact, theme }) {
  const isDark = theme === 'dark';
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddContact({
      name: name.trim(),
      phone: phone.trim() || '+1 (555) 000-0000',
    });

    setName('');
    setPhone('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden z-10 flex flex-col ${
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
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm">Start New Conversation</h3>
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

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Contact Name</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Liam Anderson"
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#181E2C] border-[#283248] focus:border-indigo-500 text-white'
                    : 'bg-slate-50 border-slate-300 focus:border-indigo-600 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>WhatsApp Phone Number</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#181E2C] border-[#283248] focus:border-cyan-400 text-white'
                    : 'bg-slate-50 border-slate-300 focus:border-indigo-600 text-slate-900'
                }`}
              />
            </div>

            <div className="pt-3 border-t border-slate-700/40 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium ${
                  isDark ? 'hover:bg-[#1E2433] text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-glow-indigo"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Create Conversation</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
