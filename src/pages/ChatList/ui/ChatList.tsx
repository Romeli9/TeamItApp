import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {Screens} from 'app/navigation/navigationEnums';
import {HeaderMessenger} from 'components';
import {Chat} from 'entities';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useAppNavigation} from 'shared/libs/useAppNavigation';
import {ChatItem} from 'shared/ui';

import {ChatListStyles as styles} from './ChatList.styles';

const data = [1, 2, 3, 4, 5] as unknown as Chat[];

export const ChatList = () => {
  const navigation = useAppNavigation();

  const handleNavigate = (chatId: string) => {
    navigation.navigate(Screens.MESSENGER, {chatId});
  };

  const renderItem = ({item}: {item: Chat}) => {
    const handlePress = () => {
      console.log(item);
      handleNavigate(item.id);
    };

    return <ChatItem onPress={handlePress} />;
  };

  return (
    <View style={styles.ChatListContainer}>
      <HeaderMessenger />
      <FlatList
        style={styles.container}
        data={data}
        initialNumToRender={20}
        renderItem={renderItem}
        keyExtractor={item => item.toString()}
      />
    </View>
  );
};
