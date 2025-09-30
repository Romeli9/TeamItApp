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

  // Кэш для картинок (ключ = storagePath, значение = https URL)
  const imageCache = useRef<Record<string, string>>({});

  useEffect(() => {
    const chatsRef = collection(FIREBASE_DB, 'chats');
    const chatsQuery = query(
      chatsRef,
      where('participants', 'array-contains', userId),
      orderBy('time', 'desc'),
    );

    const unsubscribe = onSnapshot(
      chatsQuery,
      async snapshot => {
        let fetchedChats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Chat[];

        await Promise.all(
          fetchedChats.map(async chat => {
            if (chat.image) {
              // если это уже готовый https-url → не трогаем
              if (chat.image.startsWith('http')) {
                return;
              }

              // если ссылка закэширована → берём из кэша
              if (imageCache.current[chat.image]) {
                chat.image = imageCache.current[chat.image];
                return;
              }

              // иначе качаем и сохраняем в кэш
              const url = await getFileUrl(chat.image);
              imageCache.current[chat.image] = url;
              chat.image = url;
            }
          }),
        );
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
