import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '../../FireBaseConfig';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, addDoc, getDocs, query, where } from 'firebase/firestore';
import { loadFonts } from '../shared/fonts/fonts';
import * as ImagePicker from 'expo-image-picker';
import ProjectModal from 'widgets/ModalWindowProject';

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [userImgUrl, setUserImgUrl] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [pickerResponse, setPickerResponse] = useState<ImagePicker.ImagePickerResult | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescRaw, setProjectDescRaw] = useState('');
  const [requiredOpen, setRequiredOpen] = useState(false);
  const [requiredSelected, setRequiredSelected] = useState<string[]>([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [userId, setUserId] = useState('');

  const toggleRequired = () => {
    setRequiredOpen(!requiredOpen);
    setCategoriesOpen(false);
    Keyboard.dismiss();
  };
  
  const toggleCategory = () => {
    setCategoriesOpen(!categoriesOpen);
    setRequiredOpen(false);
    Keyboard.dismiss();
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
  
  useEffect(() => {
    const fetchData = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const usersRef = collection(FIREBASE_DB, 'users');
        const userDoc = doc(usersRef, user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUsername(userData.username);
          setUserImgUrl(userData.ImgUrl || '');
          setUserId(user.uid);
          await fetchUserProjects(); // Перенесено сюда
        }
      }
  
      await loadFonts();
      setFontsLoaded(true);
      setDataLoaded(true);
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

    if(result.canceled === false){
      setPickerResponse(result);
      setSelectedImage(result.assets[0].uri);
      console.log(result);
    }
    
    //pickerResponse.assets[0].uri

  }, []);

  const ModalOpen = () => {
    setModalVisible(!isModalVisible);
  };

  const ModalClose = () => {
    setModalVisible(false);
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

  const CreateProject = async () => {
    try {
  
      if (!projectName.trim() || !projectDescRaw.trim() || !requiredSelected.length || !categoriesSelected.length || !pickerResponse) {
        alert('Пожалуйста, заполните все поля.');
        return;
      }
  
      let imageUrl = null;
      if (pickerResponse && !pickerResponse.canceled) {
        const uploadedImageUrl = await uploadImageToFirebase(pickerResponse.assets[0].uri);
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }
  
      const projectData = {
        photo: imageUrl,
        name: projectName,
        description: projectDescRaw,
        required: requiredSelected,
        categories: categoriesSelected,
        creator: username,
        creatorId: userId,
        members: [],
      };
  
      const firestore = FIREBASE_DB;
      const projectsRef = collection(firestore, 'projects');
  
      const docRef = await addDoc(projectsRef, projectData);
      console.log('Project created with ID: ', docRef.id);
  
      // Обновляем список проектов пользователя в состоянии
      const newProject = {
        id: docRef.id,
        ...projectData,
      };
      setUserProjects([...userProjects, newProject]); // Обновлено
  
      setProjectName('');
      setProjectDescRaw('');
      setRequiredSelected([]);
      setCategoriesSelected([]);
      setPickerResponse(null);
      setSelectedImage("");
      ModalClose();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  
  const fetchUserProjects = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const usersRef = collection(FIREBASE_DB, 'users');
        const userDoc = doc(usersRef, user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const userData = docSnap.data();
  
          const projectsRef = collection(FIREBASE_DB, 'projects');
          const querySnapshot = await getDocs(
            query(projectsRef, where('creator', '==', userData.username))
          );
          
          if (querySnapshot.docs.length > 0) {
            const projectsData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            console.log('User projects:', projectsData);
            setUserProjects(projectsData);
          } else {
            console.log('У пользователя нет проектов');
          }
          setDataLoaded(true); // Перенесено сюда
        }
      }
    } catch (error) {
      console.error('Error fetching user projects: ', error);
    }
  };
  
  const OpenProject = (projectID : string) => {
    navigation.navigate('Project', { projectId: projectID });
  };

  if (!dataLoaded || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#FFFFFF', paddingLeft: 16 }}>
        <Text style={{ fontSize: 28 }}>Hello {username}</Text>

        <Text>Ваши проекты:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.userProjectsContainer}
        >
          <TouchableOpacity style={styles.create__button} onPress={ModalOpen}>
            <Text style={styles.create__text}>+</Text>
          </TouchableOpacity>
          {userProjects.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={styles.projectItem}
              onPress={() => OpenProject(project.id)}
            >
              <Image source={{ uri: project.photo }} style={styles.projectImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View>
          <Text>123123</Text>

        </View>

        <ProjectModal
          isModalVisible={isModalVisible}
          ModalClose={ModalClose}
          onImageLibraryPress={onImageLibraryPress}
          projectName={projectName}
          setProjectName={setProjectName}
          projectDescRaw={projectDescRaw}
          setProjectDescRaw={setProjectDescRaw}
          requiredOpen={requiredOpen}
          toggleRequired={toggleRequired}
          requiredSelected={requiredSelected}
          handleRequiredSelect={handleRequiredSelect}
          categoriesOpen={categoriesOpen}
          toggleCategory={toggleCategory}
          categoriesSelected={categoriesSelected}
          handleCategorySelect={handleCategorySelect}
          selectedImage={selectedImage}
          CreateProject={CreateProject}
        />
        
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
    // marginTop: 13,
    // marginBottom: 13,
  },
  create__text: {
    fontSize: 64,
    color: '#FFFFFF',
  },

  selectedImage: {
    width: 64,
    height: 75,
    borderRadius: 20,
  },
  
  userProjectsContainer: {
    flexDirection: 'row',
    marginTop: 13,
    paddingLeft: 10,
    paddingRight: 25,
    height: 120,
    //width: ''
  },
  projectItem: {
    marginLeft: 13,
  },
  projectImage: {
    width: 82,
    height: 120,
    borderRadius: 20,
  },

});
