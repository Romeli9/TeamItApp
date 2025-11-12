import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {getFileUrl, uploadFile} from 'api';
import {FIREBASE_AUTH, FIREBASE_DB} from 'app/FireBaseConfig';
import {Screens} from 'app/navigation/navigationEnums';
import {EditProfile, ProfileInfo} from 'components';
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
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {calculateAchievements} from 'redux/slices/achievementsSlice';
import {calculateAuthorStats} from 'redux/slices/authorStatsSlice';
import {
  ProjectType,
  clearProjects,
  setYourProjects,
} from 'redux/slices/projectsSlice';
import {
  fetchUserReviews,
  selectReviews,
  selectReviewsLoading,
} from 'redux/slices/reviewsSlice';
import {
  clearProfileData,
  setProfileData,
  setUserData,
} from 'redux/slices/userSlice';
import {AppDispatch, RootState} from 'redux/store';
import {BellIcon} from 'shared/assets/icons/icons';
import {EditIcon, ExitIcon, PlusIcon, StarIcon} from 'shared/icons';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

import {ProfileStyles as styles} from './Profile.styles';

export const Profile = () => {
  const {navigate} = useAppNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [userDocRef, setUserDocRef] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const {userName, aboutMe, avatar, background, userId} = useSelector(
    (state: RootState) => state.user,
  );

  const [projects, setProjects] = useState<ProjectType[]>([]);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  const reviews = useSelector(selectReviews);
  const loading = useSelector(selectReviewsLoading);

  // После загрузки проектов и отзывов:
  useEffect(() => {
    if (projects.length && reviews.length) {
      dispatch(calculateAuthorStats({projects, reviews, authorId: userId}));
      dispatch(calculateAchievements({projects, reviews, userId}));
    }
  }, [projects, reviews, userId]);

  useEffect(() => {
    dispatch(fetchUserReviews(userId));
  }, [userId]);

  useEffect(() => {
    async function loadUrls() {
      if (avatar) {
        const url = await getFileUrl(avatar);
        setAvatarUrl(url);
      }
      if (background) {
        const url = await getFileUrl(background);
        setBackgroundUrl(url);
      }
    }
    loadUrls();
  }, [avatar, background]);

  const fetchUserData = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) return;
      const userRef = doc(collection(FIREBASE_DB, 'users'), user.uid);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) return;
      const data = snapshot.data();

      dispatch(
        setUserData({
          userId: user.uid,
          username: data.username,
          email: data.email,
          avatar: data.avatar,
          background: data.background,
        }),
      );
      dispatch(setProfileData(data));
      setUserDocRef(userRef);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, fetchUserData);
    return unsubscribe;
  }, [fetchUserData]);

  useEffect(() => {
    fetchUserProjects();
  }, []);

  const fetchUserProjects = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const usersRef = collection(FIREBASE_DB, 'users');
        const userDoc = doc(usersRef, user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const projectsRef = collection(FIREBASE_DB, 'projects');
          const querySnapshot = await getDocs(
            query(projectsRef, where('creatorId', '==', docSnap.id)),
          );

          if (querySnapshot.docs.length > 0) {
            const projectsData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              creator: doc.data().creator,
              creatorId: doc.data().creatorId,
              description: doc.data().description,
              name: doc.data().name,
              photo: doc.data().photo,
              required: doc.data().required,
              categories: doc.data().categories,
              members: doc.data().members,
              HardSkills: doc.data().HardSkills,
              SoftSkills: doc.data().SoftSkills,
              status: doc.data().status ?? 'started',
            }));

            const defaultPhoto = require('../../../shared/assets/icons/mqdefault.jpg');

            const projectsWithPhotoUrl = await Promise.all(
              projectsData.map(async project => {
                if (project.photo) {
                  try {
                    const url = await getFileUrl(project.photo);
                    return {...project, photo: {uri: url}};
                  } catch (err) {
                    return {...project, photo: defaultPhoto};
                  }
                }
                return {...project, photo: defaultPhoto};
              }),
            );
            setProjects(projectsWithPhotoUrl);
            dispatch(setYourProjects(projectsWithPhotoUrl));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching projects: ', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  }, [fetchUserData]);

  const handleImageUpload = useCallback(
    async (field: 'avatar' | 'background') => {
      try {
        // Запрос разрешений
        const {status} =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          return Alert.alert('Ошибка', 'Нужно разрешение на доступ к галерее');
        }

        // Выбор изображения
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
        });

        if (result.canceled) return null;

        const imageUri = result.assets[0].uri;
        const fileName = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(fileName || '');
        const type = match ? `image/${match[1]}` : 'image';

        // Формируем FormData для отправки на сервер
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          name: fileName,
          type,
        } as any);

        const fileId = await uploadFile(formData);

        if (!fileId) throw new Error('Upload failed');

        // Сохраняем ссылку в Firestore (можно оставить Firebase DB)
        const user = FIREBASE_AUTH.currentUser;

        if (!user) return null;

        const userRef = doc(collection(FIREBASE_DB, 'users'), user.uid);

        await setDoc(userRef, {[field]: fileId}, {merge: true});

        dispatch(
          setUserData({
            userId: user.uid,
            username: userName,
            email: user.email,
            avatar: field === 'avatar' ? fileId : avatar,
            background: field === 'background' ? fileId : background,
          }),
        );

        Alert.alert(
          'Успешно',
          `${field === 'avatar' ? 'Аватар' : 'Фон'} обновлён.`,
        );
      } catch (err) {
        console.error('Image upload error:', err);
        Alert.alert('Ошибка', 'Не удалось загрузить файл');
      }
    },
    [avatar, background, dispatch, userName],
  );

  const pickImage = useCallback(
    (field: 'avatar' | 'background') => {
      handleImageUpload(field);
    },
    [handleImageUpload],
  );

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      dispatch(clearProfileData());
      dispatch(clearProjects());
      navigate(Screens.LOGIN);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <FlatList
        data={[{}]}
        keyExtractor={(_, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={() => (
          <View style={styles.container}>
            <View style={styles.background_image}>
              <TouchableOpacity
                style={styles.background}
                onPress={() => pickImage('background')}>
                {backgroundUrl && <Image source={{uri: backgroundUrl}} />}
              </TouchableOpacity>

              <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                  <TouchableOpacity onPress={() => pickImage('avatar')}>
                    {avatarUrl ? (
                      <Image
                        style={styles.avatarImage}
                        source={{uri: avatarUrl}}
                      />
                    ) : (
                      <PlusIcon size={30} />
                    )}
                  </TouchableOpacity>
                </View>

                <Text style={styles.userName}>@{userName}</Text>
              </View>
            </View>

            {/* Блок с кнопками для редактирования и выхода из аккаунта */}
            <View style={styles.containerButtons}>
              <View style={styles.actionButtonsProfileLeft}>
                <TouchableOpacity
                  onPress={() => navigate(Screens.NOTIFICATION)}>
                  <BellIcon size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigate(Screens.NOTIFICATION)}>
                  <StarIcon size={24} />
                </TouchableOpacity>
              </View>
              <View style={styles.actionButtonsProfileRight}>
                <TouchableOpacity onPress={() => setEditProfileVisible(true)}>
                  <EditIcon size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignOut}>
                  <ExitIcon size={24} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.profileInfo}>
              {aboutMe ? (
                <ProfileInfo projects={projects} />
              ) : (
                <View>
                  <Text>Пожалуйста, заполните свой профиль</Text>
                  <Text>нажмите кнопку справа сверху</Text>
                </View>
              )}
            </View>

            {isEditProfileVisible && (
              <EditProfile
                onModalClose={() => setEditProfileVisible(false)}
                userDocRef={userDocRef}
              />
            )}
          </View>
        )}
      />
    </SafeAreaProvider>
  );
};
