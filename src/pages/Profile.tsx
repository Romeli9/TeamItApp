import { Button, StyleSheet, ImageSourcePropType, Text, Image, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState, useCallback} from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '../../FireBaseConfig';
import { collection, doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';


const defaultAvatarIcon = require('shared/icons/cros2.png'); // Путь к вашей иконке профиля по умолчанию
const messageIcon = require('shared/icons/message.png'); // Путь к вашей иконке мессенджера
const [followersCount, setFollowersCount] = useState<number>(0);
const [projectsCount, setProjectsCount] = useState<number>(0);
const [subscriptionsCount, setSubscriptionsCount] = useState<number>(0);
const userInfoIcon = require('shared/icons/userinfo');


const [expanded, setExpanded] = useState<boolean>(false);


const toggleExpansion = () => {
  setExpanded(!expanded);
};


const Profile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [pickerResponse, setPickerResponse] = useState<ImagePicker.ImagePickerResult | null>(null);

  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        const firestore = FIREBASE_DB;
        const usersRef = collection(firestore, 'users');
        const userDoc = doc(usersRef, user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUsername(userData.username);
          setAvatarUrl(userData.avatarUrl);
        }
      }
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleSubscribe = () => {
    // Logic for subscribing goes here
  };

  const handleMessage = () => {
    // Logic for sending message goes here
  };

  const handleAvatarPress = async () => {
    // Logic for handling avatar press (uploading new image)
    // Here you can show image picker to let user select a new image
    // For simplicity, I'll just upload a default image
    const newImageURI = defaultAvatarIcon;
    const newImageUrl = await uploadImageToFirebase(newImageURI);
    if (newImageUrl) {
      setAvatarUrl(newImageUrl);
    } else {
      // Handle error while uploading image
      console.error('Error uploading new image');
    }
  };

  const uploadImageToFirebase = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(FIREBASE_STORAGE, `images/${username}_${Date.now()}`);
      await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Error uploading image: ', error);
      return null;
    }
  };

  const onImageLibraryPress = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Извините, но нам нужно разрешение на доступ к вашей камере, чтобы это работало!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 1, // Установка лимита на одно изображение
    });

    if(result.canceled === false){
      setPickerResponse(result);
      setSelectedImage(result.assets[0].uri);
      console.log(result);
    }
    
    //pickerResponse.assets[0].uri
    useEffect(() => {
      const fetchData = async () => {
        // Получаем информацию о пользователе из базы данных Firebase
        // Например, можно использовать коллекцию 'users' и документ пользователя по его UID
        // Здесь предполагается, что вы имеете доступ к информации о количестве подписчиков, проектов и подписок
        // И обновляете состояния соответствующим образом
        // Например:
        // setFollowersCount(userData.followersCount);
        // setProjectsCount(userData.projectsCount);
        // setSubscriptionsCount(userData.subscriptionsCount);
      };
    
      fetchData();
    }, []);
    

  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <TouchableOpacity style={styles.add_image__button} onPress={onImageLibraryPress}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          ) : (
            <Text style={styles.add_image__text}>+</Text>
          )}
        </TouchableOpacity>
        <Text>Hello {username}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSubscribe} style={[styles.button, styles.subscribeButton]}>
            <Text style={styles.buttonText}>Subscribe</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMessage} style={[styles.button, styles.sendMessageButton]}>
            <Image source={messageIcon} />
          </TouchableOpacity>
        </View>
        <Button title="Sign Out" onPress={handleSignOut} />
  
        {/* Информация о пользователе */}
        <View style={styles.userInfo}>
          <Text style={[styles.userInfoText, styles.boldText]}>Followers: <Text style={styles.boldText}>{followersCount}</Text></Text>
          <Text style={[styles.userInfoText, styles.boldText]}>Projects: <Text style={styles.boldText}>{projectsCount}</Text></Text>
          <Text style={[styles.userInfoText, styles.boldText]}>Subscriptions: <Text style={styles.boldText}>{subscriptionsCount}</Text></Text>
        </View>
  
        {/* Описание пользователя */}
        <TouchableOpacity onPress={toggleExpansion} style={styles.userInfo}>
          <Text style={[styles.userInfoText, styles.boldText]}>About Me</Text>
          <Image source={userInfoIcon} style={styles.userInfoIcon} />
        </TouchableOpacity>
        {expanded && (
          <View style={styles.expandedUserInfo}>
            <Text style={styles.expandedUserInfoText}>City: <Text style={styles.boldText}>Your City</Text></Text>
            <Text style={styles.expandedUserInfoText}>Education/Work: <Text style={styles.boldText}>Your Education/Work</Text></Text>
            <Text style={styles.expandedUserInfoText}>Skills: <Text style={styles.boldText}>Your Skills</Text></Text>
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
  
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row', // Определяем направление расположения кнопок
    alignItems: 'flex-start', // Выравниваем элементы по верхнему краю
  },
  avatar: {
    width: 110,
    height: 110,
    marginBottom: 42,
  },
  button: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  subscribeButton: {
    backgroundColor: '#9260D1',
    marginRight:18,
  },
  sendMessageButton: {
    backgroundColor: 'white',
    width: 42,
    height: 41,
    marginBottom: 20,
    borderColor: '#9260D1', // Устанавливаем цвет рамки равным цвету кнопки "Подписаться"
    borderWidth: 3, // Устанавливаем ширину рамки
    justifyContent: 'center', // Выравниваем содержимое по центру
    alignItems: 'center', // Выравниваем содержимое по центру
  },
  messageIcon: {
    width: 20,
    height: 19.52,
  },
  add_image__button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9D9D9',
    width: 64,
    height: 75,
    borderRadius: 20,
    
    marginBottom: 156,
    
    
  },
  selectedImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  add_image__text: {
    fontFamily: 'Inter-Regular',
    fontSize: 48,
    color: '#FFFFFF',
  },

  userInfo: {
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  
  userInfoIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  expandedUserInfo: {
    marginTop: 10,
    marginLeft: 30, // Отступ от левого края, чтобы не перекрывать другие элементы
  },
  expandedUserInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  
  
});

