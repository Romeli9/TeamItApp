import {useEffect, useRef, useState} from 'react';

import {getFileUrl} from 'api';
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
  const imageCache = useRef<Record<string, {uri: string} | any>>({});
  const prevChatsRef = useRef<Chat[]>([]);

  useEffect(() => {
    if (!userId) return;

    const defaultImage = '../assets/icons/mqdefault.jpg';
    const chatsRef = collection(FIREBASE_DB, 'chats');
    const chatsQuery = query(
      chatsRef,
      where('participants', 'array-contains', userId),
      orderBy('time', 'desc'),
    );

    const unsubscribe = onSnapshot(
      chatsQuery,
      async snapshot => {
        const fetchedChats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Chat[];

        // Проверяем, действительно ли данные изменились
        const hasChanges =
          JSON.stringify(fetchedChats) !== JSON.stringify(prevChatsRef.current);

        if (!hasChanges) {
          return; // Данные не изменились, выходим
        }

        await Promise.all(
          fetchedChats.map(async chat => {
            try {
              if (!chat.image) {
                chat.image = defaultImage;
                return;
              }

              if (
                typeof chat.image === 'string' &&
                chat.image.startsWith('http')
              ) {
                return;
              }

              if (imageCache.current[chat.image]) {
                chat.image = imageCache.current[chat.image];
                return;
              }

              const url = await getFileUrl(chat.image);
              imageCache.current[chat.image] = url;
              chat.image = url;
            } catch (err: any) {
              console.warn(
                `⚠️ Не удалось загрузить изображение для чата ${chat.id}: ${err.message}`,
              );
              chat.image = defaultImage;
            }
          }),
        );

        prevChatsRef.current = fetchedChats;
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
