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
import {FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE} from 'app/FireBaseConfig';
import {Screens} from 'app/navigation/navigationEnums';
import {EditProfile, ProfileInfo} from 'components';
import * as ImagePicker from 'expo-image-picker';
import {onAuthStateChanged} from 'firebase/auth';
import {collection, doc, getDoc, setDoc} from 'firebase/firestore';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {clearProjects} from 'redux/slices/projectsSlice';
import {
  clearProfileData,
  setProfileData,
  setUserData,
} from 'redux/slices/userSlice';
import {RootState} from 'redux/store';
import {EditProfileIcon, ExitIcon, PlusIcon} from 'shared/icons';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

import {ProfileStyles as styles} from './Profile.styles';

export const Profile = () => {
  const {navigate} = useAppNavigation();
  const dispatch = useDispatch();

  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [userDocRef, setUserDocRef] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const {userName, aboutMe, avatar, background} = useSelector(
    (state: RootState) => state.user,
  );

  const fetchUserData = useCallback(async () => {
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
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, fetchUserData);
    return unsubscribe;
  }, [fetchUserData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  }, [fetchUserData]);

  const handleImageUpload = useCallback(
    async (uri: string, field: 'avatar' | 'background') => {
      try {
        console.log('field', field);
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

        console.log('result', result);

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

        console.log('formData', formData);

        const fileId = await uploadFile(formData);
        console.log(fileId);

        if (!fileId) throw new Error('Upload failed');

        // Сохраняем ссылку в Firestore (можно оставить Firebase DB)
        const user = FIREBASE_AUTH.currentUser;
        if (!user) return null;

        const userRef = doc(collection(FIREBASE_DB, 'users'), user.uid);
        await setDoc(userRef, {[field]: fileId}, {merge: true});

        // Обновляем Redux state (сохраняем id)
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
      console.log('field in pickImage', field);
      handleImageUpload('', field);
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
                {background && <Image source={{uri: background}} />}
              </TouchableOpacity>

              <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                  <TouchableOpacity onPress={() => pickImage('avatar')}>
                    {avatar ? (
                      <Image
                        style={styles.avatarImage}
                        source={{uri: avatar}}
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
            <View style={styles.actionButtonsProfile}>
              <TouchableOpacity onPress={() => setEditProfileVisible(true)}>
                <EditProfileIcon />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSignOut}>
                <ExitIcon />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              {aboutMe ? (
                <ProfileInfo />
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
