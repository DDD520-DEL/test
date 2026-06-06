/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blackboard: {
          DEFAULT: '#1e3a2f',
          light: '#2a4d3e',
          dark: '#152a21',
        },
        chalk: {
          DEFAULT: '#f5e6c8',
          yellow: '#f9e79f',
          orange: '#e8734a',
          green: '#a8c5a0',
          pink: '#f0b7b0',
          blue: '#a8c8e8',
        },
        wood: {
          DEFAULT: '#8b6f47',
          light: '#a58558',
          dark: '#6b5236',
        },
        sticky: {
          yellow: '#fff9c4',
          pink: '#ffe0e0',
          blue: '#e0f0ff',
          green: '#e0ffe8',
        }
      },
      fontFamily: {
        chalk: ['"Ma Shan Zheng"', '"Caveat"', 'cursive'],
        hand: ['"ZCOOL KuaiLe"', '"Comic Sans MS"', 'cursive'],
      },
      boxShadow: {
        'chalk': '0 2px 8px rgba(245, 230, 200, 0.15)',
        'sticky': '2px 3px 8px rgba(0, 0, 0, 0.2)',
        'wood-frame': 'inset 0 0 0 8px #8b6f47, inset 0 0 0 12px #6b5236',
      },
      animation: {
        'chalk-write': 'chalkWrite 0.8s ease-out forwards',
        'shake': 'shake 0.3s ease-in-out',
        'dust-fall': 'dustFall 0.6s ease-out forwards',
        'flip': 'flip 0.4s ease-out',
        'pulse-warning': 'pulseWarning 1s ease-in-out infinite',
        'count-up': 'countUp 0.8s ease-out',
      },
      keyframes: {
        chalkWrite: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-1deg)' },
          '75%': { transform: 'rotate(1deg)' },
        },
        dustFall: {
          '0%': { opacity: '0.8', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(12px)' },
        },
        flip: {
          '0%': { transform: 'rotateX(90deg)', opacity: '0' },
          '100%': { transform: 'rotateX(0deg)', opacity: '1' },
        },
        pulseWarning: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        countUp: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
