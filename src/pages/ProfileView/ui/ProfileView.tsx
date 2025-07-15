import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {FIREBASE_DB} from 'app/FireBaseConfig';
import {Screens} from 'app/navigation/navigationEnums';
import {ProfileStackParamsList} from 'app/navigation/navigationTypes';
import {InviteModal} from 'components';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {getUserById} from 'services/getUserById';
import {ArrowLeftIcon} from 'shared/icons';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

import {ProfileViewStyles as styles} from './ProfileView.styles';

export const ProfileView = () => {
  const route =
    useRoute<RouteProp<ProfileStackParamsList, Screens.VIEW_PROFILE>>();
  const {userId} = route.params;
  const navigation = useAppNavigation();
  const [userData, setUserData] = useState<any>(null);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [isInviteModalVisible, setInviteModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          // Загружаем данные пользователя
          const userData = await getUserById(userId);
          setUserData(userData);

          // Загружаем проекты пользователя
          const projectsRef = collection(FIREBASE_DB, 'projects');
          const q = query(projectsRef, where('creatorId', '==', userId));
          const querySnapshot = await getDocs(q);

          const projects = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setUserProjects(projects);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setProjectsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const renderProjectItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.projectItem}
      onPress={() =>
        navigation.navigate(Screens.PROJECT, {projectId: item.id})
      }>
      <Image source={{uri: item.photo}} style={styles.projectImage} />
      <Text style={styles.projectName}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BE9DE8" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Пользователь не найден</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Фон профиля */}
        <View style={styles.backgroundContainer}>
          {userData.background && (
            <Image
              source={{uri: userData.background}}
              style={styles.backgroundImage}
            />
          )}
        </View>

        {/* Аватар */}
        <View style={styles.avatarContainer}>
          {userData.avatar ? (
            <Image source={{uri: userData.avatar}} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>+</Text>
            </View>
          )}
        </View>

        {/* Основная информация */}
        <View style={styles.infoContainer}>
          <Text style={styles.username}>@{userData.username}</Text>

          {/* Информация о профиле */}
          <View style={styles.profileInfoContainer}>
            {userData.AboutMe && (
              <Text style={styles.text}>Обо мне: {userData.AboutMe}</Text>
            )}

            {userData.Experience && (
              <Text style={styles.text}>Опыт: {userData.Experience}</Text>
            )}

            {userData.Telegramm && (
              <Text style={styles.text}>Телеграм: {userData.Telegramm}</Text>
            )}

            {userData.HardSkills && (
              <Text style={styles.text}>
                HardSkills:{' '}
                {JSON.parse(userData.HardSkills)
                  .map((item: {name: string}) => item.name)
                  .join(', ')}
              </Text>
            )}

            {userData.SoftSkills && (
              <Text style={styles.text}>
                SoftSkills:{' '}
                {JSON.parse(userData.SoftSkills)
                  .map((item: {name: string}) => item.name)
                  .join(', ')}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.invite}
            onPress={() => setInviteModalVisible(true)}>
            <Text style={styles.inviteProject}>Пригласить в проект</Text>
          </TouchableOpacity>

          {/* Проекты */}
          <Text style={styles.projectsTitle}>Проекты:</Text>
        </View>
        {userProjects.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={userProjects}
            renderItem={renderProjectItem}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.projectsList}
          />
        ) : (
          <Text style={styles.noProjectsText}>Нет созданных проектов</Text>
        )}

        {isInviteModalVisible && userId && (
          <InviteModal
            onModalClose={() => setInviteModalVisible(false)}
            userData={userData}
            userIdRec={userId}
          />
        )}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.goback}>
          <ArrowLeftIcon size={24} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaProvider>
  );
};
