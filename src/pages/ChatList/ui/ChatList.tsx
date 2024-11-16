import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {HeaderMessenger} from 'components';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {ChatItem} from 'shared/ui';

import {ChatListStyles as styles} from './ChatList.styles';

const data = [1, 2, 3, 4, 5];

export const ChatList = ({navigation}: any) => {
  const insets = useSafeAreaInsets();

  const renderItem = ({item}: {item: any}) => {
    return <ChatItem />;
  };

  return (
    <SafeAreaProvider>
      <HeaderMessenger />
      <FlatList
        style={styles.container}
        data={data}
        initialNumToRender={20}
        renderItem={renderItem}
        keyExtractor={item => item.toString()}
      />
    </SafeAreaProvider>
  );
};
