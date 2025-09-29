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
import {Dimensions} from 'react-native';

import {FIREBASE_AUTH, FIREBASE_DB} from 'app/FireBaseConfig';
import {Screens} from 'app/navigation/navigationEnums';
import ProjectModal from 'components/ModalWindowProject';
import {LinearGradient} from 'expo-linear-gradient';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import Carousel from 'react-native-reanimated-carousel';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {clearFilters} from 'redux/slices/filterSlice';
import {
  setAllOtherProjects,
  setOtherProjects,
  setYourProjects,
} from 'redux/slices/projectsSlice';
import 'redux/slices/userSlice';
import {RootState} from 'redux/store';
import {SearchIcon} from 'shared/icons';
import {Colors, IconStyles} from 'shared/libs/helpers';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

import {HomePagestyles as styles} from './Home.styles';

export const Home = () => {
  const {navigate} = useAppNavigation();

  const [isModalVisible, setModalVisible] = useState(false);

  const [dataLoaded, setDataLoaded] = useState(false);

  const [carouselIndex, setCarouselIndex] = useState(0);

  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const {userName, avatar} = useSelector((state: RootState) => state.user);

  const {yourProjects, otherProjects} = useSelector(
    (state: RootState) => state.projects,
  );

  const {categoryes, requireds} = useSelector(
    (state: RootState) => state.filter,
  );

  useEffect(() => {
    fetchUserProjects();
  }, []);

  const insets = useSafeAreaInsets();

  const fetchUserProjects = async () => {
    try {
      console.log('fetchUserProjects');
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const usersRef = collection(FIREBASE_DB, 'users');
        const userDoc = doc(usersRef, user.uid);
        console.log('userDoc', userDoc);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          console.log('docSnap', docSnap);
          const userData = docSnap.data();

          const projectsRef = collection(FIREBASE_DB, 'projects');
          const querySnapshot = await getDocs(
            query(projectsRef, where('creator', '==', userData.username)),
          );
          console.log('querySnapshot', querySnapshot);

          const querySnapshot2 = await getDocs(
            query(projectsRef, where('creator', '!=', userData.username)),
          );

          console.log('querySnapshot2', querySnapshot2);

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
              HardSkills: doc.data().HardSkills,
              SoftSkills: doc.data().SoftSkills,
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
              skills: doc.data().skills,
              HardSkills: doc.data().HardSkills || [],
              SoftSkills: doc.data().SoftSkills || [],
            }));
            dispatch(setOtherProjects(projectsData));
            dispatch(setAllOtherProjects(projectsData));
          }
        }
      }
    } catch (error: any) {
      console.log('error', error);
      setError(error);
      console.error('Error fetching projects: ', error);
    } finally {
      console.log('finally');
      setDataLoaded(true);
    }
  };

  const OpenProject = (projectId: string) => {
    navigate(Screens.PROJECT, {projectId});
  };

  const screenWidth = Dimensions.get('window').width;

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Произошла ошибка, попробуйте перезагрузить приложение</Text>
      </View>
    );
  }

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

        <View style={{position: 'absolute', top: insets.top + 76, left: 0}}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: 18,
              color: '#808080',
              left: 16,
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
            onPress={() => navigate(Screens.SEARCH)}>
            <SearchIcon
              color={IconStyles.medium.changeColor(Colors.White100).color}
              size={24}
            />
          </TouchableOpacity>

          <View style={{width: screenWidth}}>
            {otherProjects.length === 0 ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 320,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#FFFFFF',
                    marginBottom: 12,
                    fontFamily: 'Inter-Medium',
                  }}>
                  {/* Если были выбраны фильтры и проекты не найдены, то такой текст иначе пишем проектов нет */}
                  {!categoryes.length || !requireds.length
                    ? 'Нет проектов с такими фильтрами'
                    : 'Проектов нет'}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#4F4F4F',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    fetchUserProjects();
                    dispatch(clearFilters());
                  }}>
                  <Text style={{color: '#fff', fontSize: 14}}>Обновить</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Image
                  source={require('shared/assets/icons/Group1.png')}
                  style={styles.effect}
                />
                <Carousel
                  loop
                  mode="parallax"
                  modeConfig={{
                    parallaxScrollingScale: 0.8,
                    parallaxScrollingOffset: 70,
                  }}
                  width={screenWidth * 0.6}
                  height={320}
                  snapEnabled
                  data={otherProjects}
                  style={{width: screenWidth}}
                  onSnapToItem={index => setCarouselIndex(index)}
                  renderItem={({item}) => (
                    <View style={styles.carouselItem}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => OpenProject(item.id)}>
                        <ImageBackground
                          source={{uri: item.photo}}
                          style={styles.image}
                          borderRadius={20}>
                          <LinearGradient
                            colors={[
                              'rgba(242,240,255, 0)',
                              'rgba(158,115,198, 0.38)',
                              'rgba(82,0,146, 0.4)',
                            ]}
                            style={styles.gradient}
                          />
                        </ImageBackground>
                      </TouchableOpacity>
                      <Text style={styles.projectTitle}>{item.name}</Text>
                    </View>
                  )}
                />
              </>
            )}
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
