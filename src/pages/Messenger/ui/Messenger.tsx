import React, {useState} from 'react';
import {
  FlatList,
  GestureResponderEvent,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {HeaderMessenger} from 'components';
import {IMessage} from 'entities';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {ChatTextarea, Message} from 'shared/ui';

import {MessengerStyles as styles} from './Messenger.styles';

//TODO: Сделать чатикс

const messages = [
  {id: '1', message: 'хуй'},
  {id: '2', message: 'хуй'},
  {id: '3', message: 'хуй'},
] as unknown as IMessage[];

export const Messenger = ({navigation}: any) => {
  const {userId, userName, aboutMe, avatar, background} = useSelector(
    (state: RootState) => state.user,
  );

  const [currentMessage, setCurrentMessage] = useState<string>('');

  console.log('хуйхуйхуй');

  const renderMessage = ({item}: {item: IMessage}) => {
    const isCurrentUser = item.authorId === userId;

    // const isSending = !!sendingMessages[item.id];

    const hasError = item?.hasError;
    return (
      <>
        <Message
          message={item.message}
          isCurrentUser={isCurrentUser}
          // isSending={isSending}
          isRead={item.isRead}
          hasError={hasError}
        />
      </>
    );
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <View
        style={[
          styles.container,
          {paddingTop: insets.top, paddingBottom: insets.bottom},
        ]}>
        <KeyboardAvoidingView style={styles.messagesContainer}>
          <FlatList
            data={messages}
            initialNumToRender={20}
            renderItem={renderMessage}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.contentContainer}
          />
          <ChatTextarea
            message={currentMessage}
            setMessage={setCurrentMessage}
            // onSendMessage={handleSendOrUpdate}
            // onAttachFile={handleAttachFile}
          />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaProvider>
  );
};
