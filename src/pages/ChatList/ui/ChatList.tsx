import React, {memo, useCallback, useMemo} from 'react';
import {FlatList, View} from 'react-native';

import {Screens} from 'app/navigation/navigationEnums';
import {HeaderMessenger} from 'components';
import {Chat} from 'entities';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useChatList} from 'shared/hooks';
import {useAppNavigation} from 'shared/libs/useAppNavigation';
import {ChatItem} from 'shared/ui';

import {ChatListStyles as styles} from './ChatList.styles';

export const ChatList = memo(() => {
  const {navigate} = useAppNavigation();
  const {userId} = useSelector((state: RootState) => state.user);
  const chats = useChatList(userId);

  const renderItem = ({item}: {item: Chat}) => {
    const handlePress = (chatName: string) => {
      navigate(Screens.MESSENGER, {chatId: item.id, chatName});
    };

    return (
      <ChatItem
        lastMessage={item.lastMessage}
        time={item.time}
        group={item.group}
        lastMessageAuthorId={item.lastMessageAuthorId}
        participants={item.participants}
        image={item.image}
        name={item.name}
        onPress={handlePress}
      />
    );
  };

  const keyExtractor = useCallback((item: Chat) => item.id.toString(), []);

  const memoizedChats = useMemo(() => chats, [chats]);

  return (
    <View style={styles.ChatListContainer}>
      <HeaderMessenger />
      <FlatList
        style={styles.container}
        data={memoizedChats}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
});
