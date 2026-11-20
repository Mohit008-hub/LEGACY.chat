import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  X,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Zap,
  PowerOff,
} from 'lucide-react';

export default function QrLinkModal({
  isOpen,
  onClose,
  qrString,
  connectionState, // DISCONNECTED, GENERATING_QR, QR_READY, AUTHENTICATING, SYNCING_CHATS, CONNECTED
  onRequestQr,
  onSimulateScan,
  onDisconnect,
  isSandbox,
  theme,
}) {
  const isDark = theme === 'dark';
  const [internalState, setInternalState] = useState(connectionState);

  useEffect(() => {
    setInternalState(connectionState);
  }, [connectionState]);

  if (!isOpen) return null;

  const isConnected = internalState === 'CONNECTED';
  const isGenerating = internalState === 'GENERATING_QR' || internalState === 'AUTHENTICATING' || internalState === 'SYNCING_CHATS';

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
          className={`relative w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden z-10 flex flex-col ${
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
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-[#131722] rounded-[10px] flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">WhatsApp Web Device Link</h3>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Pair WhatsApp with Baileys Bridge or Sandbox Engine
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

          {/* Connection State Machine Badge Banner */}
          <div
            className={`px-6 py-2.5 border-b flex items-center justify-between text-xs ${
              isConnected
                ? isDark
                  ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
                  : 'bg-cyan-50 border-cyan-200 text-cyan-800'
                : internalState === 'AUTHENTICATING' || internalState === 'SYNCING_CHATS'
                ? isDark
                  ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-800'
                : isDark
                ? 'bg-[#181E2C] border-[#222A3C] text-slate-300'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-[10px]">Machine State:</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-black/20 text-xs">
                {internalState}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-medium text-[11px]">
              {isConnected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Session Active & Authenticated</span>
                </>
              ) : isSandbox ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Sandbox Testing Enabled</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span>Ready for Camera Scan</span>
                </>
              )}
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 flex flex-col md:flex-row items-center gap-6">
            {/* Left Column: QR Code Display Card */}
            <div className="flex flex-col items-center justify-center">
              <div
                className={`p-4 rounded-2xl border relative flex flex-col items-center justify-center ${
                  isDark
                    ? 'bg-white border-slate-700 shadow-glow-indigo'
                    : 'bg-white border-slate-300 shadow-md'
                }`}
              >
                {isConnected ? (
                  <div className="w-[190px] h-[190px] flex flex-col items-center justify-center text-center p-3 text-slate-800">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 shadow-inner">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">Device Linked</span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      Ready to stream messages and intercepts
                    </span>
                  </div>
                ) : isGenerating ? (
                  <div className="w-[190px] h-[190px] flex flex-col items-center justify-center text-center p-3 text-slate-800">
                    <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                    <span className="text-xs font-semibold text-slate-700">
                      {internalState === 'AUTHENTICATING'
                        ? 'Authenticating Session...'
                        : internalState === 'SYNCING_CHATS'
                        ? 'Syncing Recent Chats...'
                        : 'Generating QR Key...'}
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <QRCodeSVG
                      value={qrString || 'https://nexus.chat/device-pairing'}
                      size={190}
                      level="H"
                      includeMargin={false}
                    />
                    {/* Small brand emblem in QR center */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md border-2 border-white">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Regenerate QR button */}
              {!isConnected && (
                <button
                  onClick={onRequestQr}
                  className="mt-3 text-xs flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh QR code</span>
                </button>
              )}
            </div>

            {/* Right Column: 3-Step Pairing Instructions */}
            <div className="flex-1 flex flex-col justify-between self-stretch">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
                  Pairing Instructions
                </h4>

                <ol className="space-y-3 text-xs">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Open <strong>WhatsApp</strong> on your mobile phone
                    </span>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Tap <strong>Menu (⋮)</strong> or <strong>Settings (⚙️)</strong> and select{' '}
                      <strong>Linked Devices</strong>
                    </span>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Tap <strong>Link a Device</strong> and point your camera at this QR code
                    </span>
                  </li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-dashed border-slate-700/40 flex flex-col gap-2">
                {!isConnected ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSimulateScan}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-glow-cyan transition-all hover:brightness-110"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Simulate Phone Scan (Instant Connect)</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onDisconnect}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <PowerOff className="w-4 h-4" />
                    <span>Disconnect Linked Device</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
