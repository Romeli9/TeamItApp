const path = require('path');
const {getDefaultConfig} = require('expo/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

// Получаем дефолтный конфиг Expo (если проект на Expo)
const defaultConfig = getDefaultConfig(__dirname);

const customConfig = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    extraNodeModules: {
      ...defaultConfig.resolver.extraNodeModules,
      shared: path.resolve(__dirname, 'src/shared'),
      entities: path.resolve(__dirname, 'src/entities'),
      pages: path.resolve(__dirname, 'src/pages'),
      app: path.resolve(__dirname, 'src/app'),
      navigation: path.resolve(__dirname, 'src/app/navigation'),
      widgets: path.resolve(__dirname, 'src/widgets'),
      redux: path.resolve(__dirname, 'src/redux'),
      services: path.resolve(__dirname, 'src/services'),
    },
    assetExts: [...defaultConfig.resolver.assetExts, 'svg', 'png', 'ttf'],
    sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs', 'mjs'],
  },
  watchFolders: [path.resolve(__dirname, 'src')],
  projectRoot: path.resolve(__dirname),
};

customConfig.resolver.sourceExts = customConfig.resolver.sourceExts || [];
if (!customConfig.resolver.sourceExts.includes('cjs')) {
  customConfig.resolver.sourceExts.push('cjs');
}

customConfig.resolver.unstable_enablePackageExports = false;

module.exports = wrapWithReanimatedMetroConfig(customConfig);
