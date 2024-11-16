import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {LinearGradient} from 'expo-linear-gradient';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Carousel from 'react-native-snap-carousel';
import {useDispatch, useSelector} from 'react-redux';
import {setOtherProjects, setYourProjects} from 'redux/slices/projectsSlice';
import 'redux/slices/userSlice';
import {RootState} from 'redux/store';

import {FIREBASE_AUTH, FIREBASE_DB} from 'app/FireBaseConfig';
import ProjectModal from 'components/ModalWindowProject';
import {HomePagestyles as styles} from './Home.styles';
import { Screens } from 'app/navigation/navigationEnums';

export const Home: React.FC<{navigation: any}> = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const [dataLoaded, setDataLoaded] = useState(false);

  const [carouselIndex, setCarouselIndex] = useState(0);

  const dispatch = useDispatch();

  const {userName, avatar} = useSelector((state: RootState) => state.user);

  const {yourProjects, otherProjects} = useSelector(
    (state: RootState) => state.projects,
  );

  useEffect(() => {
    fetchUserProjects();
  }, []);

  const insets = useSafeAreaInsets();

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
            query(projectsRef, where('creator', '==', userData.username)),
          );

          const querySnapshot2 = await getDocs(
            query(projectsRef, where('creator', '!=', userData.username)),
          );

          if (querySnapshot.docs.length > 0) {
            const projectsData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              creator: doc.data().creator,
              creatorId: doc.data().creatorId,
              description: doc.data().description,
              name: doc.data().name,
              photo: doc.data().photo,
              required: doc.data().required,
              categories: doc.data().categories,
              members: doc.data().members,
            }));

            dispatch(setYourProjects(projectsData));
          }

          if (querySnapshot2.docs.length > 0) {
            const projectsData = querySnapshot2.docs.map(doc => ({
              id: doc.id,
              creator: doc.data().creator,
              creatorId: doc.data().creatorId,
              description: doc.data().description,
              name: doc.data().name,
              photo: doc.data().photo,
              required: doc.data().required,
              categories: doc.data().categories,
              members: doc.data().members,
            }));

            dispatch(setOtherProjects(projectsData));
          }
          setDataLoaded(true);
        }
      }
    } catch (error) {
      console.error('Error fetching projects: ', error);
    }
  };

  const OpenProject = (projectID: string) => {
    navigation.navigate('Project', {projectId: projectID});
  };

  const renderCarouselItem = ({item, index}: {item: any; index: number}) => {
    return (
      <View style={[styles.carouselItem]}>
        <TouchableOpacity onPress={() => OpenProject(item.id)}>
          <ImageBackground source={{uri: item.photo}} style={[styles.image]}>
            <LinearGradient
              colors={[
                'rgba(242,240,255, 0)',
                'rgba(158,115,198, 0.38)',
                'rgba(82,0,146, 0.4)',
              ]}
              style={styles.gradient}></LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
        {index === carouselIndex && (
          <Text style={styles.projectTitle}>{item.name}</Text>
        )}
      </View>
    );
  };

  if (!dataLoaded) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          backgroundColor: '#FFFFFF',
          paddingLeft: 16,
        }}>
        <View style={styles.topContainer}>
          <Image source={{uri: avatar}} style={styles.userImage} />
          <View style={styles.TextContainer}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.TextContainer__text1}>Добро пожаловать!</Text>
              <Image
                style={styles.TextContainer__text1_img}
                source={require('shared/assets/icons/handshake.png')}></Image>
            </View>
            <Text style={styles.TextContainer__text2}>{userName}</Text>
          </View>
        </View>

        <View style={{position: 'absolute', top: insets.top + 76, left: 16}}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: 18,
              color: '#808080',
            }}>
            Ваши проекты:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.userProjectsContainer}>
            <TouchableOpacity
              style={styles.create__button}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.create__text}>+</Text>
            </TouchableOpacity>
            {yourProjects.map(project => (
              <TouchableOpacity
                key={project.id}
                style={styles.projectItem}
                onPress={() => OpenProject(project.id)}>
                <Image
                  source={{uri: project.photo}}
                  style={styles.projectImage}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View
          style={[styles.workWithProjectsContainer, {top: insets.top + 260}]}>
          <Text style={styles.workWithProjectsText}>
            С какими проектами вы хотите поработать?
          </Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate(Screens.SEARCH)}>
            <Image source={require('shared/assets/icons/search.png')} />
          </TouchableOpacity>

          <View style={styles.carousel}>
            <Image
              source={require('shared/assets/icons/Group1.png')}
              style={styles.effect}></Image>

            {
              <Carousel
                layout="default"
                data={otherProjects}
                renderItem={renderCarouselItem}
                sliderWidth={400}
                itemWidth={165}
                onSnapToItem={index => setCarouselIndex(index)}
              />
            }
          </View>
        </View>

        <ProjectModal
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
        />
      </View>
    </SafeAreaProvider>
  );
};
