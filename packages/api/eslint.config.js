const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const baseConfig = require('../eslintconfig.base');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  baseConfig,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['src/generated/**'],
  },
]);
