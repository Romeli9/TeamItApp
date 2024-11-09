import {HeaderMessenger} from 'components';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {ChatListStyles as styles} from './ChatList.styles';
import { ChatItem } from 'shared/ui';

export const ChatList = ({navigation}: any) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <HeaderMessenger />
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <ChatItem />
      </View>
    </SafeAreaProvider>
  );
};
