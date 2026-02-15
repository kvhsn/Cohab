// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const baseConfig = require('../eslintconfig.base');

module.exports = defineConfig([baseConfig, expoConfig]);
