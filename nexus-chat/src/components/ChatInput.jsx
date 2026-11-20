import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Smile,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Code,
  Mic,
  X,
} from 'lucide-react';

const COMMON_EMOJIS = ['👍', '❤️', '🔥', '🚀', '✨', '😂', '🎉', '👏', '💡', '⚠️'];

export default function ChatInput({ onSendMessage, theme, onSelfDraftChange }) {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const inputRef = useRef(null);
  const isDark = theme === 'dark';

  const handleChange = (e) => {
    const val = e.target.value;
    setText(val);
    if (onSelfDraftChange) {
      onSelfDraftChange(val);
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
    setShowEmojiPicker(false);
    setShowAttachments(false);
    if (onSelfDraftChange) {
      onSelfDraftChange('');
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    if (onSelfDraftChange) {
      onSelfDraftChange(text + emoji);
    }
    inputRef.current?.focus();
  };

  const handleQuickAttachment = (type) => {
    let mockMsg = '';
    if (type === 'image') {
      mockMsg = '📷 [Shared Screenshot: staging_architecture_diagram.png]';
    } else if (type === 'doc') {
      mockMsg = '📄 [Document: Q3_Security_Audit_Report.pdf]';
    } else if (type === 'code') {
      mockMsg = '💻 [Code Snippet: docker-compose.prod.yml]';
    }
    if (mockMsg) {
      onSendMessage(mockMsg);
    }
    setShowAttachments(false);
  };

  return (
    <div className="relative px-5 pb-4 pt-1 flex flex-col">
      {/* Emoji Picker Popover */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute bottom-20 left-6 p-2 rounded-2xl border shadow-2xl z-30 flex items-center gap-1.5 backdrop-blur-2xl ${
              isDark
                ? 'bg-[#121622]/95 border-white/[0.08] text-white shadow-glass-dark'
                : 'bg-white/95 border-slate-200 text-slate-800 shadow-glass-light'
            }`}
          >
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="w-8 h-8 rounded-lg hover:scale-125 transition-transform flex items-center justify-center text-lg"
              >
                {emoji}
              </button>
            ))}
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="ml-1 p-1 text-slate-400 hover:text-slate-100 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachment Menu Popover */}
      <AnimatePresence>
        {showAttachments && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute bottom-20 left-16 p-2 rounded-2xl border shadow-2xl z-30 flex flex-col gap-1 backdrop-blur-2xl min-w-[190px] ${
              isDark
                ? 'bg-[#121622]/95 border-white/[0.08] text-slate-200 shadow-glass-dark'
                : 'bg-white/95 border-slate-200 text-slate-700 shadow-glass-light'
            }`}
          >
            <button
              onClick={() => handleQuickAttachment('image')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isDark ? 'hover:bg-white/[0.06] text-slate-200' : 'hover:bg-slate-100 text-slate-800'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Photo / Image</span>
            </button>
            <button
              onClick={() => handleQuickAttachment('doc')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isDark ? 'hover:bg-white/[0.06] text-slate-200' : 'hover:bg-slate-100 text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Document / PDF</span>
            </button>
            <button
              onClick={() => handleQuickAttachment('code')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isDark ? 'hover:bg-white/[0.06] text-slate-200' : 'hover:bg-slate-100 text-slate-800'
              }`}
            >
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Code Snippet</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Input Bar */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-lg transition-all duration-300 backdrop-blur-xl ${
          isDark
            ? 'bg-[#121726]/90 border-white/[0.08] focus-within:border-indigo-500/60 focus-within:shadow-glow-indigo'
            : 'bg-white border-slate-200 shadow-glass-light focus-within:border-indigo-500'
        }`}
      >
        {/* Emoji Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 rounded-xl transition-all ${
            showEmojiPicker
              ? 'text-amber-400 bg-amber-400/10'
              : isDark
              ? 'text-slate-400 hover:text-amber-400 hover:bg-white/[0.05]'
              : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
          }`}
          title="Pick Emoji"
        >
          <Smile className="w-4 h-4" />
        </motion.button>

        {/* Attachment Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setShowAttachments(!showAttachments)}
          className={`p-2 rounded-xl transition-all ${
            showAttachments
              ? 'text-indigo-400 bg-indigo-500/10'
              : isDark
              ? 'text-slate-400 hover:text-indigo-400 hover:bg-white/[0.05]'
              : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
          }`}
          title="Attach File"
        >
          <Paperclip className="w-4 h-4" />
        </motion.button>

        {/* Input Text Area */}
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type an encrypted message..."
          className="flex-1 bg-transparent py-1.5 px-2 text-xs sm:text-sm focus:outline-none placeholder-slate-400 font-medium"
        />

        {/* Send Button or Voice Note */}
        {text.trim() ? (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={handleSend}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-glow-indigo hover:brightness-110 shrink-0"
            title="Send Message"
          >
            <Send className="w-3.5 h-3.5 ml-0.5" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => onSendMessage('🎙️ [Voice note: 0:14]')}
            className={`p-2 rounded-xl transition-all ${
              isDark
                ? 'text-slate-400 hover:text-cyan-400 hover:bg-white/[0.05]'
                : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
            }`}
            title="Record Voice Note"
          >
            <Mic className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
