import {FIREBASE_DB} from 'app/FireBaseConfig';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

// Тип отзыва
export type Review = {
  id?: string;
  projectId: string;
  fromUserId: string;
  toUserId: string;
  role: 'creator' | 'member';

  // оценки от автора проекта (creator → member)
  hardSkills?: number;
  softSkills?: number;
  deadlines?: number;
  contribution?: number;

  // оценки от участников (member → creator)
  overall?: number;
  strengths?: string[];

  comment?: string;
  createdAt: number;
};

// 🔹 Добавить отзыв
export const addReview = async (
  review: Omit<Review, 'id' | 'createdAt'>,
): Promise<string> => {
  const docRef = await addDoc(collection(FIREBASE_DB, 'reviews'), {
    ...review,
    createdAt: Date.now(),
  });

  // после добавления сразу обновляем профиль получателя
  await updateUserRating(review.toUserId);
  await updateUserStrengths(review.toUserId);

  return docRef.id;
};

// 🔹 Получить все отзывы по пользователю
export const getUserReviews = async (userId: string): Promise<Review[]> => {
  const q = query(
    collection(FIREBASE_DB, 'reviews'),
    where('toUserId', '==', userId),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Review[];
};

// 🔹 Пересчёт рейтинга (среднее всех числовых оценок)
export const updateUserRating = async (userId: string) => {
  const reviews = await getUserReviews(userId);

  if (reviews.length === 0) return;

  let sum = 0;
  let count = 0;

  reviews.forEach(r => {
    const scores = [
      r.hardSkills,
      r.softSkills,
      r.deadlines,
      r.contribution,
      r.overall,
    ].filter(v => v !== undefined) as number[];

    sum += scores.reduce((a, b) => a + b, 0);
    count += scores.length;
  });

  const avg = sum / count;

  const userRef = doc(FIREBASE_DB, 'users', userId);
  await updateDoc(userRef, {
    rating: avg,
    reviewsCount: reviews.length,
  });
};

// 🔹 Счётчик сильных сторон (strengths)
export const updateUserStrengths = async (userId: string) => {
  const reviews = await getUserReviews(userId);

  const strengthsCount: Record<string, number> = {};
  reviews.forEach(r => {
    r.strengths?.forEach(s => {
      strengthsCount[s] = (strengthsCount[s] || 0) + 1;
    });
  });

  const userRef = doc(FIREBASE_DB, 'users', userId);
  await updateDoc(userRef, {strengths: strengthsCount});
};
