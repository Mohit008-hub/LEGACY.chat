import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  ShieldAlert,
  Edit3,
  QrCode,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle2,
  Sparkles,
  Lock,
  Layers,
} from 'lucide-react';

export default function LandingPage({ onLaunchApp, theme, toggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen w-screen overflow-y-auto font-sans transition-colors duration-300 ${
        isDark ? 'bg-[#0B0E14] text-slate-100' : 'bg-[#EEF2F6] text-slate-900'
      }`}
    >
      {/* Top Navbar */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between ${
          isDark ? 'bg-[#0B0E14]/80 border-[#232938]' : 'bg-[#EEF2F6]/80 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[2px] shadow-glow-indigo flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0E14] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-400 via-cyan-300 to-white bg-clip-text text-transparent">
              NEXUS WORKSPACE
            </span>
            <span className="block text-[10px] text-slate-400 font-mono">
              v1.0.0 Real-Time Protocol
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all ${
              isDark ? 'bg-[#181E2C] border-[#2A3347] text-amber-300' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLaunchApp}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-xs shadow-glow-indigo"
          >
            <span>Launch Web App</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-6 shadow-glow-indigo"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation Real-Time Messaging Workspace</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black tracking-tight max-w-3xl leading-[1.15]"
        >
          Dynamic Floating Bento Chat with{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-rose-400 bg-clip-text text-transparent">
            God-Mode Interceptions
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed"
        >
          No cloned green layouts. Engineered with an original 3-pane floating-card workspace,
          live WhatsApp Baileys pairing, keystroke telemetry, and an Anti-Delete Vault that preserves
          messages even when the sender tries to revoke them.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLaunchApp}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-glow-indigo flex items-center gap-2"
          >
            <span>Open Interactive Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* 3 Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl text-left">
          <div className={`p-6 rounded-3xl border transition-all ${
            isDark ? 'bg-[#131722] border-rose-500/30 shadow-glow-rose' : 'bg-white border-rose-200 shadow-md'
          }`}>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="font-bold text-base mb-2">Anti-Delete Vault</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When a sender deletes a message for everyone (`protocolMessage type 0`), Nexus captures the original payload.
              The text stays 100% visible, bordered in crimson with an interception tag.
            </p>
          </div>

          <div className={`p-6 rounded-3xl border transition-all ${
            isDark ? 'bg-[#131722] border-cyan-500/30 shadow-glow-cyan' : 'bg-white border-cyan-200 shadow-md'
          }`}>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Edit3 className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="font-bold text-base mb-2">Live Keystroke Capsule</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time socket telemetry streams what contacts are actively drafting into a floating capsule
              right above the composer before they even press send.
            </p>
          </div>

          <div className={`p-6 rounded-3xl border transition-all ${
            isDark ? 'bg-[#131722] border-indigo-500/30 shadow-glow-indigo' : 'bg-white border-indigo-200 shadow-md'
          }`}>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <QrCode className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-bold text-base mb-2">Real WhatsApp QR Pairing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              6-stage connection state machine linking to real WhatsApp mobile devices via Baileys bridge,
              with a zero-crash sandbox fallback for testing on live deployments.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
