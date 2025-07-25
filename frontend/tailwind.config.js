// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'pulse-bg': 'pulsebg 15s ease-in-out infinite',
        "fade-in": "fadeIn 0.6s ease-out both",
      },
      keyframes: {
        pulsebg: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
       keyframes: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
  },
    },
  },
  plugins: [],
};
