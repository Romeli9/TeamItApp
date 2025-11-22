export default ({config}) => ({
  ...config,
  slug: 'TeamItApp',
  name: 'TeamItApp',

  ios: {
    ...config.ios,
    bundleIdentifier: 'com.anonymous.TeamItApp',
    infoPlist: {
      ...config.ios?.infoPlist,
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
    },
  },

  android: {
    ...config.android,
    package: 'com.anonymous.TeamItApp',
    networkSecurityConfig:
      './android/app/src/main/res/xml/network_security_config.xml',
    usesCleartextTraffic: true,
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#ffffff',
    },
  },

  extra: {
    ...config.extra,
    eas: {
      projectId: 'a446f0f1-32fd-47a8-b0db-9ef8e4155ab0',
    },
    serverUrl: process.env.EXPO_PUBLIC_SERVER,
  },
});
