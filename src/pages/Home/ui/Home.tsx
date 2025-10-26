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

import {getFileUrl} from 'api';
import {FIREBASE_AUTH, FIREBASE_DB} from 'app/FireBaseConfig';
import {Screens} from 'app/navigation/navigationEnums';
import ProjectModal from 'components/ModalWindowProject';
import {LinearGradient} from 'expo-linear-gradient';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
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
  ProjectType,
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

const PAGE_SIZE = 10; // количество проектов на "страницу"
let lastVisible: any = null; // последняя подгруженная запись

export const Home = () => {
  const {navigate} = useAppNavigation();

  const [isModalVisible, setModalVisible] = useState(false);

  const [dataLoaded, setDataLoaded] = useState(false);

  const [carouselIndex, setCarouselIndex] = useState(0);

  const [error, setError] = useState('');

  const [avatarUrl, setAvatarUrl] = useState('');

  const dispatch = useDispatch();

  const {userName, avatar} = useSelector((state: RootState) => state.user);

  const {yourProjects, otherProjects} = useSelector(
    (state: RootState) => state.projects,
  );

  const {categoryes, requireds} = useSelector(
    (state: RootState) => state.filter,
  );

  useEffect(() => {
    const createProjects = async () => {
      const firestore = FIREBASE_DB;
      const projectsCollection = collection(firestore, 'projects');

      for (let i = 1; i <= 20; i++) {
        const projectData = {
          creator: 'qweABC',
          creatorId: `Otl378VmD2e87sXGC4WYW3OV6P62ABC`, // добавляем ABC в конце
          description: 'add',
          name: `awe ${i}`,
          photo: '017a5865610a3f591e6e51a46c86a2c2.jpg',
          required: ['Backend разраб.', 'Дизайнер'],
          categories: ['ПИВО', 'Desktop'],
          members: ['Otl378VmD2e87sXGC4WYW3OV6P62', '-'],
          HardSkills: [
            {
              id: 'KS1217P66NK6BW72M9FH',
              infoUrl:
                'https://lightcast.io/open-skills/skills/KS1217P66NK6BW72M9FH',
              name: 'Customer Relationship Management',
              type: {id: 'ST1', name: 'Specialized Skill'},
            },
          ],
          SoftSkills: [
            {
              id: 'KS1203C6N9B52QGB4H67',
              infoUrl:
                'https://lightcast.io/open-skills/skills/KS1203C6N9B52QGB4H67',
              name: 'Research',
              type: {id: 'ST2', name: 'Common Skill'},
            },
          ],
          status: 'completed1',
        };

        await addDoc(projectsCollection, projectData);
        console.log(`Project ${i} created`);
      }

      console.log('All 20 projects created!');
    };

    // createProjects().catch(console.error);
  }, []);

  useEffect(() => {
    fetchUserProjects();
  }, []);

  useEffect(() => {
    async function loadUrls() {
      if (avatar) {
        const url = await getFileUrl(avatar); // avatar = id
        setAvatarUrl(url);
      }
    }
    loadUrls();
  }, [avatar]);

  const insets = useSafeAreaInsets();

  const fetchUserProjects = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;

      if (!user) return;

      const usersRef = collection(FIREBASE_DB, 'users');
      const userDoc = doc(usersRef, user.uid);
      const docSnap = await getDoc(userDoc);

      if (!docSnap.exists()) return;
      const userData = docSnap.data();

      const projectsRef = collection(FIREBASE_DB, 'projects');

      // Проекты пользователя
      const querySnapshot = await getDocs(
        query(projectsRef, where('creator', '==', userData.username)),
      );

      if (!querySnapshot.empty) {
        const yourProjectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          creator: doc.data().creator,
          creatorId: doc.data().creatorId,
          description: doc.data().description,
          name: doc.data().name,
          photo: doc.data().photo,
          required: doc.data().required,
          categories: doc.data().categories,
          members: doc.data().members,
          HardSkills: doc.data().HardSkills || [],
          SoftSkills: doc.data().SoftSkills || [],
          status: doc.data().status,
        }));

        const yourProjectsWithPhotoUrl = await Promise.all(
          yourProjectsData.map(async project => {
            if (project.photo) {
              const url = await getFileUrl(project.photo);
              return {...project, photo: url};
            }
            return project;
          }),
        );

        dispatch(setYourProjects(yourProjectsWithPhotoUrl));
      }

      // Другие проекты — оставляем только один != фильтр
      const querySnapshot2 = await getDocs(
        query(
          projectsRef,
          where('creator', '!=', userData.username),
          orderBy('creator'),
        ),
      );

      if (!querySnapshot2.empty) {
        const otherProjectsData = querySnapshot2.docs
          .map(doc => ({
            id: doc.id,
            creator: doc.data().creator,
            creatorId: doc.data().creatorId,
            description: doc.data().description,
            name: doc.data().name,
            photo: doc.data().photo,
            required: doc.data().required,
            categories: doc.data().categories,
            members: doc.data().members,
            HardSkills: doc.data().HardSkills || [],
            SoftSkills: doc.data().SoftSkills || [],
            status: doc.data().status ?? 'started',
          }))
          // фильтр по status на клиенте
          .filter(project => project.status !== 'completed');

        const otherProjectsWithPhotoUrl = await Promise.all(
          otherProjectsData.map(async project => {
            if (project.photo) {
              const url = await getFileUrl(project.photo);
              return {...project, photo: url};
            }
            return project;
          }),
        );

        dispatch(setOtherProjects(otherProjectsWithPhotoUrl));
        dispatch(setAllOtherProjects(otherProjectsWithPhotoUrl));
      }
    } catch (error: any) {
      setError(error);
      console.error('Error fetching projects: ', error);
    } finally {
      setDataLoaded(true);
    }
  };

  const fetchOtherProjectsPage = async () => {
    const projectsRef = collection(FIREBASE_DB, 'projects');

    let q = query(
      projectsRef,
      where('creator', '!=', userName),
      orderBy('creator'),
      limit(PAGE_SIZE),
    );

    if (lastVisible) {
      q = query(
        projectsRef,
        where('creator', '!=', userName),
        orderBy('creator'),
        startAfter(lastVisible),
        limit(PAGE_SIZE),
      );
    }

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const projectsData: ProjectType[] = snapshot.docs
        .map(doc => ({
          id: doc.id,
          creator: doc.data().creator,
          creatorId: doc.data().creatorId,
          description: doc.data().description,
          name: doc.data().name,
          photo: doc.data().photo,
          required: doc.data().required,
          categories: doc.data().categories,
          members: doc.data().members,
          HardSkills: doc.data().HardSkills || [],
          SoftSkills: doc.data().SoftSkills || [],
          status: doc.data().status ?? 'started',
        }))
        .filter(project => project.status !== 'completed');

      // Получаем URL для фото
      const projectsWithPhotoUrl: ProjectType[] = await Promise.all(
        projectsData.map(async project => {
          if (project.photo) {
            const url = await getFileUrl(project.photo);
            return {...project, photo: url};
          }
          return project;
        }),
      );

      dispatch(setOtherProjects([...otherProjects, ...projectsWithPhotoUrl]));
      dispatch(
        setAllOtherProjects([...otherProjects, ...projectsWithPhotoUrl]),
      );

      lastVisible = snapshot.docs[snapshot.docs.length - 1];
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
          <Image source={{uri: avatarUrl}} style={styles.userImage} />
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
                  onSnapToItem={index => {
                    setCarouselIndex(index);
                    if (index === otherProjects.length - 1) {
                      // дошли до последнего
                      fetchOtherProjectsPage(); // подгружаем следующую "страницу"
                    }
                  }}
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
