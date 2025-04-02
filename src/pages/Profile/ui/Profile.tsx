import {RouteProp, useRoute} from '@react-navigation/native';
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
import {
  ProfileStackParamsList,
  RootStackParamsList,
} from 'app/navigation/navigationTypes';
import {EditProfile, InviteModal, ProfileInfo} from 'components';
import * as ImagePicker from 'expo-image-picker';
import {onAuthStateChanged} from 'firebase/auth';
import {collection, doc, getDoc, setDoc} from 'firebase/firestore';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {setProfileData, setUserData, userState} from 'redux/slices/userSlice';
import {RootState} from 'redux/store';
import {getUserById} from 'services/getUserById';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

import {ProfileStyles as styles} from './Profile.styles';

export const Profile = () => {
  const {navigate} = useAppNavigation();

  const route = useRoute<RouteProp<ProfileStackParamsList, Screens.PROFILE>>();

  const {userId} = route.params || {};

  const [isUserInProject, setIsUserInProject] = useState(false);
  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [isInviteModalVisible, setInviteModalVisible] = useState(false);
  const [userDocRef, setUserDocRef] = useState<any>(null);
  const dispatch = useDispatch();

  const {userName, aboutMe, avatar, background} = useSelector(
    (state: RootState) => state.user,
  );

  useEffect(() => {
    getUser();
  }, [userId]);

  const getUser = async () => {
    if (userId) {
      let userInfo = await getUserById(userId);
      dispatch(
        setUserData({
          userId: userId,
          username: userInfo.username,
          email: userInfo.email,
          avatar: userInfo.avatar,
          background: userInfo.background,
        }),
      );
      dispatch(setProfileData(userInfo));

      // setUser(userInfo);
    }
  };

  useEffect(() => {
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
        const user = FIREBASE_AUTH.currentUser; // Получаем текущего пользователя
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
  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigate(Screens.LOGIN);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    const checkUserInProject = () => {
      const currentUser = FIREBASE_AUTH.currentUser;
      //console.log(currentUser);
      /*  if (currentUser) {
        setIsUserInProject(currentUser.uid === userId); // Сравниваем текущий uid с переданным userId
      }*/
    };

    checkUserInProject();
  }, [userId]);

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
            {isInviteModalVisible && (
              <InviteModal
                onModalClose={() => setInviteModalVisible(false)}
                userDocRef={userDocRef}
                Project={{
                  projectId: '',
                }}
              />
            )}

            {
              //userId && (
              <TouchableOpacity
                style={styles.invite}
                onPress={() => setInviteModalVisible(true)}>
                <Text style={styles.inviteProject}>Пригласить в проект</Text>
              </TouchableOpacity>
            }

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
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaProvider>
  );
};
