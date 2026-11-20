import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  QrCode,
  ShieldAlert,
  Sun,
  Moon,
  Settings,
  Zap,
  Globe,
  LogOut,
  User,
  ExternalLink,
} from 'lucide-react';

export default function NavRail({
  activeView,
  setActiveView,
  theme,
  toggleTheme,
  onOpenQrModal,
  onOpenSettingsModal,
  onOpenVaultModal,
  onToggleLanding,
  onLogout,
  currentUser,
  connectionStatus,
  deletedVaultCount = 0,
}) {
  const isDark = theme === 'dark';
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    {
      id: 'chats',
      label: 'Chats',
      icon: MessageSquare,
      onClick: () => setActiveView('chats'),
      badge: null,
    },
    {
      id: 'qr',
      label: 'WhatsApp Device Link',
      icon: QrCode,
      onClick: onOpenQrModal,
      badge: connectionStatus === 'CONNECTED' ? 'live' : null,
      highlight: connectionStatus === 'CONNECTED',
    },
    {
      id: 'vault',
      label: 'Anti-Delete Vault',
      icon: ShieldAlert,
      onClick: onOpenVaultModal,
      badge: deletedVaultCount > 0 ? deletedVaultCount : null,
      badgeColor: 'bg-rose-500 text-white',
    },
  ];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`w-16 rounded-2xl flex flex-col items-center py-4 justify-between shrink-0 border transition-all duration-300 z-20 ${
        isDark
          ? 'glass-panel-dark text-slate-300 shadow-glass-dark'
          : 'glass-panel-light text-slate-600 shadow-glass-light'
      }`}
    >
      {/* Top Branding / Logo */}
      <div className="flex flex-col items-center gap-5">
        <motion.div
          whileHover={{ scale: 1.08, rotate: 6 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleLanding}
          className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] cursor-pointer shadow-glow-indigo flex items-center justify-center"
          title="Click to view Product Showcase"
        >
          <div className="w-full h-full bg-[#0A0D14] rounded-[10px] flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyan-300" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                connectionStatus === 'CONNECTED' ? 'bg-cyan-400' : 'bg-amber-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 border-2 border-[#0E131F] ${
                connectionStatus === 'CONNECTED' ? 'bg-cyan-500' : 'bg-amber-500'
              }`}
            />
          </span>
        </motion.div>

        {/* Primary View Navigation */}
        <nav className="flex flex-col items-center gap-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={item.onClick}
                title={item.label}
                className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? isDark
                      ? 'bg-indigo-600/20 text-indigo-400 shadow-glow-indigo border border-indigo-500/30'
                      : 'bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-sm'
                    : isDark
                    ? 'hover:bg-white/[0.06] text-slate-400 hover:text-slate-100'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />

                {item.badge && (
                  <span
                    className={`absolute -top-1 -right-1 text-[10px] font-bold px-1.5 min-w-4 h-4 rounded-full flex items-center justify-center border ${
                      item.badgeColor
                        ? item.badgeColor
                        : item.badge === 'live'
                        ? 'bg-cyan-500 text-slate-950 font-black border-cyan-300'
                        : 'bg-indigo-600 text-white border-indigo-400'
                    }`}
                  >
                    {item.badge === 'live' ? '●' : item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls: Theme Switcher, Settings & User Profile with Logout */}
      <div className="flex flex-col items-center gap-2.5 relative">
        {/* Toggle Landing / Showcase */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleLanding}
          title="Product Tour"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
            isDark
              ? 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-cyan-400 hover:bg-white/[0.07]'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4" />
        </motion.button>

        {/* Dark/Light Switcher */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: isDark ? 45 : -45 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
            isDark
              ? 'bg-white/[0.03] border-white/[0.08] text-amber-300 hover:bg-white/[0.07]'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>

        {/* Server Connection Settings */}
        <motion.button
          whileHover={{ scale: 1.08, rotate: 60 }}
          whileTap={{ scale: 0.92 }}
          onClick={onOpenSettingsModal}
          title="Settings"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
            isDark
              ? 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-cyan-400 hover:bg-white/[0.07]'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
        </motion.button>

        {/* User Profile Avatar & Menu Popover */}
        <div className="relative mt-1">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-indigo-500/40 relative cursor-pointer"
            title="User Profile & Logout"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'User'}
              className="w-full h-full object-cover"
            />
          </motion.button>

          {/* User popup dropdown */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`absolute bottom-0 left-14 min-w-[210px] p-2 rounded-2xl border shadow-2xl z-50 backdrop-blur-2xl ${
                  isDark
                    ? 'bg-[#121622]/95 border-white/[0.08] text-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                    : 'bg-white/95 border-slate-200 text-slate-800 shadow-xl'
                }`}
              >
                <div className="p-2 border-b border-white/[0.06] mb-1">
                  <div className="font-bold text-xs truncate">{currentUser?.name || 'User'}</div>
                  <div className="text-[10px] text-slate-400 truncate">{currentUser?.email || currentUser?.handle}</div>
                  <div className="text-[9px] font-mono text-indigo-400 mt-0.5">{currentUser?.role || 'Active Session'}</div>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-400 transition-all ${
                    isDark ? 'hover:bg-rose-500/15' : 'hover:bg-rose-50'
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Switch Account</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
