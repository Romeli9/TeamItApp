import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, TextInput } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FireBaseConfig';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import ProjectWidget from '../widgets/ProjectWidget';
import { loadFonts } from '../shared/fonts/fonts';
import * as ImagePicker from 'expo-image-picker';

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [userImgUrl, setUserImgUrl] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [pickerResponse, setPickerResponse] = useState<ImagePicker.ImagePickerResult | null>(null);

  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');


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
          setUsername(userData.username);
          setUserImgUrl(userData.ImgUrl || '');
        }
      }
      await loadFonts();
      setFontsLoaded(true);
    };

    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, fetchData);
    return unsubscribe;
  }, []);

  const insets = useSafeAreaInsets();

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

    if (!result.canceled) {
      console.log(result);
      setPickerResponse(result);
    }
  }, []);

  const ModalOpen = () => {
    setModalVisible(!isModalVisible);
  };

  const ModalClose = () => {
    setModalVisible(false);
  };

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, paddingTop: insets.top }}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#FFFFFF', paddingLeft: 16 }}>
        <Text style={{ fontSize: 28 }}>Hello {username}</Text>

        <Text>Ваши проекты:</Text>
        <TouchableOpacity style={styles.create__button} onPress={ModalOpen}>
          <Text style={styles.create__text}>+</Text>
        </TouchableOpacity>

        <Modal visible={isModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={ModalClose}>
                <Image source={require('../shared/icons/cros.png')} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Создание проекта</Text>
              <TouchableOpacity style={styles.add_image__button} onPress={onImageLibraryPress}>
                <Text style={styles.add_image__text}>+</Text>
              </TouchableOpacity>
              <TextInput
                value={projectName}
                placeholder='Введите название'
                autoCapitalize='none'
                textColor="white"
                onChangeText={(text) => setProjectName(text)}
                style={styles.project_name__placeholder}
                />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  create__button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9D9D9',
    width: 82,
    height: 120,
    borderRadius: 20,
    marginTop: 13,
    marginBottom: 13,
  },
  create__text: {
    fontSize: 64,
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width: 316,
    height: 730,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 27,
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
  },
  closeButton: {
    marginLeft: '90%',
    marginTop: 10,
    width: 20,
    height: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  add_image__button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9D9D9',
    width: 64,
    height: 75,
    borderRadius: 20,
    marginTop: 11,
    marginBottom: 13,
  },
  add_image__text: {
    fontFamily: 'Inter-Regular',
    fontSize: 48,
    color: '#FFFFFF',
  },
  project_name__placeholder: {
    backgroundColor: '#EDEDED',
    marginTop: 11,
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#A8A8A8',
    borderRadius: 30,
    paddingVertical: 9,
    paddingLeft: 18,
    width: 274,
    height: 42,
  }
});
