const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      shared: path.resolve(__dirname, 'src/shared'),
      entities: path.resolve(__dirname, 'src/entities'),
      features: path.resolve(__dirname, 'src/features'),
      pages: path.resolve(__dirname, 'src/pages'),
      app: path.resolve(__dirname, 'src/app'),
      navigation: path.resolve(__dirname, 'src/app/navigation'),
      widgets: path.resolve(__dirname, 'src/widgets'),
      features: path.resolve(__dirname, 'src/features'),
      redux: path.resolve(__dirname, 'src/redux'),
    },
  },
  watchFolders: [path.resolve(__dirname, 'src')],
  projectRoot: path.resolve(__dirname),
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
