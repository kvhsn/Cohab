/** @type {import('tailwindcss').Config} */

const { colors, accentColor } = require('./constants/colors');

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      accentColor: accentColor,
      colors: {
        light: {
          text: colors.light.text,
          background: colors.light.background,
          tint: colors.light.tint,
          icon: colors.light.icon,
        },
        dark: {
          text: colors.dark.text,
          background: colors.dark.background,
          tint: colors.dark.tint,
          icon: colors.dark.icon,
        },
      },
    },
  },
  plugins: [],
};
