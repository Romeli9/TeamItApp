import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {Screens} from 'app/navigation/navigationEnums';
import {HeaderMessenger} from 'components';
import {Chat} from 'entities';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useChatList} from 'shared/hooks';
import {useAppNavigation} from 'shared/libs/useAppNavigation';
import {ChatItem} from 'shared/ui';

import {ChatListStyles as styles} from './ChatList.styles';

export const ChatList = () => {
  const {navigate} = useAppNavigation();

  const {userId} = useSelector((state: RootState) => state.user);

  const chats = useChatList(userId);

  const renderItem = ({item}: {item: Chat}) => {
    const handlePress = () => {
      navigate(Screens.MESSENGER, {chatId: item.id, chatName: item.name});
    };

    return (
      <ChatItem
        chatName={item.name}
        lastMessage={item.lastMessage}
        onPress={handlePress}
      />
    );
  };

  return (
    <View style={styles.ChatListContainer}>
      <HeaderMessenger />
      <FlatList
        style={styles.container}
        data={chats}
        initialNumToRender={20}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};
