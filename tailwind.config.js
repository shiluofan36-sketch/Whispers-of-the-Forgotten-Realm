/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'Courier New', 'monospace'],
      },
      colors: {
        'rarity-common':    '#9CA3AF',
        'rarity-rare':      '#3B82F6',
        'rarity-epic':      '#A855F7',
        'rarity-legendary': '#F59E0B',
      },
      animation: {
        'fade-in': 'fadeIn 0.75s ease-out',
        'slide-in': 'slideIn 1s ease-out',
        'slide-in-up': 'slideInUp 1s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 4px currentColor' },
          '50%': { boxShadow: '0 0 12px currentColor' },
        },
      },
    },
  },
  plugins: [],
};
