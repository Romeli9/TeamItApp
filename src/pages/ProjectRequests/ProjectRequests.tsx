import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {FIREBASE_DB} from 'app/FireBaseConfig';
import {Screens} from 'app/navigation/navigationEnums';
import {ProjectRequest} from 'entities';
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

import {ProjectRequestsStyles as styles} from './ProjectRequests.styles';

export const ProjectRequests = () => {
  const {userId} = useSelector((state: RootState) => state.user);
  const navigation = useAppNavigation();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      const q = query(
        collection(FIREBASE_DB, 'projectRequests'),
        where('recipientId', '==', userId),
      );

      const sentQ = query(
        collection(FIREBASE_DB, 'projectRequests'),
        where('senderId', '==', userId),
      );

      const [receivedSnapshot, sentSnapshot] = await Promise.all([
        getDocs(q),
        getDocs(sentQ),
      ]);

      const receivedRequests = receivedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'received',
      })) as ProjectRequest[];

      const sentRequests = sentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'sent',
      })) as ProjectRequest[];

      setRequests([...receivedRequests, ...sentRequests]);
    } catch (error) {
      console.error('Error fetching requests:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить заявки');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const addUserToProject = async (
    projectId: string,
    role: string,
    userId: string,
  ) => {
    try {
      const projectRef = doc(FIREBASE_DB, 'projects', projectId);
      const projectSnapshot = await getDoc(projectRef);

      if (projectSnapshot.exists()) {
        const projectData = projectSnapshot.data();
        const roleIndex = projectData?.required?.indexOf(role);

        if (roleIndex !== -1) {
          // Создаем новый массив members с обновленным пользователем
          const newMembers = [...(projectData?.members || [])];
          newMembers[roleIndex] = userId;

          await updateDoc(projectRef, {
            members: newMembers,
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error adding user to project:', error);
      return false;
    }
  };

  const addUserToProjectChat = async (projectId: string, userId: string) => {
    try {
      const chatsQuery = query(
        collection(FIREBASE_DB, 'chats'),
        where('projectId', '==', projectId),
        limit(1),
      );

      const querySnapshot = await getDocs(chatsQuery);

      if (!querySnapshot.empty) {
        const chatDoc = querySnapshot.docs[0];

        await updateDoc(chatDoc.ref, {
          participants: [...chatDoc.data().participants, userId],
        });
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleAccept = async (request: ProjectRequest) => {
    try {
      // Добавляем пользователя в проект
      const success = await addUserToProject(
        request.projectId,
        request.role,
        request.senderId,
      );

      if (!success) {
        throw new Error('Не удалось добавить пользователя в проект');
      }

      // Добавляем пользователя в чат
      const chatUpdateSuccess = await addUserToProjectChat(
        request.projectId,
        request.senderId,
      );

      if (!chatUpdateSuccess) {
        console.warn('Пользователь добавлен в проект, но не в чат');
      }

      // Удаляем заявку
      await deleteDoc(doc(FIREBASE_DB, 'projectRequests', request.id));

      setRequests(requests.filter(req => req.id !== request.id));
      Alert.alert('Успешно', 'Заявка принята');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось принять заявку');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      // Удаляем заявку
      await deleteDoc(doc(FIREBASE_DB, 'projectRequests', requestId));

      setRequests(requests.filter(req => req.id !== requestId));
      Alert.alert('Успешно', 'Заявка отклонена');
    } catch (error) {
      console.error('Error rejecting request:', error);
      Alert.alert('Ошибка', 'Не удалось отклонить заявку');
    }
  };

  const handleCancel = async (requestId: string) => {
    try {
      // Удаляем заявку
      await deleteDoc(doc(FIREBASE_DB, 'projectRequests', requestId));

      setRequests(requests.filter(req => req.id !== requestId));
      Alert.alert('Успешно', 'Заявка отменена');
    } catch (error) {
      console.error('Error cancelling request:', error);
      Alert.alert('Ошибка', 'Не удалось отменить заявку');
    }
  };

  const renderRequestItem = ({item}: {item: ProjectRequest}) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestTitle}>
        {item.type === 'received' ? 'Входящая заявка' : 'Исходящая заявка'}
      </Text>
      <Text style={styles.requestRole}>Роль: {item.role}</Text>
      <Text style={styles.requestMessage}>{item.message}</Text>

      {item.type === 'received' ? (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleAccept(item)}>
            <Text style={styles.buttonText}>Принять</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleReject(item.id)}>
            <Text style={styles.buttonText}>Отклонить</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => handleCancel(item.id)}>
          <Text style={styles.buttonText}>Отменить</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() =>
          navigation.navigate(Screens.PROJECT, {projectId: item.projectId})
        }>
        <Text style={styles.projectLink}>Перейти к проекту</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#BE9DE8" />
        </View>
      ) : requests.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Text style={styles.emptyText}>Нет активных заявок</Text>
        </ScrollView>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={item => `${item.id}_${item.type}`}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};
