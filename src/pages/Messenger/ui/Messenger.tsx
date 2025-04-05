import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, KeyboardAvoidingView, Platform, View} from 'react-native';

import {FIREBASE_DB} from 'app/FireBaseConfig';
import {Screens} from 'app/navigation/navigationEnums';
import {RootStackParamsList} from 'app/navigation/navigationTypes';
import {IMessage} from 'entities';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {getUserById} from 'services/getUserById';
import {useChatMessages} from 'shared/hooks';
import {ChatTextarea, Message} from 'shared/ui';

import {MessengerStyles as styles} from './Messenger.styles';

type UserData = {
  avatar: string;
  userName: string;
};

export const Messenger = () => {
  const {userId} = useSelector((state: RootState) => state.user);

  const route = useRoute<RouteProp<RootStackParamsList, Screens.MESSENGER>>();

  const {chatId} = route.params;

  const {messages, setMessages} = useChatMessages(chatId);
  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  const [userDataMap, setUserDataMap] = useState<Record<string, UserData>>({});
  const [currentMessage, setCurrentMessage] = useState<string>('');

  useEffect(() => {
    markMessagesAsRead(chatId, userId);
  }, [chatId, userId, messages]);

  useEffect(() => {
    const fetchUserData = async () => {
      const uniqueUserIds = [...new Set(messages.map(m => m.authorId))];
      const dataMap: Record<string, UserData> = {};

      await Promise.all(
        uniqueUserIds.map(async userId => {
          const user = await getUserById(userId);
          dataMap[userId] = {
            avatar: user.avatar,
            userName: user.username,
          };
        }),
      );

      setUserDataMap(dataMap);
    };

    fetchUserData();
  }, [messages]);

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
    const userData = userDataMap[item.authorId];

    return (
      <Message
        status={item.status}
        message={item.message.replace(/\n+$/g, '')}
        isCurrentUser={isCurrentUser}
        avatar={userData?.avatar}
        userName={userData?.userName}
        timestamp={item.createdAt}
      />
    );
  };

  const sendMessage = async (
    chatId: string,
    message: string,
    userId: string,
  ) => {
    const messagesRef = collection(FIREBASE_DB, 'messages');
    const chatsRef = collection(FIREBASE_DB, 'chats');
    const tempMessageId = `temp-${Date.now()}`;

    const cleanMessage = message.replace(/\n+$/g, '');

    const newMessage: IMessage = {
      id: tempMessageId,
      chatId,
      authorId: userId,
      message: cleanMessage,
      createdAt: Date.now(),
      isRead: false,
      status: 'sending',
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      const docRef = await addDoc(messagesRef, {
        chatId,
        authorId: userId,
        message: cleanMessage,
        createdAt: Date.now(),
        isRead: false,
        status: 'sent',
      });

      const chatDocRef = doc(chatsRef, chatId);
      await updateDoc(chatDocRef, {
        lastMessage: cleanMessage,
        time: Date.now(),
        lastMessageAuthorId: userId,
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
    console.log('А не нужно сюда тыкать');
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
