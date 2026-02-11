/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        light: {
          text: '#11181C',
          background: '#fff',
          tint: '#0a7ea4',
          icon: '#687076',
        },
        dark: {
          text: '#ECEDEE',
          background: '#151718',
          tint: '#fff',
          icon: '#9BA1A6',
        },
      },
    },
  },
  plugins: [],
};
