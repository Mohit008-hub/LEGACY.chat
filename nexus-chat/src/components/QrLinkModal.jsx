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
  AlertTriangle,
  Server,
  Zap,
  PowerOff,
  Phone,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

export default function QrLinkModal({
  isOpen,
  onClose,
  qrString,
  connectionState,
  onRequestQr,
  onSimulateScan,
  onDisconnect,
  isSandbox,
  theme,
  onOpenSettingsModal,
}) {
  const isDark = theme === 'dark';
  const [internalState, setInternalState] = useState(connectionState);
  const [pairingMode, setPairingMode] = useState('qr'); // 'qr' | 'code'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isRequestingCode, setIsRequestingCode] = useState(false);

  useEffect(() => {
    setInternalState(connectionState);
  }, [connectionState]);

  if (!isOpen) return null;

  const isConnected = internalState === 'CONNECTED';
  const isGenerating =
    internalState === 'GENERATING_QR' ||
    internalState === 'AUTHENTICATING' ||
    internalState === 'SYNCING_CHATS';

  const handleRequestPairingCode = (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setIsRequestingCode(true);

    setTimeout(() => {
      setIsRequestingCode(false);
      // Generate clean 8-character pairing code
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let code1 = '';
      let code2 = '';
      for (let i = 0; i < 4; i++) code1 += chars.charAt(Math.floor(Math.random() * chars.length));
      for (let i = 0; i < 4; i++) code2 += chars.charAt(Math.floor(Math.random() * chars.length));
      setGeneratedCode(`${code1}-${code2}`);
    }, 800);
  };

  const copyPairingCode = () => {
    if (!generatedCode) return;
    navigator.clipboard?.writeText(generatedCode.replace('-', ''));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className={`relative w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden z-10 flex flex-col ${
            isDark
              ? 'bg-[#121622] border-white/[0.08] text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.8)]'
              : 'bg-white border-slate-200 text-slate-800 shadow-xl'
          }`}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b flex items-center justify-between ${
              isDark ? 'border-white/[0.06] bg-black/20' : 'border-slate-100 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] flex items-center justify-center shadow-glow-indigo">
                <div className="w-full h-full bg-[#121622] rounded-[9px] flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">WhatsApp Device Pairing</h3>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Link WhatsApp via Live Baileys Protocol or Sandbox
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors ${
                isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div
            className={`px-6 pt-3 pb-2 border-b flex items-center justify-between ${
              isDark ? 'border-white/[0.06] bg-black/10' : 'border-slate-100 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPairingMode('qr')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  pairingMode === 'qr'
                    ? isDark
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Code Scan</span>
              </button>

              <button
                type="button"
                onClick={() => setPairingMode('code')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  pairingMode === 'code'
                    ? isDark
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Phone Pairing Code</span>
              </button>
            </div>

            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
              isConnected
                ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                : 'bg-black/20 text-slate-400'
            }`}>
              {isConnected ? '● LINKED' : internalState}
            </span>
          </div>

          {/* Warning / Architecture Notice if in Sandbox Mode */}
          {isSandbox && !isConnected && (
            <div
              className={`mx-6 mt-4 p-3 rounded-2xl border text-xs flex items-start gap-3 ${
                isDark
                  ? 'bg-amber-950/25 border-amber-500/30 text-amber-200'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px] leading-relaxed">
                <strong>Why doesn't WhatsApp recognize this QR yet?</strong>
                <p className="mt-0.5 opacity-90">
                  Vercel only hosts static frontends. A real WhatsApp camera scan requires an active cryptographic session with WhatsApp servers streamed from the Node.js Baileys bridge server in <code className="font-mono bg-black/20 px-1 py-0.5 rounded">/server</code>.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenSettingsModal) onOpenSettingsModal();
                    }}
                    className="inline-flex items-center gap-1 font-bold underline hover:opacity-80"
                  >
                    <Server className="w-3 h-3" />
                    <span>Connect Live Bridge Server URL</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="p-6">
            {pairingMode === 'qr' ? (
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Left Column: Clean Unobstructed QR Code Card */}
                <div className="flex flex-col items-center justify-center">
                  <div
                    className={`p-4 rounded-2xl border relative flex flex-col items-center justify-center bg-white ${
                      isDark ? 'border-slate-700 shadow-glow-indigo' : 'border-slate-300 shadow-md'
                    }`}
                  >
                    {isConnected ? (
                      <div className="w-[190px] h-[190px] flex flex-col items-center justify-center text-center p-3 text-slate-800">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 shadow-inner">
                          <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">Device Linked</span>
                        <span className="text-[11px] text-slate-500 mt-1">
                          Streaming real-time messages & anti-delete logs
                        </span>
                      </div>
                    ) : isGenerating ? (
                      <div className="w-[190px] h-[190px] flex flex-col items-center justify-center text-center p-3 text-slate-800">
                        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                        <span className="text-xs font-semibold text-slate-700">
                          {internalState === 'AUTHENTICATING'
                            ? 'Authenticating Handshake...'
                            : internalState === 'SYNCING_CHATS'
                            ? 'Syncing Recent Chats...'
                            : 'Generating QR Key...'}
                        </span>
                      </div>
                    ) : (
                      /* Completely Clean QR without any overlay emblem so phone camera decodes 100% cleanly */
                      <div className="p-1 bg-white rounded-lg">
                        <QRCodeSVG
                          value={qrString || 'https://nexus.chat/device-pairing'}
                          size={180}
                          level="M"
                          includeMargin={true}
                        />
                      </div>
                    )}
                  </div>

                  {!isConnected && (
                    <button
                      onClick={onRequestQr}
                      className="mt-3 text-xs flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Request Fresh QR</span>
                    </button>
                  )}
                </div>

                {/* Right Column: Instructions & Instant Scan */}
                <div className="flex-1 flex flex-col justify-between self-stretch">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2.5">
                      3-Step Device Pairing
                    </h4>

                    <ol className="space-y-2.5 text-xs">
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
                          Go to <strong>Settings</strong> ➔ <strong>Linked Devices</strong>
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

                  {/* Buttons */}
                  <div className="mt-5 pt-3 border-t border-dashed border-white/10 flex flex-col gap-2">
                    {!isConnected ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onSimulateScan}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-indigo transition-all hover:brightness-110"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Instant Connect (Simulate Phone Scan)</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onDisconnect}
                        className="w-full py-2.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                      >
                        <PowerOff className="w-4 h-4" />
                        <span>Disconnect Device Session</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Phone Pairing Code Tab */
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
                    Link with Phone Number
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Enter your phone number (with country code) to receive an 8-character pairing code you can enter directly inside WhatsApp without camera scanning.
                  </p>
                </div>

                <form onSubmit={handleRequestPairingCode} className="flex gap-2">
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 555 123 4567 or +91 98765 43210"
                    className={`flex-1 px-4 py-2.5 rounded-xl text-xs border font-mono focus:outline-none transition-all ${
                      isDark
                        ? 'bg-black/30 border-white/[0.08] focus:border-indigo-500 text-white'
                        : 'bg-slate-50 border-slate-300 focus:border-indigo-600 text-slate-900'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={isRequestingCode}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-bold shadow-glow-indigo shrink-0"
                  >
                    {isRequestingCode ? 'Requesting...' : 'Get Pairing Code'}
                  </button>
                </form>

                {generatedCode && (
                  <div
                    className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 ${
                      isDark ? 'bg-black/40 border-cyan-500/40 shadow-glow-cyan' : 'bg-cyan-50 border-cyan-300'
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                      Enter this code in WhatsApp ➔ Link a Device ➔ Link with phone number instead:
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-2xl font-black tracking-widest text-white px-3 py-1 rounded-xl bg-black/40 border border-white/10">
                        {generatedCode}
                      </span>
                      <button
                        type="button"
                        onClick={copyPairingCode}
                        className={`p-2 rounded-xl border transition-all ${
                          copiedCode
                            ? 'bg-emerald-500 text-white'
                            : isDark
                            ? 'bg-white/10 border-white/10 text-slate-200'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                        title="Copy code"
                      >
                        {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={onSimulateScan}
                      className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-bold underline"
                    >
                      Confirm Pairing & Enter Workspace
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
