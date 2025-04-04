import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE} from 'app/FireBaseConfig';
import {Screens} from 'app/navigation/navigationEnums';
import {ProfileStackParamsList} from 'app/navigation/navigationTypes';
import {EditProfile, InviteModal, ProfileInfo} from 'components';
import * as ImagePicker from 'expo-image-picker';
import {onAuthStateChanged} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {setProfileData, setUserData, userState} from 'redux/slices/userSlice';
import {RootState} from 'redux/store';
import {getUserById} from 'services/getUserById';
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

  console.log('NEW MEGA SUPER DUPER PROFILE VIEW');

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
      <Text style={styles.projectTitle}>{item.name}</Text>
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
      <ScrollView contentContainerStyle={styles.container}>
        {/* Аватар и основная информация */}
        <View style={styles.avatarContainer}>
          {userData.avatar ? (
            <Image source={{uri: userData.avatar}} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>Фото</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.username}>@{userData.username}</Text>

          {userData.aboutMe && (
            <Text style={styles.aboutMe}>{userData.aboutMe}</Text>
          )}

          {/* Навыки */}
          {userData.skills && userData.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Навыки</Text>
              <View style={styles.skillsContainer}>
                {userData.skills.map((skill: string, index: number) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Опыт */}
          {userData.experience && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Опыт</Text>
              <Text style={styles.experience}>{userData.experience}</Text>
            </View>
          )}

          {/* Проекты пользователя */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Проекты</Text>
            {projectsLoading ? (
              <ActivityIndicator size="small" color="#BE9DE8" />
            ) : userProjects.length > 0 ? (
              <FlatList
                horizontal
                data={userProjects}
                renderItem={renderProjectItem}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.projectsList}
              />
            ) : (
              <Text style={styles.noProjectsText}>Нет созданных проектов</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};
