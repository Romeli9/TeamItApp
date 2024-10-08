import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {onAuthStateChanged} from 'firebase/auth';
import {collection, doc, getDoc, setDoc} from 'firebase/firestore';
import {useSelector, useDispatch} from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import {FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE} from '../../FireBaseConfig';
import {setUserData, setProfileData} from 'redux/slices/userSlice';
import EditProfile from 'components/EditProfile';
import {RootState} from 'redux/store';
import ProfileInfo from 'components/ProfileInfo';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Profile: React.FC<{navigation: any}> = ({navigation}) => {
  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [userDocRef, setUserDocRef] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const dispatch = useDispatch();
  const [pickerResponse, setPickerResponse] =
    useState<ImagePicker.ImagePickerResult | null>(null);

  const {userName, aboutMe, avatar, background} = useSelector((state: RootState) => state.user);
  
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
                dispatch(setUserData({
                    userId: user.uid,
                    username: userData.username,
                    email: userData.email,
                    avatar: userData.avatar, // Загружаем URL аватарки
                    background: userData.background,
                }));
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
      Alert.alert('Извините, но нам нужно разрешение на доступ к вашей галерее!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setPickerResponse(result);
      setSelectedImage(result.assets[0].uri);
      
      const imageUrl = await uploadImageToFirebase(result.assets[0].uri);
      if (imageUrl) {
        const user = FIREBASE_AUTH.currentUser; // Получаем текущего пользователя
        console.log('Current user for image upload:', user); // Проверка текущего пользователя
        if (user) {
          dispatch(setUserData({ userId: user.uid, username: userName, email: user.email, avatar: imageUrl, background: background }));
          Alert.alert('Изображение загружено!', 'Ваш новый аватар успешно обновлен.');
        } else {
          console.log('User is not signed in while uploading image.');
        }
      }
    }
  }, [dispatch, userName]);
  
  const backImageLibraryPress = useCallback(async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Извините, но нам нужно разрешение на доступ к вашей галерее!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setPickerResponse(result);
      setSelectedImage(result.assets[0].uri);
      
      const imageUrl = await uploadImageToFirebase1(result.assets[0].uri);
      if (imageUrl) {
        const user = FIREBASE_AUTH.currentUser; // Получаем текущего пользователя
        console.log('Current user for image upload:', user); // Проверка текущего пользователя
        if (user) {
          dispatch(setUserData({ userId: user.uid, username: userName, email: user.email, avatar: avatar, background: imageUrl }));
          Alert.alert('Изображение загружено!', 'Ваш новый аватар успешно обновлен.');
        } else {
          console.log('User is not signed in while uploading image.');
        }
      }
    }
  }, [dispatch, userName]);

  const uploadImageToFirebase = async (uri: string) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(FIREBASE_STORAGE, `images/${userName}_${Date.now()}`);
        
        // Загружаем изображение в Firebase Storage
        await uploadBytes(storageRef, blob);
        
        // Получаем URL загруженного изображения
        const url = await getDownloadURL(storageRef);

        // Сохраните URL изображения в Firestore
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
            const userDocRef = doc(collection(FIREBASE_DB, 'users'), user.uid);
            await setDoc(userDocRef, { avatar: url }, { merge: true });
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
        const storageRef = ref(FIREBASE_STORAGE, `images/${userName}_${Date.now()}`);
        
        // Загружаем изображение в Firebase Storage
        await uploadBytes(storageRef, blob);
        
        // Получаем URL загруженного изображения
        const url = await getDownloadURL(storageRef);
  
        // Сохраните URL изображения в Firestore
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
            const userDocRef = doc(collection(FIREBASE_DB, 'users'), user.uid);
            await setDoc(userDocRef, { background: url }, { merge: true });
        }
  
        return url; // Возвращаем URL для дальнейшего использования
    } catch (error) {
        console.error('Error uploading image: ', error);
        return null;
    }
  };
  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.navigate('Login');
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
        data={[{}]} // Используйте пустой массив для отображения заголовка
        renderItem={() => (
          <View style={styles.container}>
            <View style={styles.image_teamIT}>
              <Image
                source={require('../assets/teamIt/Case2.png')}
                style={{ width: 150, height: 150 }}
              />
            </View>
            <View style={styles.image_teamIT}>
              <Image
                source={require('../assets/teamIt/Case1.png')}
                style={{ width: 150, height: 150 }}
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
                  source={{ uri: background }}
                  style={styles.selectedBackgroundImage}
                />
              ) : (
                <Text style={styles.add_image__text}>+</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.add_image__button}
              onPress={onImageLibraryPress}>
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  style={styles.selectedImage}
                />
              ) : (
                <Text style={styles.add_image__text}>+</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.text}>@{userName}</Text>

            
            {isEditProfileVisible && (
              <EditProfile
                onModalClose={() => setEditProfileVisible(false)}
                userDocRef={userDocRef}
              />
            )}
            <TouchableOpacity
              style={styles.exitButton}
              onPress={handleSignOut}>
              <Image
                source={require('../assets/profile/exit.png')}
                style={{ width: 25, height: 23 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setEditProfileVisible(true)}>
              <Image
                source={require('../assets/profile/edit.png')}
                style={{ width: 25, height: 25 }}
              />
            </TouchableOpacity>
          </View>
          
        )}
        keyExtractor={(item, index) => index.toString()} // Используйте индекс как ключ
       
      />
    </SafeAreaProvider>
  );
  
};

export default Profile;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 200,
    paddingBottom: 20,
  },
  image_teamIT:{
    position: 'absolute',
    top: 60,
    right: 50,
    width: 0,
    height: 0,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  add_image__button: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9D9D9',
    top: 90,
    width: 125,
    height: 125,
    borderRadius: 100,
    marginTop: 11,
    marginBottom: 13,
  },
  add_image__text: {
    fontFamily: 'Inter-Regular',
    fontSize: 48,
    color: '#FFFFFF',
  },
  selectedImage: {
    width: 125,
    height: 125,
    borderRadius: 100,
  },
  container1: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 80,
    width: 20,
    height: 325,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  exitButton: {
    position: 'absolute',
    top: 42,
    right: 50,
    width: 20,
    height: 325,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  project__about__container: {
    width: 274,
    marginTop: 5,
  },
  project__about__text: {
    fontSize: 18,
    color: '#000000',
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    textAlign: 'center',
  },
  profileDataContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  text: {
    position: 'absolute',
    top: 245,
    marginHorizontal: -500,
    fontSize: 22,
    color: '#333',
    fontFamily: 'Inter-Regular',
  },
  background_image: {
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: '#BE9DE8',
    top: -50,
    width: 500,
    height: 225,
    marginTop: 11,
    marginBottom: 13,
  },
  selectedBackgroundImage: {
    width: 500,
    height: 225,
  },
});




