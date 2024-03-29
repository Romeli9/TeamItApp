import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, TextInput } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FireBaseConfig';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import ProjectWidget from '../widgets/ProjectWidget';
import { loadFonts } from '../shared/fonts/fonts';
import * as ImagePicker from 'expo-image-picker';
import { MultipleSelectList } from 'react-native-dropdown-select-list'

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [userImgUrl, setUserImgUrl] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [pickerResponse, setPickerResponse] = useState<ImagePicker.ImagePickerResult | null>(null);

  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectDescRaw, setProjectDescRaw] = useState('');

  const [selected, setSelected] = React.useState([]);
  
  const data = [
      {key:'1', value:'Mobiles', disabled:true},
      {key:'2', value:'Appliances'},
      {key:'3', value:'Cameras'},
      {key:'4', value:'Computers', disabled:true},
      {key:'5', value:'Vegetables'},
      {key:'6', value:'Diary Products'},
      {key:'7', value:'Drinks'},
  ]

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

  const formatProjectDesc = (text: string) => {
    const maxLength = 50; // Максимальная длина строки описания проекта
    let formattedText = '';
    for (let i = 0; i < text.length; i++) {
      formattedText += text[i];
      if ((i + 1) % maxLength === 0 && i !== 0) {
        formattedText += '\n';
      }
    }
    return formattedText;
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
                placeholderTextColor="#A8A8A8" 
                onChangeText={(text) => setProjectName(text)}
                style={styles.project_name__placeholder}
              />
              <View style={styles.project__about__container}>
                <Text style={styles.project__text}>О проекте:</Text>
                <TextInput
                  value={formatProjectDesc(projectDescRaw)} // Используем отформатированный текст
                  placeholder='Описание'
                  autoCapitalize='none'
                  placeholderTextColor="#A8A8A8"
                  onChangeText={(text) => setProjectDescRaw(text)} // Сохраняем описание без форматирования
                  style={styles.project_name__placeholder_about}
                  multiline={true} // Разрешаем многострочный ввод
                />
              </View>

              <View style={styles.project__container_with_plus}>
                <Text style={styles.project__text}>Требуются:</Text>
                <TouchableOpacity style={styles.project__button_plus} >
                  <Image source={require('../shared/icons/plus1.png')} />
                </TouchableOpacity>
              </View>

              <View style={styles.project__container_with_plus}>
                <Text style={styles.project__text}>Категории:</Text>
                <TouchableOpacity style={styles.project__button_plus} >
                  <Image source={require('../shared/icons/plus1.png')} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.project__button_create} >
                <Text style={styles.project__text_create}>Создать</Text>
              </TouchableOpacity>
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
    paddingHorizontal: 18,
    width: 274,
    height: 42,
  },
  project_name__placeholder_about: {
    backgroundColor: '#EDEDED',
    marginTop: 11,
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#A8A8A8',
    borderRadius: 30,
    paddingVertical: 9,
    paddingHorizontal: 18,
    width: 274,
    height: 185,
    alignItems: "flex-start",
    alignSelf: "flex-start",
    textAlignVertical: 'top',
  },
  project__about__container: {
    width: 274,
    height: 217,
    
  },
  project__text: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginLeft: 12,
    marginTop: 15,
    marginBottom: 10,
    
    
  },
  project__container_with_plus: {
    minHeight: 53,
    minWidth: 104,
    marginTop: 18,
    alignSelf: "flex-start",
  },


  project__button_plus: {
    backgroundColor: "#BE9DE8",
    width: 34,
    height: 21,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    

  },

  project__button_create: {
    backgroundColor: "#9260D1",
    width: 177,
    height: 46,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40
  },

  project__text_create: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: "#FFFFFF",
  },

  

});
