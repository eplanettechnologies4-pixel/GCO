/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#062463', dark: '#011648', light: '#0c3582' },
        brand: { DEFAULT: '#054ea0', dark: '#033c7d', light: '#1668c4' },
        leaf: { DEFAULT: '#255c2f', dark: '#1b4723', light: '#2f733b' },
        silver: { DEFAULT: '#b2b5b9', light: '#dce0e5', dark: '#5b6675' },
        bgsoft: '#f2f6fb',
        bgsilver: '#f1f3f6',
        bggreen: '#edf5ef',
        muted: '#525e70',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
