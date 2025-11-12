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

  useEffect(() => {
    if (!userId) return;

    const defaultImage = require('../assets/icons/mqdefault.jpg');
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

        await Promise.all(
          fetchedChats.map(async chat => {
            try {
              // если нет изображения → дефолт
              if (!chat.image) {
                chat.image = defaultImage;
                return;
              }

              // если уже https-ссылка → оставляем как есть
              if (
                typeof chat.image === 'string' &&
                chat.image.startsWith('http')
              ) {
                chat.image = chat.image;
                return;
              }

              // если уже был закэширован
              if (imageCache.current[chat.image]) {
                chat.image = imageCache.current[chat.image];
                return;
              }

              // иначе — пробуем получить URL из Firebase Storage
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
