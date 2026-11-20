/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          bg: '#090C12',
          card: '#0E131F',
          cardSubtle: '#131A2B',
          bubbleIn: '#172034',
          bubbleOut: '#6366F1',
          badge: '#22D3EE',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: '#182136',
          textMuted: '#94A3B8',
        },
        floatingLight: {
          bg: '#F3F5F9',
          card: '#FFFFFF',
          cardSubtle: '#F8FAFC',
          bubbleIn: '#F1F5F9',
          bubbleOut: '#4F46E5',
          badge: '#0284C7',
          border: 'rgba(0, 0, 0, 0.08)',
          hover: '#F8FAFC',
          textMuted: '#64748B',
        }
      },
      boxShadow: {
        'glass-dark': '0 20px 50px -15px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.07)',
        'glass-light': '0 20px 45px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
        'glow-indigo': '0 0 25px -4px rgba(99, 102, 241, 0.45)',
        'glow-cyan': '0 0 22px -4px rgba(34, 211, 238, 0.45)',
        'glow-rose': '0 0 25px -4px rgba(244, 63, 94, 0.45)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
