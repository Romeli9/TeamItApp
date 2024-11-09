import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {HeaderMessenger} from 'components';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {MessengerStyles as styles} from './Messenger.styles';

//TODO: Сделать чатикс
export const Messenger = ({navigation}: any) => {
  const insets = useSafeAreaInsets();

  return <SafeAreaProvider></SafeAreaProvider>;
};
