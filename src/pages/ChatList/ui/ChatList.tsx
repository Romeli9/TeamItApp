import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {Screens} from 'app/navigation/navigationEnums';
import {HeaderMessenger} from 'components';
import {Chat} from 'entities';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useAppNavigation} from 'shared/libs/useAppNavigation';
import {ChatItem} from 'shared/ui';

import {ChatListStyles as styles} from './ChatList.styles';

const data = [
  {id: '1', name: 'Егорик'},
  {id: '2', name: 'Димасик'},
  {id: '3', name: 'Мияги'},
  {id: '4', name: 'Сын Мияги'},
  {id: '5', name: 'Абалдуй'},
] as unknown as Chat[];

export const ChatList = () => {
  const navigation = useAppNavigation();

  const handleNavigate = (chatId: string, chatName: string) => {
    navigation.navigate(Screens.MESSENGER, {chatId, chatName});
  };

  const renderItem = ({item}: {item: Chat}) => {
    const handlePress = () => {
      handleNavigate(item.id, item.name);
    };

    return <ChatItem chatName={item.name} onPress={handlePress} />;
  };

  return (
    <View style={styles.ChatListContainer}>
      <HeaderMessenger />
      <FlatList
        style={styles.container}
        data={data}
        initialNumToRender={20}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};
