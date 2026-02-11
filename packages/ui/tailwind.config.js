/** @type {import('tailwindcss').Config} */

const { colors, accentColor } = require('./constants/colors');

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        accent: accentColor,
        light: {
          background: colors.light.background,
          surface: colors.light.surface,
          text: colors.light.text,
          textSecondary: colors.light.textSecondary,
          textMuted: colors.light.textMuted,
          border: colors.light.border,
          icon: colors.light.icon,
        },
        dark: {
          background: colors.dark.background,
          surface: colors.dark.surface,
          text: colors.dark.text,
          textSecondary: colors.dark.textSecondary,
          textMuted: colors.dark.textMuted,
          border: colors.dark.border,
          icon: colors.dark.icon,
        },
      },
    },
  },
  plugins: [],
};
