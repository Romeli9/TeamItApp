import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useMemo, useState} from 'react';
import {FlatList, KeyboardAvoidingView, Platform, View} from 'react-native';

import {FIREBASE_DB} from 'app/FireBaseConfig';
import {RootStackParamsList} from 'app/navigation/navigationTypes';
import {IMessage} from 'entities';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useChatMessages} from 'shared/hooks';
import {ChatTextarea, Message} from 'shared/ui';

import {MessengerStyles as styles} from './Messenger.styles';

// const messages = [
//   {id: '1', message: 'хуй', isCurrentUser: true},
//   {id: '2', message: 'хуй', isCurrentUser: false},
//   {id: '3', message: 'хуй', isCurrentUser: true},
//   {id: '4', message: 'хуй', isCurrentUser: false},
//   {id: '5', message: 'хуй', isCurrentUser: true},
//   {id: '6', message: 'хуй', isCurrentUser: false},
//   {id: '7', message: 'хуй', isCurrentUser: true},
//   {id: '8', message: 'хуй', isCurrentUser: false},
//   {id: '9', message: 'хуй', isCurrentUser: true},
//   {id: '10', message: 'хуй', isCurrentUser: false},
//   {id: '11', message: 'хуй', isCurrentUser: true},
//   {id: '12', message: 'хуй', isCurrentUser: false},
//   {id: '13', message: 'хуй', isCurrentUser: true},
//   {id: '14', message: 'хуй', isCurrentUser: false},
//   {id: '15', message: 'хуй', isCurrentUser: true},
//   {id: '16', message: 'хуй', isCurrentUser: false},
//   {id: '17', message: 'хуй', isCurrentUser: true},
//   {id: '18', message: 'хуй', isCurrentUser: false},
//   {id: '19', message: 'хуй', isCurrentUser: true},
//   {id: '20', message: 'хуй', isCurrentUser: false},
// ] as unknown as IMessage[];

type MessengerScreenRouteProp = RouteProp<RootStackParamsList, 'Messenger'>;

export const Messenger = () => {
  const {userId, userName} = useSelector((state: RootState) => state.user);

  console.log(userId, userName);

  const route = useRoute<MessengerScreenRouteProp>();

  const {chatId, chatName} = route.params;

  const messages = useChatMessages(chatId);

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  const [currentMessage, setCurrentMessage] = useState<string>('');

  const renderMessage = ({item}: {item: IMessage}) => {
    // const isCurrentUser = item.authorId === userId;

    // const isSending = !!sendingMessages[item.id];

    const hasError = item?.hasError;
    return (
      <>
        <Message
          message={item.message}
          isCurrentUser={item.isCurrentUser}
          // isSending={isSending}
          isRead={item.isRead}
          hasError={hasError}
        />
      </>
    );
  };

  const sendMessage = async (
    chatId: string,
    message: string,
    userId: string,
  ) => {
    try {
      await addDoc(collection(FIREBASE_DB, 'messages'), {
        chatId,
        authorId: userId,
        message,
        createdAt: serverTimestamp(),
        isRead: false,
      });
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
    }
  };

  const handleSendOrUpdate = async () => {
    if (currentMessage.trim()) {
      await sendMessage(chatId, currentMessage, userId);
      setCurrentMessage('');
    }
  };

  const handleAttachFile = () => {
    // заглушка
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          data={reversedMessages}
          initialNumToRender={20}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.contentContainer}
        />
        <ChatTextarea
          message={currentMessage}
          setMessage={setCurrentMessage}
          onSendMessage={handleSendOrUpdate}
          onAttachFile={handleAttachFile}
        />
      </KeyboardAvoidingView>
    </View>
  );
};
