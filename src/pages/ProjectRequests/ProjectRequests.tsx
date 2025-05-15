import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {FIREBASE_DB} from 'app/FireBaseConfig';
import {Screens, Stacks} from 'app/navigation/navigationEnums';
import {ProjectRouteParams} from 'app/navigation/navigationTypes';
import {Skill} from 'components';
import {ProjectRequest} from 'entities';
import {
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
import {ProjectType, selectProjectById} from 'redux/slices/projectsSlice';
import {RootState} from 'redux/store';
import {getUserById} from 'services/getUserById';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

import {ProjectRequestsStyles as styles} from './ProjectRequests.styles';

export const ProjectRequests = () => {
  const {navigate} = useAppNavigation();

  const route = useRoute<RouteProp<{params: ProjectRouteParams}>>();

  const {userId} = useSelector((state: RootState) => state.user);
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const {projectId} = route.params;

  console.log('prId', projectId);

  const projectData: ProjectType | undefined = useSelector(
    selectProjectById(projectId),
  );

  console.log('projectData', projectData);

  useEffect(() => {
    fetchRequests();
  }, [projectId]);

  const fetchRequests = async () => {
    try {
      const q = query(
        collection(FIREBASE_DB, 'projectRequests'),
        where('recipientId', '==', userId),
        where('projectId', '==', projectId),
      );

      const receivedSnapshot = await getDocs(q);

      const receivedRequests = await Promise.all(
        receivedSnapshot.docs.map(async doc => {
          const data = doc.data();

          const user = await getUserById(userId);
          let userHardSkills = user.HardSkills || [];
          let userSoftSkills = user.SoftSkills || [];

          if (typeof userHardSkills === 'string') {
            userHardSkills = JSON.parse(userHardSkills);
          }
          if (typeof userSoftSkills === 'string') {
            userSoftSkills = JSON.parse(userSoftSkills);
          }

          if (Array.isArray(userHardSkills)) {
            userHardSkills = userHardSkills.map(
              (item: {name: string}) => item.name,
            );
          }
          if (Array.isArray(userSoftSkills)) {
            userSoftSkills = userSoftSkills.map(
              (item: {name: string}) => item.name,
            );
          }

          console.log('project hard skills:', projectData?.HardSkills);
          console.log('project soft skills:', projectData?.SoftSkills);

          const hardSkillsProject =
            typeof projectData?.HardSkills === 'string'
              ? JSON.parse(projectData.HardSkills).map(
                  (item: {name: string}) => item.name,
                )
              : [];

          const softSkillsProject =
            typeof projectData?.SoftSkills === 'string'
              ? JSON.parse(projectData.SoftSkills).map(
                  (item: {name: string}) => item.name,
                )
              : [];

          let matchingHardSkillsCount = 0;
          let matchingSoftSkillsCount = 0;

          console.log(hardSkillsProject);
          console.log(softSkillsProject);
          console.log(userHardSkills);
          console.log(userSoftSkills);

          hardSkillsProject.forEach((skill: string) => {
            if (userHardSkills.includes(skill)) {
              matchingHardSkillsCount += 1;
            }
          });

          console.log('matchingHardSkillsCount:', matchingHardSkillsCount);

          softSkillsProject.forEach((skill: string) => {
            if (userSoftSkills.includes(skill)) {
              matchingSoftSkillsCount += 1;
            }
          });

          console.log('matchingSoftSkillsCount:', matchingSoftSkillsCount);

          const totalUserHardSkills = userHardSkills.length;
          const totalProjectHardSkills = hardSkillsProject.length;
          const totalMatchingHardSkills = matchingHardSkillsCount;

          const FirstCoef =
            (totalMatchingHardSkills /
              Math.sqrt(totalUserHardSkills * totalProjectHardSkills)) *
            0.7;

          console.log('FirstCoef:', FirstCoef);

          const totalUserSoftSkills = userSoftSkills.length;
          const totalProjectSoftSkills = softSkillsProject.length;
          const totalMatchingSoftSkills = matchingSoftSkillsCount;

          console.log('totalMatchingSoftSkills:', totalMatchingSoftSkills);

          const SecondCoef =
            (totalMatchingSoftSkills /
              Math.sqrt(totalUserSoftSkills * totalProjectSoftSkills)) *
            0.3;

          console.log('SecondCoef:', SecondCoef);

          const matchScore = FirstCoef + SecondCoef;

          console.log('Match Score:', matchScore);

          const finalScore = matchScore;

          console.log('Final Score:', finalScore);

          return {
            id: doc.id,
            senderId: data.senderId,
            projectId: data.projectId,
            projectName: data.projectName,
            senderName: data.senderName,
            recipientId: data.recipientId,
            recipientName: data.recipientName,
            role: data.role,
            message: data.message,
            status: data.status,
            createdAt: data.createdAt,
            type: 'received' as 'received',
            priorityScore: finalScore,
          };
        }),
      );

      setRequests(receivedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить заявки');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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
      <Text style={styles.requestMessage}>Имя: {item.senderName}</Text>
      <Text style={styles.requestMessage}>Роль: {item.role}</Text>
      <Text style={styles.requestMessage}>{item.message}</Text>

      <Text style={styles.requestPriority}>
        Коэффициент приоритета: {item.priorityScore.toFixed(2)}
      </Text>

      {/* Кнопки для принятия/отклонения заявки */}
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

      {/* Кнопка для перехода на профиль пользователя */}
      <TouchableOpacity onPress={() => handleUserClick(item.senderId)}>
        <Text style={styles.profileLink}>Перейти в профиль</Text>
      </TouchableOpacity>
    </View>
  );

  const handleUserClick = (userId: string) => {
    navigate(Stacks.MAIN, {
      screen: Stacks.PROFILE_TAB,
      params: {
        screen: Screens.VIEW_PROFILE,
        params: {userId: userId},
      },
    });
  };

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
