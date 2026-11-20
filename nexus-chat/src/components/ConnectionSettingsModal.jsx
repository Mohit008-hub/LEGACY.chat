import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Server,
  Database,
  Key,
  Save,
  RotateCcw,
  X,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { bridgeService } from '../services/whatsappSocketBridge';

export default function ConnectionSettingsModal({ isOpen, onClose, theme }) {
  const isDark = theme === 'dark';
  const [bridgeUrl, setBridgeUrl] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = bridgeService.getConfig();
      setBridgeUrl(cfg.bridgeUrl || '');
      setSupabaseUrl(cfg.supabaseUrl || '');
      setSupabaseAnonKey(cfg.supabaseAnonKey || '');
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    bridgeService.saveConfig({
      bridgeUrl,
      supabaseUrl,
      supabaseAnonKey,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    setBridgeUrl('');
    setSupabaseUrl('');
    setSupabaseAnonKey('');
    bridgeService.saveConfig({
      bridgeUrl: '',
      supabaseUrl: '',
      supabaseAnonKey: '',
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
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

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden z-10 flex flex-col ${
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
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Server & Cloud Settings</h3>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Configure live WhatsApp bridge and Supabase keys
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

          {/* Form */}
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
              isDark ? 'bg-[#181E2C] border-[#252E40] text-slate-300' : 'bg-indigo-50/60 border-indigo-100 text-indigo-950'
            }`}>
              <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong>Zero-Crash Runtime Architecture:</strong> If fields are empty, the app operates in instantaneous offline Sandbox mode. When configured, it connects live to your deployed Baileys server on Render/Railway.
              </div>
            </div>

            {/* Bridge URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span>Companion Baileys Bridge Server URL</span>
              </label>
              <input
                type="text"
                value={bridgeUrl}
                onChange={(e) => setBridgeUrl(e.target.value)}
                placeholder="https://your-nexus-bridge.onrender.com"
                className={`w-full px-3.5 py-2 rounded-xl text-xs border font-mono focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#181E2C] border-[#283248] focus:border-cyan-400 text-cyan-300'
                    : 'bg-slate-50 border-slate-300 focus:border-indigo-600 text-slate-900'
                }`}
              />
              <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Leave empty for built-in Sandbox Simulator mode
              </span>
            </div>

            {/* Supabase URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Supabase Project URL</span>
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className={`w-full px-3.5 py-2 rounded-xl text-xs border font-mono focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#181E2C] border-[#283248] focus:border-indigo-400 text-indigo-300'
                    : 'bg-slate-50 border-slate-300 focus:border-indigo-600 text-slate-900'
                }`}
              />
            </div>

            {/* Supabase Anon Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Anon Public Key</span>
              </label>
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className={`w-full px-3.5 py-2 rounded-xl text-xs border font-mono focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#181E2C] border-[#283248] focus:border-emerald-400 text-emerald-300'
                    : 'bg-slate-50 border-slate-300 focus:border-indigo-600 text-slate-900'
                }`}
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-700/40 flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sandbox</span>
              </button>

              <div className="flex items-center gap-2">
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
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save & Reconnect</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
