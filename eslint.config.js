// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const tailwind = require('eslint-plugin-tailwindcss');

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  ...tailwind.configs['flat/recommended'],
  {
    ignores: ['dist/*'],
  },
]);
