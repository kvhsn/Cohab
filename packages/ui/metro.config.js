const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.watchFolders = [...config.watchFolders, path.resolve(__dirname, '../shared')];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
];

// Required for better-auth
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
