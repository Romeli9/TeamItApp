import {useEffect, useState} from 'react';

import {FIREBASE_DB} from 'app/FireBaseConfig';
import {Chat} from 'entities';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

export const useChatList = (userId: string) => {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const chatsRef = collection(FIREBASE_DB, 'chats');
    const chatsQuery = query(
      chatsRef,
      where('participants', 'array-contains', userId),
      orderBy('time', 'desc'),
    );

    const unsubscribe = onSnapshot(
      chatsQuery,
      snapshot => {
        const fetchedChats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Chat[];

        setChats(fetchedChats);
      },
      error => {
        console.error('Ошибка при получении чатов:', error);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  return chats;
};
