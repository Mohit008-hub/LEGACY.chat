import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  Video,
  ShieldCheck,
  Image as ImageIcon,
  FileText,
  Link2,
  Bell,
  Trash2,
  Lock,
} from 'lucide-react';

const MOCK_SHARED_MEDIA = [
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&auto=format&fit=crop&q=80',
];

const MOCK_SHARED_DOCS = [
  { name: 'Q3_Security_Audit_Report.pdf', size: '2.4 MB', date: 'Yesterday' },
  { name: 'architecture_specification_v2.docx', size: '840 KB', date: 'Nov 17' },
];

export default function ContactInfoDrawer({ isOpen, onClose, contact, isDark }) {
  const [activeTab, setActiveTab] = useState('media'); // 'media' | 'docs' | 'privacy'

  if (!isOpen || !contact) return null;

  return (
    <motion.aside
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`w-[320px] rounded-2xl flex flex-col overflow-hidden shrink-0 border shadow-lg z-20 transition-colors duration-300 ${
        isDark ? 'bg-[#131722] border-[#232938] text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-floating-light'
      }`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between ${
          isDark ? 'border-[#202738] bg-[#161B28]' : 'border-slate-100 bg-slate-50'
        }`}
      >
        <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-400">
          Contact Overview
        </h3>
        <button
          onClick={onClose}
          className={`p-1 rounded-xl transition-colors ${
            isDark ? 'hover:bg-[#1E2433] text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-2">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-500/20"
            />
            {contact.online && (
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 rounded-full border-[#131722]" />
            )}
          </div>
          <h4 className="font-bold text-base leading-tight">{contact.name}</h4>
          <span className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {contact.phone}
          </span>
          <span className={`text-[11px] font-mono mt-1 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
            {contact.handle}
          </span>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 mt-4">
            <button className={`p-2.5 rounded-xl border transition-all ${
              isDark ? 'bg-[#1A2234] border-[#28344C] hover:text-cyan-400' : 'bg-slate-50 border-slate-200 hover:text-indigo-600'
            }`}>
              <Phone className="w-4 h-4" />
            </button>
            <button className={`p-2.5 rounded-xl border transition-all ${
              isDark ? 'bg-[#1A2234] border-[#28344C] hover:text-cyan-400' : 'bg-slate-50 border-slate-200 hover:text-indigo-600'
            }`}>
              <Video className="w-4 h-4" />
            </button>
            <button className={`p-2.5 rounded-xl border transition-all ${
              isDark ? 'bg-[#1A2234] border-[#28344C] hover:text-indigo-400' : 'bg-slate-50 border-slate-200 hover:text-indigo-600'
            }`}>
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Security & Verification Status */}
        <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
          isDark ? 'bg-[#181E2C] border-[#263146]' : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
        }`}>
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold block">Baileys Encryption Verified</span>
            <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Messages & calls are secured with protocol fingerprint.
            </span>
          </div>
        </div>

        {/* Media & Docs Tabs */}
        <div>
          <div className="flex border-b border-slate-700/30 mb-3 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('media')}
              className={`pb-2 px-3 border-b-2 transition-all ${
                activeTab === 'media'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Media ({MOCK_SHARED_MEDIA.length})
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`pb-2 px-3 border-b-2 transition-all ${
                activeTab === 'docs'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Docs ({MOCK_SHARED_DOCS.length})
            </button>
          </div>

          {activeTab === 'media' && (
            <div className="grid grid-cols-2 gap-2">
              {MOCK_SHARED_MEDIA.map((src, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-700/40 relative group">
                  <img src={src} alt="media" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-2">
              {MOCK_SHARED_DOCS.map((doc, i) => (
                <div key={i} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                  isDark ? 'bg-[#181E2C] border-[#283248]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold block truncate">{doc.name}</span>
                      <span className="text-[10px] text-slate-400">{doc.size} • {doc.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
