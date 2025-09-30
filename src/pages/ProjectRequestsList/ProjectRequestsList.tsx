import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {FIREBASE_DB} from 'app/FireBaseConfig';
import {Screens} from 'app/navigation/navigationEnums';
import {ProjectRequest} from 'entities/ProjectRequest';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {useSelector} from 'react-redux';
import {ProjectType} from 'redux/slices/projectsSlice';
import {RootState} from 'redux/store';
import {matchHandler} from 'shared/libs';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

import {ProjectRequestsStyles as styles} from './ProjectRequestsList.styles';

export const ProjectRequestsList = () => {
  const {userId} = useSelector((state: RootState) => state.user);
  const navigation = useAppNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState('');
  const [projectsWithApplication, setProjectsWithApplication] = useState<
    ProjectType[]
  >([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectType[]>([]);

  const {yourProjects} = useSelector((state: RootState) => state.projects);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (projectNameInput === '') {
        setFilteredProjects(projectsWithApplication);
      } else {
        setFilteredProjects(
          projectsWithApplication.filter(item =>
            item.name.toLowerCase().includes(projectNameInput.toLowerCase()),
          ),
        );
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [projectNameInput, projectsWithApplication]);

  useEffect(() => {
    fetchListProjects();
  }, [userId]);

  const fetchListProjects = async () => {
    try {
      const q = query(
        collection(FIREBASE_DB, 'projectRequests'),
        where('recipientId', '==', userId),
      );

      const receivedSnapshot = await getDocs(q);

      const receivedRequests = receivedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'received',
      })) as ProjectRequest[];

      let projects: ProjectType[] = [];
      yourProjects.map(item => {
        if (receivedRequests.find(request => request.projectId === item.id)) {
          projects = matchHandler(projects, item);
        }
      });
      setProjectsWithApplication(projects);
    } catch (error) {
      console.error('Error fetching requests:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить заявки');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderProjectItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.projectItem}
      onPress={() =>
        navigation.navigate(Screens.PROJECT_REQUESTS, {projectId: item.id})
      }>
      <Image source={{uri: item.photo}} style={styles.projectImage} />
      <Text style={styles.projectName} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchListProjects();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Text>Поиск проекта, по которому хотим посмотреть заявки</Text>
        <TextInput
          value={projectNameInput}
          onChangeText={setProjectNameInput}
          style={styles.input}
          placeholder="Введите название проекта"
          placeholderTextColor="#A8A8A8"
        />

        {projectsWithApplication.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={filteredProjects}
            renderItem={renderProjectItem}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.projectsList}
          />
        ) : (
          <Text style={styles.noProjectsText}>
            Нет заявок ни на один проект
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
