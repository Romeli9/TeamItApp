import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  PanResponder,
  Animated,
  ScrollView,
} from 'react-native';
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
  const [projectDescRaw, setProjectDescRaw] = useState('');

  const [selected, setSelected] = React.useState([]);

  const [requiredOpen, setRequiredOpen] = useState(false);
  const [requiredSelected, setRequiredSelected] = useState<string[]>([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);

  const toggleRequired = () => {
    setRequiredOpen(!requiredOpen);
    setCategoriesOpen(false);
  };
  
  const toggleCategory = () => {
    setCategoriesOpen(!categoriesOpen);
    setRequiredOpen(false);
  };
  
  const handleRequiredSelect = (value: string) => {
    if (requiredSelected.includes(value)) {
      setRequiredSelected(requiredSelected.filter((item) => item !== value));
    } else {
      setRequiredSelected([...requiredSelected, value]);
    }
  };
  
  const handleCategorySelect = (value: string) => {
    if (categoriesSelected.includes(value)) {
      setCategoriesSelected(categoriesSelected.filter((item) => item !== value));
    } else {
      setCategoriesSelected([...categoriesSelected, value]);
    }
  };
  
  const hideDropdowns = () => {
    setCategoriesOpen(false);
    setRequiredOpen(false);
    Keyboard.dismiss();
  };
  
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

  // const formatProjectDesc = (text: string) => {
  //   const maxLength = 50; // Максимальная длина строки описания проекта
  //   let formattedText = '';
  //   for (let i = 0; i < text.length; i++) {
  //     formattedText += text[i];
  //     if ((i + 1) % maxLength === 0 && i !== 0) {
  //       formattedText += '\n';
  //     }
  //   }
  //   return formattedText;
  // };

  

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
            <ScrollView 
              contentContainerStyle={styles.scrollViewContainer} 
              keyboardShouldPersistTaps="handled"
            >
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
                  value={(projectDescRaw)} // Используем отформатированный текст
                  placeholder='Описание'
                  autoCapitalize='none'
                  placeholderTextColor="#A8A8A8"
                  onChangeText={(text) => setProjectDescRaw(text)} // Сохраняем описание без форматирования
                  style={styles.project_name__placeholder_about}
                  multiline={true} // Разрешаем многострочный ввод
                  keyboardType="default"
                />
              </View>

              <View style={styles.project__container_with_plus}>
                <Text style={styles.project__text_2}>Требуются:</Text>
                <View style={styles.fdrow}>
                <TouchableOpacity style={styles.project__button_plus} onPress={toggleRequired}>
                  <Image source={require('../shared/icons/plus1.png')} />
                </TouchableOpacity>
                
                {/* <View style={styles.selectedItemsContainer}> */}
                  {requiredSelected.map((item) => (
                    <View key={item} style={styles.selectedItem}>
                      <Text style={styles.selectedItemText}>{item}</Text>
                      <TouchableOpacity onPress={() => handleRequiredSelect(item)} style={styles.removeSelectedItem}>
                        <View style={styles.removeSelectedItemTextContainer}>
                        <Image source={require('../shared/icons/cros2.png')} />
                          {/* <Text style={styles.removeSelectedItemText}>✕</Text> */}
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                {/* </View> */}
                
                </View>
                {requiredOpen && (
                  <ScrollView style={styles.dropdownContainer}>
                    <View style = {styles.dropdownWrapper}>
                    {data.map((item) => (
                      <TouchableOpacity
                        key={item.key}
                        style={[styles.dropdownItem, requiredSelected.includes(item.value) && styles.dropdownItemSelected]}
                        onPress={() => handleRequiredSelect(item.value)}
                      >
                        <View style={styles.dropdownItemContainer}>
                          <View style={styles.dropdownItem_icon}>
                            <Image source={require('../shared/icons/plus2.png')} />
                          </View>
                          <Text style={styles.dropdownItemText}>{item.value}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    </View>
                  </ScrollView>
                )}
                
              </View>

              <View style={styles.project__container_with_plus}>
                <Text style={styles.project__text_2}>Категории:</Text>
                <View style={styles.fdrow}>
                <TouchableOpacity style={styles.project__button_plus} onPress={toggleCategory}>
                  <Image source={require('../shared/icons/plus1.png')} />
                </TouchableOpacity>

                {/* <View style={styles.selectedItemsContainer}> */}
                  {categoriesSelected.map((item) => (
                    <View key={item} style={styles.selectedItem}>
                      <Text style={styles.selectedItemText}>{item}</Text>
                      <TouchableOpacity onPress={() => handleCategorySelect(item)} style={styles.removeSelectedItem}>
                        <View style={styles.removeSelectedItemTextContainer}>
                          <Image source={require('../shared/icons/cros2.png')} />
                          {/* <Text style={styles.removeSelectedItemText}>✕</Text> */}
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                {/* </View> */}
                </View>

                {categoriesOpen && (
                  <ScrollView style={styles.dropdownContainer}>
                    <View style = {styles.dropdownWrapper}>
                    {data.map((item) => (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.dropdownItem,
                          categoriesSelected.includes(item.value) && styles.dropdownItemSelected,
                        ]}
                        onPress={() => handleCategorySelect(item.value)}
                      >
                        <View style={styles.dropdownItemContainer}>
                          <View style={styles.dropdownItem_icon}>
                            <Image source={require('../shared/icons/plus2.png')} />
                          </View>
                          <Text style={styles.dropdownItemText}>{item.value}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    </View>
                  </ScrollView>
                )}

                
              </View>
              <TouchableOpacity style={styles.project__button_create} >
                <Text style={styles.project__text_create}>Создать</Text>
              </TouchableOpacity>
              </ScrollView>
              
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
    //zIndex: 5,
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
  
  scrollViewContainer: {
    flexGrow: 1,
    //justifyContent: 'center',
    alignItems: 'center',
  },

  closeButton: {
    marginLeft: '90%',
    marginTop: 5,
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
    //marginTop: 11,
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
    //marginTop: 11,
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#A8A8A8',
    borderRadius: 30,
    paddingVertical: 9,
    paddingHorizontal: 18,
    width: 274,
    minHeight: 100,
    maxHeight: 185,
    alignItems: "flex-start",
    alignSelf: "flex-start",
    textAlignVertical: 'top',
  },
  project__about__container: {
    width: 274,
    minHeight: 100,
    
  },
  project__text: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginLeft: 12,
    marginTop: 15,
    marginBottom: 10,
    //zIndex: 1,
  },

  project__text_2: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    //marginLeft: 12,
    marginTop: 15,
    marginBottom: 10,
    //zIndex: 1,
  },

  project__container_with_plus: {
    alignItems: "flex-start",
    alignSelf: "flex-start",
    //alignSelf: "flex-start",
    marginLeft: 12,
  },

  fdrow: {
    flexDirection: 'row',
    flexWrap: "wrap",
    gap: 15,
    margin: 0
  },


  project__button_plus: {
    backgroundColor: "#BE9DE8",
    width: 34,
    height: 21,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    
    flexDirection: "row",
    gap: 15,

  },

  project__button_create: {
    backgroundColor: "#9260D1",
    width: 177,
    height: 46,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 85,
  },

  project__text_create: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: "#FFFFFF",
  },
 

  selectedItemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //marginLeft: 15,
    gap: 15,
    flexWrap: "wrap"
  },

  selectedItem: {
    backgroundColor: '#BE9DE8',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 21,
    paddingVertical: 3,
    paddingHorizontal: 3
  },

  selectedItemText: {
    color: 'white',
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
  },

  removeSelectedItem: {
    marginLeft: 5,
  },

  removeSelectedItemTextContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6.5,
    paddingVertical: 2.5,
    borderRadius: 20,
    height: 12,
  },

  removeSelectedItemText: {
    color: '#BBBBBB',
    textAlign: "center",
  },

  dropdownContainer: {
    position: 'relative',
    maxHeight: 150,
    width: 150,
    backgroundColor: '#BE9DE8',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    zIndex: 999,
    marginTop: 15,
  },

  dropdownWrapper: {
    paddingTop: 13,
    paddingLeft: 11,
    paddingRight: 13,
    paddingBottom: 5,
  },

  dropdownItem: {
    marginBottom: 10,
    color: 'white',
    fontFamily: "Inter-SemiBold",
  },

  dropdownItem_icon: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dropdownItemContainer: {
    flex: 1,
    paddingLeft: 11,
    flexDirection: 'row',
  },
  dropdownItemText: {
    marginLeft: 5,
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  dropdownItemSelected: {
    //backgroundColor: '#F2F2F2',
  },

  
  

});
