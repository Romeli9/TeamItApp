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
import {useAppNavigation} from 'shared/libs/useAppNavigation';

import {ProfileStyles as styles} from './Profile.styles';

//TODO: сделать роли как в создании проекта
/**
 * Profile component that manages and displays user profile information.
 *
 * This component handles fetching and updating user data from Firestore,
 * displaying user profile images and information, and allowing the user
 * to edit their profile and upload new avatar or background images.
 * It also provides a sign-out functionality, navigating the user back to the login screen.
 */

export const Profile = () => {
  const {navigate} = useAppNavigation();

  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [userDocRef, setUserDocRef] = useState<any>(null);
  const dispatch = useDispatch();

  const {userName, aboutMe, avatar, background} = useSelector(
    (state: RootState) => state.user,
  );

  useEffect(() => {
    /**
     * Fetches user data from Firestore and updates the user state in Redux store.
     *
     * If the user is authenticated, this function fetches the user data from Firestore
     * and updates the user state in Redux store. It also sets the userDocRef state to
     * the user document reference.
     */
    const fetchData = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const firestore = FIREBASE_DB;
        const usersRef = collection(firestore, 'users');
        const userDoc = doc(usersRef, user.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          dispatch(
            setUserData({
              userId: user.uid,
              username: userData.username,
              email: userData.email,
              avatar: userData.avatar,
              background: userData.background,
            }),
          );
          dispatch(setProfileData(userData));
          setUserDocRef(userDoc);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, fetchData);
    return unsubscribe;
  }, [dispatch]);

  const onImageLibraryPress = useCallback(async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Извините, но нам нужно разрешение на доступ к вашей галерее!',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const imageUrl = await uploadImageToFirebase(result.assets[0].uri);
      if (imageUrl) {
        const user = FIREBASE_AUTH.currentUser; // Получаем текущего пользователя
        if (user) {
          dispatch(
            setUserData({
              userId: user.uid,
              username: userName,
              email: user.email,
              avatar: imageUrl,
              background: background,
            }),
          );
          Alert.alert(
            'Изображение загружено!',
            'Ваш новый аватар успешно обновлен.',
          );
        } else {
        }
      }
    }
  }, [dispatch, userName]);

  const backImageLibraryPress = useCallback(async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Извините, но нам нужно разрешение на доступ к вашей галерее!',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const imageUrl = await uploadImageToFirebase1(result.assets[0].uri);
      if (imageUrl) {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          dispatch(
            setUserData({
              userId: user.uid,
              username: userName,
              email: user.email,
              avatar: avatar,
              background: imageUrl,
            }),
          );
          Alert.alert(
            'Изображение загружено!',
            'Ваш новый аватар успешно обновлен.',
          );
        } else {
        }
      }
    }
  }, [dispatch, userName]);

  /**
   * Uploads an image from the given URI to Firebase Storage,
   * then updates the user's avatar URL in Firestore.
   * @param uri The URI of the image to upload
   * @returns The URL of the uploaded image, or null on failure
   */
  const uploadImageToFirebase = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(
        FIREBASE_STORAGE,
        `images/${userName}_${Date.now()}`,
      );

      // Загружаем изображение в Firebase Storage
      await uploadBytes(storageRef, blob);

      // Получаем URL загруженного изображения
      const url = await getDownloadURL(storageRef);

      // Сохраните URL изображения в Firestore
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userDocRef = doc(collection(FIREBASE_DB, 'users'), user.uid);
        await setDoc(userDocRef, {avatar: url}, {merge: true});
      }

      return url; // Возвращаем URL для дальнейшего использования
    } catch (error) {
      console.error('Error uploading image: ', error);
      return null;
    }
  };

  /**
   * Загружает изображение в Firebase Storage и обновляет URL в Firestore
   * @param uri - URL изображения
   * @returns URL загруженного изображения
   */
  const uploadImageToFirebase1 = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(
        FIREBASE_STORAGE,
        `images/${userName}_${Date.now()}`,
      );

      // Загружаем изображение в Firebase Storage
      await uploadBytes(storageRef, blob);

      // Получаем URL загруженного изображения
      const url = await getDownloadURL(storageRef);

      // Сохраните URL изображения в Firestore
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userDocRef = doc(collection(FIREBASE_DB, 'users'), user.uid);
        await setDoc(userDocRef, {background: url}, {merge: true});
      }

      return url;
    } catch (error) {
      console.error('Error uploading image: ', error);
      return null;
    }
  };

  /**
   * Signs out the current user from the Firebase authentication,
   * navigates to the login screen, and clears the user's profile data
   * and projects from the Redux store.
   * Logs an error to the console if the sign-out process fails.
   */
  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigate(Screens.LOGIN);
      dispatch(clearProfileData());
      dispatch(clearProjects());
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <FlatList
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
        data={[{}]}
        renderItem={() => (
          <View style={styles.container}>
            <View style={styles.image_teamIT}>
              <Image
                source={require('shared/assets/teamIt/Case2.png')}
                style={{width: 150, height: 150}}
              />
            </View>
            <View style={styles.image_teamIT}>
              <Image
                source={require('shared/assets/teamIt/Case1.png')}
                style={{width: 150, height: 150}}
              />
            </View>

            <View style={styles.container1}>
              {aboutMe ? (
                <ProfileInfo />
              ) : (
                <View style={styles.profileDataContainer}>
                  <Text>Пожалуйста, заполните свой профиль</Text>
                  <Text>нажмите кнопку справа с верху</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.background_image}
              onPress={backImageLibraryPress}>
              {background ? (
                <Image
                  source={{uri: background}}
                  style={styles.selectedBackgroundImage}
                />
              ) : (
                <Text style={styles.add_image__text}>+</Text>
              )}
            </TouchableOpacity>
            <View style={styles.backselectedImage}>
              <TouchableOpacity
                style={styles.add_image__button}
                onPress={onImageLibraryPress}>
                {avatar ? (
                  <Image source={{uri: avatar}} style={styles.selectedImage} />
                ) : (
                  <Text style={styles.add_image__text}>+</Text>
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>@{userName}</Text>

            {isEditProfileVisible && (
              <EditProfile
                onModalClose={() => setEditProfileVisible(false)}
                userDocRef={userDocRef}
              />
            )}
            <TouchableOpacity style={styles.exitButton} onPress={handleSignOut}>
              <Image
                source={require('shared/assets/profile/exit.png')}
                style={{width: 25, height: 23}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setEditProfileVisible(true)}>
              <Image
                source={require('shared/assets/profile/edit.png')}
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </SafeAreaProvider>
  );
};
