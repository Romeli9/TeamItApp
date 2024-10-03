import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FireBaseConfig';

// Функция для получения данных пользователя по его ID
export const getUserById = async (userId: string) => {
  try {
    const userRef = doc(FIREBASE_DB, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData;
    } else {
      throw new Error('Пользователь не найден');
    }
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    throw error;
  }
};
