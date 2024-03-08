const { getDefaultConfig } = require('expo/metro-config');

const defaultconfig = getDefaultConfig(__dirname);
defaultconfig.resolver.assetExts.push('cjs');

module.exports = defaultconfig;