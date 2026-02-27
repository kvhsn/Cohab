// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const baseConfig = require('../eslintconfig.base');
const tanstackQueryConfig = require('@tanstack/eslint-plugin-query');

module.exports = defineConfig([
  ...baseConfig,
  ...expoConfig,
  ...tanstackQueryConfig.configs['flat/recommended'],
]);
