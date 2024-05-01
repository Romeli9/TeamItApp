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
  FlatList,
} from 'react-native';

import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '../../FireBaseConfig';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, addDoc, getDocs, query, where } from 'firebase/firestore';
import { loadFonts } from '../shared/fonts/fonts';
import * as ImagePicker from 'expo-image-picker';
import ProjectModal from 'widgets/ModalWindowProject';


import Carousel, { ParallaxImage } from 'react-native-snap-carousel';

import ProjectCarouselItem from 'widgets/ProjectCarouselItem';

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
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [userId, setUserId] = useState('');
  const [members, setMembers] = useState<string[]>([]);

  const [carouselIndex, setCarouselIndex] = useState(0);

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
      setRequiredSelected([...requiredSelected, value]);

      setMembers([...members, "-"]);
      
   
  };


  // const handleRequiredSelect = (value: string) => {
  //    if (requiredSelected.includes(value)) {
  //      setRequiredSelected(requiredSelected.filter((item) => item !== value));
  //    } else {
  //      setRequiredSelected([...requiredSelected, value]);
  //    }
  //  };

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

    if (result.canceled === false) {
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
        members: members,
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
      setMembers([]);
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

          const querySnapshot2 = await getDocs(
            query(projectsRef, where('creator', '!=', userData.username))
          );

          if (querySnapshot.docs.length > 0) {
            const projectsData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setUserProjects(projectsData);
          }

          if (querySnapshot2.docs.length > 0) {
            const projectsData = querySnapshot2.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setAllProjects(projectsData);
            console.log(projectsData);
          }
          setDataLoaded(true);
        }
      }
    } catch (error) {
      console.error('Error fetching projects: ', error);
    }
  };

  const OpenProject = (projectID: string) => {
    navigation.navigate('Project', { projectId: projectID });
  };

  const search = () => {
  };

  const carouselItems = allProjects.map((project) => ({
    id: project.id,
    title: project.name,
    image: { uri: project.photo },
    description: project.description,
  }));

  const renderCarouselItem = ({ item, index }: { item: any; index: number }) => {
    // Определяем стили для центрального элемента и боковых элементов
    const itemStyle = index === carouselIndex ? styles.centeredItem : styles.sideItem;
    const centeredItemStyle = index === carouselIndex ? styles.centeredItem : {};

    return (
      <View style={[styles.carouselItem, itemStyle]}>
        <TouchableOpacity onPress={() => OpenProject(item.id)}>
          <Image source={{ uri: item.image.uri }} style={[styles.image, itemStyle]} />
        </TouchableOpacity>
        {index === carouselIndex && <Text style={styles.projectTitle}>{item.title}</Text>}
        {/* {index === carouselIndex && <Text style={styles.projectTitle}>РАЗРАБОТКА САЙТА ДЛЯ ПОИСКА ДОРАМ ПО ОПИСАНИЮ</Text>} */}
      </View>
    );
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

        <View style={[styles.workWithProjectsContainer, { top: insets.top + 260 }]}>
          <Text style={styles.workWithProjectsText}>С какими проектами вы хотите поработать?</Text>
          <TouchableOpacity style={styles.searchButton} onPress={search}>
            <Image source={require('../shared/icons/search.png')} />
          </TouchableOpacity>


          <View style={styles.carousel}>
            <Carousel
              layout="default"
              data={carouselItems}
              renderItem={renderCarouselItem}
              sliderWidth={400}
              itemWidth={165}
              onSnapToItem={(index) => setCarouselIndex(index)}
            />
            {/* <Text style={styles.projectDescription}>{carouselItems[carouselIndex].description}</Text>  */}
          </View>

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
          members={members}
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
    height: 155,

  },
  projectItem: {
    marginLeft: 13,
  },
  projectImage: {
    width: 82,
    height: 120,
    borderRadius: 20,
  },


  workWithProjectsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#BE9DE8',
    paddingTop: 21,
  },
  workWithProjectsText: {
    marginLeft: 21,
    fontSize: 21,
    fontFamily: 'Inter-Bold',
    textAlign: 'left',
    color: '#FFFFFF',
    lineHeight: 27,
    width: 220,
    // height: 72
  },

  searchButton: {
    position: 'absolute',
    top: 23,
    right: 28,
  },

  carousel: {
    marginTop: 20,
    width: '100%',
    height: 321,
    marginBottom: 18,
  },
  imageContainer: {
    width: '100%',
    height: 321, // Высота изображения
  },
  projectTitle: {
    fontSize: 16,
    fontFamily: 'Inter-ExtraBold',
    marginTop: 18,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    width: 314,
    textAlign: 'center',
  },

  carouselItem: {
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredItem: {

    width: 165, // Увеличиваем ширину центрального элемента
    height: 259, // Высота центрального элемента

  },
  sideItem: {
    width: 134.23,
    height: 227.41,


  },
  image: {
    width: 165,
    height: 259,
    borderRadius: 20,
  },

});
