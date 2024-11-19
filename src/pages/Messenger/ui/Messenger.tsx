import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, KeyboardAvoidingView, Platform, View} from 'react-native';

import {FIREBASE_DB} from 'app/FireBaseConfig';
import {RootStackParamsList} from 'app/navigation/navigationTypes';
import {IMessage} from 'entities';
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useChatMessages} from 'shared/hooks';
import {ChatTextarea, Message} from 'shared/ui';

import {MessengerStyles as styles} from './Messenger.styles';

type MessengerScreenRouteProp = RouteProp<RootStackParamsList, 'Messenger'>;

export const Messenger = () => {
  const {userId, userName} = useSelector((state: RootState) => state.user);

  const route = useRoute<MessengerScreenRouteProp>();

  const {chatId} = route.params;

  const {messages, setMessages} = useChatMessages(chatId);
  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  const [currentMessage, setCurrentMessage] = useState<string>('');

  useEffect(() => {
    markMessagesAsRead(chatId, userId);
  }, [chatId, userId, messages]);

  const markMessagesAsRead = async (chatId: string, userId: string) => {
    try {
      const messagesRef = collection(FIREBASE_DB, 'messages');
      const messagesQuery = query(
        messagesRef,
        where('chatId', '==', chatId),
        where('isRead', '==', false),
        where('authorId', '!=', userId),
      );

      const snapshot = await getDocs(messagesQuery);

      const batch = writeBatch(FIREBASE_DB);

      snapshot.forEach(doc => {
        batch.update(doc.ref, {isRead: true, status: 'read'});
      });

      await batch.commit();
    } catch (error) {
      console.error('Ошибка при пометке сообщений как прочитанных:', error);
    }
  };

  const renderMessage = ({item}: {item: IMessage}) => {
    const isCurrentUser = item.authorId === userId;

    return (
      <>
        <Message
          status={item.status}
          message={item.message}
          isCurrentUser={isCurrentUser}
          isRead={item.isRead}
        />
      </>
    );
  };

  const sendMessage = async (
    chatId: string,
    message: string,
    userId: string,
  ) => {
    const messagesRef = collection(FIREBASE_DB, 'messages');
    const tempMessageId = `temp-${Date.now()}`;

    const newMessage: IMessage = {
      id: tempMessageId,
      chatId,
      authorId: userId,
      message,
      createdAt: new Date(),
      isRead: false,
      status: 'sending',
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      const docRef = await addDoc(messagesRef, {
        chatId,
        authorId: userId,
        message,
        createdAt: serverTimestamp(),
        isRead: false,
        status: 'sent',
      });

      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempMessageId
            ? {...msg, id: docRef.id, status: 'sent'}
            : msg,
        ),
      );
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
