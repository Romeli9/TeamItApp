import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {FIREBASE_DB} from 'app/FireBaseConfig';
import ReviewModal from 'components/ReviewModal';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

export const NotificationsPage = () => {
  const {userId} = useSelector((state: RootState) => state.user);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useAppNavigation();

  // 📌 Подгружаем уведомления
  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(FIREBASE_DB, 'notifications'),
      where('userId', '==', userId),
    );
    const unsub = onSnapshot(q, async snapshot => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        projectId: doc.id,
        ...doc.data(),
      }));

      console.log('list', list);

      // Для каждого уведомления — подгружаем имя проекта
      const listWithProjectNames = await Promise.all(
        list.map(async n => {
          try {
            console.log('n', n);

            const projectRef = doc(FIREBASE_DB, 'projects', n.projectId);

            const projectSnap = await getDoc(projectRef);

            console.log('projectSnap', projectSnap.data());

            const projectName = projectSnap.exists()
              ? projectSnap.data().name
              : 'Неизвестный проект';
            return {...n, projectName};
          } catch {
            return {...n, projectName: 'Ошибка загрузки'};
          }
        }),
      );

      setNotifications(listWithProjectNames);
    });
    return () => unsub();
  }, [userId]);

  // 📌 Открытие модалки с отзывом
  const handleOpenReview = async (notification: any) => {
    setSelectedNotification(notification);

    // Помечаем как прочитанное
    await updateDoc(doc(FIREBASE_DB, 'notifications', notification.id), {
      read: true,
    });

    // Подгружаем данные проекта
    const projectRef = doc(FIREBASE_DB, 'projects', notification.projectId);
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists()) return;
    const data: any = {id: projectSnap.id, ...projectSnap.data()};
    setProjectData(data);

    // Формируем список участников (исключая себя и создателя)
    const users = data.members.filter(
      (id: string) => id !== userId && id !== data.creatorId,
    );
    setParticipants(users);
    setCurrentIndex(0);
    setModalVisible(true);
  };

  const handleNextParticipant = () => {
    if (currentIndex + 1 < participants.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setModalVisible(false);
      setParticipants([]);
      setCurrentIndex(0);
      setSelectedNotification(null);
      setProjectData(null);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Уведомления</Text>

          <FlatList
            data={notifications}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[styles.item, item.read && {backgroundColor: '#eee'}]}
                onPress={() => !item.read && handleOpenReview(item)}>
                <Text>Оставьте отзыв по проекту {item.projectName}</Text>
              </TouchableOpacity>
            )}
          />

          {modalVisible && participants.length > 0 && projectData && (
            <ReviewModal
              visible={modalVisible}
              projectId={projectData.id}
              fromUserId={userId}
              toUserId={participants[currentIndex]}
              role="creator"
              projectData={projectData}
              onSubmitNext={handleNextParticipant}
              onClose={() => {
                setModalVisible(false);
                setParticipants([]);
                setCurrentIndex(0);
                setSelectedNotification(null);
                setProjectData(null);
              }}
            />
          )}

          <Button title="Назад" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#fff'},
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 12},
  item: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
  },
});
