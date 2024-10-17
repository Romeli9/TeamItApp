import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Animated,
  Image,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import {FIREBASE_AUTH, FIREBASE_DB} from '../../FireBaseConfig';
import {} from 'redux/slices/userSlice';
import projectsSlice, {
  projectsState,
  ProjectType,
  setYourProjects,
} from 'redux/slices/projectsSlice';
import {useNavigation, NavigationProp} from '@react-navigation/native';

type RootStackParamList = {
  Project: {projectId: string};
  // другие экраны...
};

function ProfileInfo() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
    require('../assets/profile/down.png'),
  );
  const [subscribed, setSubscribed] = useState(false);

  const test = [...projects, ...projects, ...projects, ...projects];

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
        ? require('../assets/profile/down.png')
        : require('../assets/profile/up.png'),
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
    navigation.navigate('Project', {projectId: projectID});
  };

  return (
    <View style={styles.container}>
      <View style={styles.additionalInfoContainer}>
        <TouchableOpacity style={styles.text} onPress={toggleMoreInfo}>
          <Image source={buttonImage} style={{width: 12, height: 12}} />
          <Text>Обо мне: {aboutMe}</Text>
        </TouchableOpacity>

        <Animated.View
          style={{...styles.additionalInfo, maxHeight: additionalInfoHeight}}>
          {showMoreInfo && (
            <>
              <Text style={styles.text}>Опыт: {experience}</Text>
              <Text style={styles.text}>Навыки: {skills}</Text>
              <Text style={styles.text}>Телеграмм: {telegramm}</Text>
            </>
          )}
        </Animated.View>

        <Text style={styles.text_project}>Проекты:</Text>
        <ScrollView contentContainerStyle={styles.projectList}>
          <FlatList
            data={test}
            renderItem={renderProjectItem}
            keyExtractor={(item: {id: any}) => item.id}
            numColumns={2}
          />
        </ScrollView>
      </View>
    </View>
  );
}

export default ProfileInfo;

const styles = StyleSheet.create({
  container: {
    top: 20,
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
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
    fontFamily: 'Inter-Regular',
    width: 350,
  },
  additionalInfoContainer: {
    paddingTop: 350,
    alignItems: 'center',
    width: 350,
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
    marginTop: 50,
    paddingHorizontal: 50,
  },
  projectList: {
    paddingBottom: 150,
  },
  // additionalInfoContainer121221212: {
  //   overflow: 'hidden',
  //   width: 250,
  //   height: 175,
  // },
});
