import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  User,
  CheckCircle2,
  KeyRound,
  Sun,
  Moon,
} from 'lucide-react';

export default function LoginPage({ onLogin, theme, toggleTheme }) {
  const isDark = theme === 'dark';
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    {
      id: 'user_alex',
      name: 'Alex Vance',
      role: 'Lead System Architect',
      email: 'alex.vance@nexus.io',
      handle: '@alexvance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'user_sarah',
      name: 'Sarah Connor',
      role: 'Head of Product',
      email: 'sarah.connor@nexus.io',
      handle: '@sconnor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'user_guest',
      name: 'Sandbox Demo User',
      role: 'Guest Evaluator',
      email: 'guest@nexus.io',
      handle: '@guest_tester',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required credentials.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        id: `user_${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        handle: `@${(name || email.split('@')[0]).toLowerCase().replace(/\s+/g, '')}`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Verified Member',
      });
    }, 700);
  };

  const handleQuickDemo = (account) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(account);
    }, 400);
  };

  return (
    <div
      className={`relative min-h-screen w-screen overflow-y-auto flex items-center justify-center p-4 transition-colors duration-500 font-sans ${
        isDark ? 'bg-[#090C12] text-slate-100' : 'bg-[#F4F6F9] text-slate-800'
      }`}
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-40 transition-all duration-700 ${
            isDark
              ? 'bg-gradient-to-b from-indigo-600/50 via-purple-600/30 to-cyan-500/10'
              : 'bg-gradient-to-b from-indigo-300/60 via-purple-200/50 to-blue-200/40'
          }`}
        />
        <div
          className={`absolute -bottom-20 -right-20 w-[450px] h-[450px] rounded-full blur-[120px] opacity-30 ${
            isDark ? 'bg-cyan-500/30' : 'bg-cyan-200/60'
          }`}
        />
        <div
          className={`absolute -bottom-20 -left-20 w-[450px] h-[450px] rounded-full blur-[120px] opacity-25 ${
            isDark ? 'bg-indigo-600/30' : 'bg-indigo-200/60'
          }`}
        />
      </div>

      {/* Top Controls: Theme Switcher & Brand Tag */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-glow-indigo flex items-center justify-center">
            <div className="w-full h-full bg-[#0E121B] rounded-[9px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-300" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-indigo-400 via-cyan-300 to-white bg-clip-text text-transparent">
              Nexus
            </span>
            <span className="block text-[9px] text-slate-400 tracking-widest font-mono uppercase">
              Encrypted Real-Time Workspace
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.08, rotate: 15 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
            isDark
              ? 'bg-white/5 border-white/10 text-amber-300 hover:bg-white/10'
              : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white shadow-sm'
          }`}
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Main Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        className={`relative z-10 w-full max-w-[440px] rounded-3xl p-8 backdrop-blur-2xl border transition-all duration-300 my-16 shadow-2xl ${
          isDark
            ? 'bg-[#121622]/85 border-white/[0.08] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'
            : 'bg-white/90 border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(30,41,59,0.12)]'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border mb-3 backdrop-blur-sm bg-indigo-500/10 border-indigo-500/25 text-indigo-400">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Baileys Protocol • Anti-Delete Safeguard</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className={`text-xs mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isSignUp
              ? 'Start communicating with end-to-end telemetry'
              : 'Sign in to access your secure chats and active sessions'}
          </p>
        </div>

        {/* Tab Toggle (Sign In / Sign Up) */}
        <div
          className={`grid grid-cols-2 p-1 rounded-xl border mb-6 text-xs font-semibold ${
            isDark ? 'bg-black/30 border-white/[0.06]' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError('');
            }}
            className={`py-2 rounded-lg transition-all ${
              !isSignUp
                ? isDark
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-glow-indigo'
                  : 'bg-white text-indigo-950 shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError('');
            }}
            className={`py-2 rounded-lg transition-all ${
              isSignUp
                ? isDark
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-glow-indigo'
                  : 'bg-white text-indigo-950 shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Full Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none ${
                    isDark
                      ? 'bg-black/30 border-white/[0.08] focus:border-indigo-500 text-white focus:bg-black/50'
                      : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900 focus:bg-white'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Email Address</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none ${
                  isDark
                    ? 'bg-black/30 border-white/[0.08] focus:border-indigo-500 text-white focus:bg-black/50'
                    : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900 focus:bg-white'
                }`}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Password</span>
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => alert('Demo environment: Simply choose one of the 1-Click Demo Accounts below!')}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none pr-10 ${
                  isDark
                    ? 'bg-black/30 border-white/[0.08] focus:border-indigo-500 text-white focus:bg-black/50'
                    : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900 focus:bg-white'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-600 bg-black/30 cursor-pointer"
              />
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Remember session
              </span>
            </label>

            <span className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 End-to-End</span>
            </span>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-xs tracking-wide shadow-glow-indigo flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isSignUp ? 'Create Workspace Account' : 'Sign In to Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className={`absolute inset-0 flex items-center ${isDark ? 'border-white/[0.08]' : 'border-slate-200'}`}>
            <div className="w-full border-t" />
          </div>
          <span
            className={`relative px-3 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md ${
              isDark ? 'bg-[#121622] text-slate-500' : 'bg-white text-slate-400'
            }`}
          >
            Or 1-Click Instant Demo
          </span>
        </div>

        {/* 1-Click Demo Persona Accounts */}
        <div className="space-y-2">
          <p className={`text-[11px] font-medium text-center mb-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Click any demo profile to test immediately with real data:
          </p>

          <div className="grid grid-cols-1 gap-2">
            {demoAccounts.map((acc) => (
              <motion.button
                key={acc.id}
                whileHover={{ scale: 1.015, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickDemo(acc)}
                type="button"
                className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                  isDark
                    ? 'bg-white/[0.03] border-white/[0.07] hover:bg-indigo-600/10 hover:border-indigo-500/40 text-slate-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-indigo-50/80 hover:border-indigo-300 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-500/30"
                  />
                  <div>
                    <span className="text-xs font-bold leading-tight block">
                      {acc.name}
                    </span>
                    <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {acc.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400">
                  <span>Enter</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
