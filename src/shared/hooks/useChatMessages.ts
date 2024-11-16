import {useEffect, useState} from 'react';

import {FIREBASE_DB} from 'app/FireBaseConfig';
import {IMessage} from 'entities';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

export const useChatMessages = (chatId: string) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const messagesRef = collection(FIREBASE_DB, 'messages');
    const messagesQuery = query(
      messagesRef,
      where('chatId', '==', chatId),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      snapshot => {
        const fetchedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as IMessage[];
        setMessages(fetchedMessages);
      },
      error => {
        console.error('Ошибка при получении сообщений:', error);
      },
    );

    return () => unsubscribe();
  }, [chatId]);

  return messages;
};
