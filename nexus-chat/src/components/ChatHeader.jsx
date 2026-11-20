import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Video,
  Info,
  FlaskConical,
  Eye,
  Edit3,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Menu,
  ShieldCheck,
} from 'lucide-react';

export default function ChatHeader({
  activeContact,
  theme,
  isDrafting,
  onSimulateChatOpen,
  onSimulateLiveDraft,
  onSimulateAntiDelete,
  onToggleContactInfo,
  onOpenMobileDrawer,
}) {
  const [showGodModeLab, setShowGodModeLab] = useState(false);
  const isDark = theme === 'dark';

  if (!activeContact) {
    return (
      <div
        className={`p-4 border-b flex items-center justify-between ${
          isDark ? 'border-white/[0.06] bg-black/20' : 'border-slate-100 bg-slate-50'
        }`}
      >
        <span className="text-sm font-semibold text-slate-400">Select a conversation</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col shrink-0 z-10">
      {/* Primary Header Row */}
      <div
        className={`px-5 py-3 border-b flex items-center justify-between transition-colors duration-300 ${
          isDark
            ? 'border-white/[0.06] bg-[#0E131F]/90 backdrop-blur-xl text-white'
            : 'border-slate-100 bg-white/90 backdrop-blur-xl text-slate-900'
        }`}
      >
        {/* Contact info & Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu */}
          <button
            onClick={onOpenMobileDrawer}
            className={`md:hidden p-2 rounded-xl transition-all ${
              isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Open Conversations"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={onToggleContactInfo}
            className="flex items-center gap-3 cursor-pointer group"
            title="View contact profile & shared media"
          >
            <div className="relative">
              <img
                src={activeContact.avatar}
                alt={activeContact.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-indigo-500/50 transition-all"
              />
              {activeContact.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 rounded-full border-[#0E131F]" />
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm leading-tight tracking-tight group-hover:text-indigo-400 transition-colors">
                  {activeContact.name}
                </span>
                <span
                  className={`hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isDark
                      ? 'bg-white/[0.05] text-slate-400'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {activeContact.phone}
                </span>
              </div>

              {/* Live status string */}
              <div className="flex items-center gap-1.5 text-xs">
                {isDrafting ? (
                  <span className="text-cyan-400 font-medium flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    typing keystrokes...
                  </span>
                ) : activeContact.online ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Active now
                  </span>
                ) : (
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Last seen: {activeContact.lastSeen}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Icons & Collapsible God Mode Lab Toggle */}
        <div className="flex items-center gap-2">
          {/* God Mode Lab Toggle Pill */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowGodModeLab(!showGodModeLab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showGodModeLab
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-glow-rose'
                : isDark
                ? 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:border-indigo-500/40 hover:bg-white/[0.08]'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-indigo-300'
            }`}
          >
            <FlaskConical className={`w-3.5 h-3.5 ${showGodModeLab ? 'text-rose-400' : 'text-indigo-400'}`} />
            <span className="hidden sm:inline">Simulator</span>
            {showGodModeLab ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </motion.button>

          {/* Action icons */}
          <div className="flex items-center gap-1 ml-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-xl transition-all ${
                isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
              title="Voice Call"
            >
              <Phone className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-xl transition-all ${
                isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
              title="Video Call"
            >
              <Video className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleContactInfo}
              className={`p-2 rounded-xl transition-all ${
                isDark ? 'hover:bg-white/10 text-slate-400 hover:text-indigo-400' : 'hover:bg-slate-100 text-slate-500 hover:text-indigo-600'
              }`}
              title="Contact Information & Shared Media"
            >
              <Info className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Interactive Collapsible Event Simulator Bar */}
      <AnimatePresence>
        {showGodModeLab && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`overflow-hidden border-b px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs ${
              isDark
                ? 'bg-[#101524] border-white/[0.06] text-slate-200'
                : 'bg-indigo-50/80 border-indigo-100 text-indigo-950'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold flex items-center gap-1 text-indigo-400 uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Live Event Simulator:
              </span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Test real-time states instantly
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {/* Button 1: Simulate Chat Open Toast */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSimulateChatOpen}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 font-medium transition-all text-xs"
                title="Simulates contact opening this chat window"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Simulate Chat Open</span>
              </motion.button>

              {/* Button 2: Simulate Live Draft */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSimulateLiveDraft}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 font-medium transition-all text-xs"
                title="Simulates contact live typing / drafting keystrokes"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Simulate Live Draft</span>
              </motion.button>

              {/* Button 3: Mark Last Message Anti-Deleted */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSimulateAntiDelete}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 font-medium transition-all text-xs"
                title="Simulates remote sender revoking a message ('Delete for Everyone')"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Mark Anti-Deleted</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
