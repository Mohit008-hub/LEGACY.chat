import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

export const MOCK_STORIES = [
  {
    id: 'story_self',
    userName: 'Your Story',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isSelf: true,
    hasStory: false,
  },
  {
    id: 'story_sarah',
    userName: 'Sarah C.',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    caption: 'Leading the Q3 All-Hands presentation! 🚀',
    time: '2h ago',
    hasStory: true,
  },
  {
    id: 'story_david',
    userName: 'David Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    caption: 'Clean cluster deployment: 99.999% uptime achieved.',
    time: '4h ago',
    hasStory: true,
  },
  {
    id: 'story_elena',
    userName: 'Elena R.',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    caption: 'Obsidian dark vs Floating light design tokens finalized ✨',
    time: '6h ago',
    hasStory: true,
  },
];

export default function StatusStories({ isDark }) {
  const [activeStory, setActiveStory] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!activeStory) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStory(null);
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStory]);

  return (
    <>
      {/* Horizontal Scrollable Stories Carousel */}
      <div className="px-3 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar shrink-0 border-b border-transparent">
        {MOCK_STORIES.map((s) => (
          <motion.button
            key={s.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (s.hasStory) {
                setProgress(0);
                setActiveStory(s);
              }
            }}
            className="flex flex-col items-center gap-1 shrink-0 group focus:outline-none"
          >
            <div
              className={`relative p-[2px] rounded-full transition-all ${
                s.isSelf
                  ? 'border border-dashed border-slate-500'
                  : 'bg-gradient-to-tr from-cyan-400 via-indigo-500 to-rose-500 shadow-glow-indigo'
              }`}
            >
              <img
                src={s.userAvatar}
                alt={s.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              {s.isSelf && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold border-2 border-[#131722]">
                  <Plus className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
            <span
              className={`text-[10px] font-medium truncate max-w-[50px] ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {s.isSelf ? 'My Status' : s.userName}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {activeStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveStory(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl z-10 bg-slate-950 text-white flex flex-col h-[520px]"
            >
              {/* Progress Bar */}
              <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Story Header */}
              <div className="absolute top-6 left-4 right-4 z-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={activeStory.userAvatar}
                    alt={activeStory.userName}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold leading-tight drop-shadow">
                      {activeStory.userName}
                    </h4>
                    <span className="text-[10px] text-white/80 drop-shadow">
                      {activeStory.time}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStory(null)}
                  className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Story Image */}
              <div className="flex-1 relative">
                <img
                  src={activeStory.image}
                  alt={activeStory.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              </div>

              {/* Caption */}
              <div className="p-4 z-20 bg-slate-950/80 backdrop-blur-sm">
                <p className="text-xs text-white font-medium text-center">
                  {activeStory.caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
