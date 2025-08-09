import React, {useEffect, useState} from 'react';
import {
  Animated,
  FlatList,
  Image,
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
import {ProjectType, setYourProjects} from 'redux/slices/projectsSlice';
import 'redux/slices/userSlice';
import {RootState} from 'redux/store';
import {DownCaretIcon, UpCaretIcon} from 'shared/icons';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

import {FIREBASE_AUTH, FIREBASE_DB} from '../app/FireBaseConfig';

export const ProfileInfo = () => {
  const {navigate} = useAppNavigation();

  const dispatch = useDispatch();

  const [projects, setProjects] = useState<ProjectType[]>([]);

  const {telegramm, HardSkills, SoftSkills, experience, aboutMe} = useSelector(
    (state: RootState) => state.user,
  );

  useSelector((state: RootState) => state.projects);

  useEffect(() => {
    fetchUserProjects();
  }, []);

  const fetchUserProjects = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const usersRef = collection(FIREBASE_DB, 'users');
        const userDoc = doc(usersRef, user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const projectsRef = collection(FIREBASE_DB, 'projects');
          const querySnapshot = await getDocs(
            query(projectsRef, where('creatorId', '==', docSnap.id)),
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
              HardSkills: doc.data().HardSkills,
              SoftSkills: doc.data().SoftSkills,
            }));
            setProjects(projectsData);
            dispatch(setYourProjects(projectsData));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching projects: ', error);
    }
  };

  const renderProjectItem = ({item}: {item: ProjectType}) => (
    <TouchableOpacity onPress={() => OpenProject(item.id)}>
      <Image source={{uri: item.photo}} style={styles.projectImage} />
      <Text style={styles.projectName}>{item.name}</Text>
    </TouchableOpacity>
  );

  /**
   * Navigate to the project screen with the given project ID.
   * @param {string} projectID - The ID of the project to navigate to.
   */
  const OpenProject = (projectID: string) => {
    navigate(Screens.PROJECT, {projectId: projectID});
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Text style={styles.text}>Обо мне: {aboutMe}</Text>
        <Text style={styles.text}>Опыт: {experience}</Text>
        <Text style={styles.text}>
          Hard Skills:{' '}
          {JSON.parse(HardSkills)
            .map((item: {name: string}) => item.name)
            .join(', ')}
        </Text>
        <Text style={styles.text}>
          Soft Skills:{' '}
          {JSON.parse(SoftSkills)
            .map((item: {name: string}) => item.name)
            .join(', ')}
        </Text>
        <Text style={styles.text}>Телеграм: {telegramm}</Text>
      </View>

      <Text style={styles.text_project}>Проекты:</Text>

      <FlatList
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={(item: ProjectType) => item.id}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  profileInfo: {
    display: 'flex',
    width: '100%',
    gap: 16,
  },
  text: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'Inter-Regular',
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
    textAlign: 'center',
  },

  text_project: {
    paddingTop: 20,
    paddingLeft: 16,
    marginBottom: 15,
    fontSize: 20,
    fontWeight: '500',
  },
});
