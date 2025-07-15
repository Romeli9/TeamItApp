// Refactored Profile.tsx component
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
  const {userName, aboutMe, avatar, background} = useSelector(
    (state: RootState) => state.user,
  );

  useEffect(() => {
    const fetchUserData = async () => {
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
    };

    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, fetchUserData);
    return unsubscribe;
  }, [dispatch]);

  const handleImageUpload = useCallback(
    async (uri: string, field: 'avatar' | 'background') => {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(
          FIREBASE_STORAGE,
          `images/${userName}_${Date.now()}`,
        );
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        const user = FIREBASE_AUTH.currentUser;
        if (!user) return null;

        await setDoc(
          doc(collection(FIREBASE_DB, 'users'), user.uid),
          {
            [field]: downloadURL,
          },
          {merge: true},
        );

        dispatch(
          setUserData({
            userId: user.uid,
            username: userName,
            email: user.email,
            avatar: field === 'avatar' ? downloadURL : avatar,
            background: field === 'background' ? downloadURL : background,
          }),
        );

        Alert.alert(
          'Успешно',
          `${field === 'avatar' ? 'Аватар' : 'Фон'} обновлён.`,
        );
        return downloadURL;
      } catch (err) {
        console.error('Image upload error:', err);
        return null;
      }
    },
    [avatar, background, dispatch, userName],
  );

  const pickImage = async (field: 'avatar' | 'background') => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Ошибка', 'Нужно разрешение на доступ к галерее');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      await handleImageUpload(result.assets[0].uri, field);
    }
  };

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
