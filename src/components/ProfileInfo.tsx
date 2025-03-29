import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  Button,
  FlatList,
  Image,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Screens} from 'app/navigation/navigationEnums';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import projectsSlice, {
  ProjectType,
  projectsState,
  setYourProjects,
} from 'redux/slices/projectsSlice';
import 'redux/slices/userSlice';
import {RootState} from 'redux/store';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

import {FIREBASE_AUTH, FIREBASE_DB} from '../app/FireBaseConfig';

export const ProfileInfo = () => {
  const {navigate} = useAppNavigation();
  const dispatch = useDispatch();
  const {telegramm, skills, experience, aboutMe} = useSelector(
    (state: RootState) => state.user,
  );
  useEffect(() => {
    fetchUserProjects();
  }, []);
  useSelector((state: RootState) => state.projects);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const animatedHeight = useState(new Animated.Value(0))[0];
  const [buttonImage, setButtonImage] = useState(
    require('shared/assets/profile/down.png'),
  );
  const [subscribed, setSubscribed] = useState(false);

  const toggleMoreInfo = () => {
    setShowMoreInfo(prevState => !prevState);
    Animated.timing(animatedHeight, {
      toValue: showMoreInfo ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Изменяем изображение кнопки
    setButtonImage(
      showMoreInfo
        ? require('shared/assets/profile/down.png')
        : require('shared/assets/profile/up.png'),
    );
  };

  const additionalInfoHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // Увеличиваем максимальную высоту
  });

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
            setProjects(projectsData);
            dispatch(setYourProjects(projectsData));
          }

          setDataLoaded(true);
        }
      }
    } catch (error) {
      console.error('Error fetching projects: ', error);
    }
  };

  const renderProjectItem = ({item}: {item: ProjectType}) => (
    <TouchableOpacity
      style={styles.projectItem}
      onPress={() => OpenProject(item.id)}>
      <Image source={{uri: item.photo}} style={styles.projectImage} />
      <Text style={styles.projectName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const OpenProject = (projectID: string) => {
    navigate(Screens.PROJECT, {projectId: projectID});
  };

  return (
    <View style={styles.container}>
      <View style={styles.additionalInfoContainer}>
        <ScrollView contentContainerStyle={styles.projectList}>
          <TouchableOpacity style={styles.text} onPress={toggleMoreInfo}>
            <Image source={buttonImage} style={{width: 12, height: 12}} />
            <Text style={{fontSize: 15}}>Обо мне: {aboutMe}</Text>
          </TouchableOpacity>

          <Animated.View
            style={{...styles.additionalInfo, maxHeight: additionalInfoHeight}}>
            {showMoreInfo && (
              <>
                <Text style={styles.text}>Опыт: {experience}</Text>
                <Text style={styles.text}>Навыки: {skills}</Text>
                <Text style={styles.text}>Телеграм: {telegramm}</Text>
              </>
            )}
          </Animated.View>

          <Text style={styles.text_project}>Проекты:</Text>

          <FlatList
            data={projects}
            renderItem={renderProjectItem}
            keyExtractor={(item: {id: any}) => item.id}
            numColumns={2}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  down_button: {
    position: 'absolute',
    left: 25,
    top: 57,
  },
  projectItem: {
    marginLeft: 10,
  },
  projectImage: {
    width: 175,
    height: 250,
    borderRadius: 20,
  },
  projectName: {
    marginTop: 5,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  text: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    fontSize: 15,
    marginBottom: 15,
    color: '#333',
    fontFamily: 'Inter-Regular',
    width: 350,
  },
  additionalInfoContainer: {
    paddingTop: 350,
    alignItems: 'center',
    width: 400,
  },
  additionalInfo: {
    width: '100%',
  },
  text_project: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: '500',
  },
  profileProjectContainer: {
    width: '100%',
    paddingHorizontal: 50,
  },
  projectList: {
    paddingBottom: 150,
    width: '100%',
  },
  // additionalInfoContainer121221212: {
  //   overflow: 'hidden',
  //   width: 250,
  //   height: 175,
  // },
});
