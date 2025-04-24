import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
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
import {FIREBASE_AUTH, FIREBASE_DB} from '../app/FireBaseConfig';
import projectsSlice, {
  ProjectType,
  setYourProjects,
} from 'redux/slices/projectsSlice';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import { Screens } from 'app/navigation/navigationEnums';

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
    require('shared/assets/profile/down.png'),
  );

  // Основное описание, которое отображается на странице
  const [additionalDescription, setAdditionalDescription] = useState('');
  // Временное описание для модального окна
  const [tempDescription, setTempDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const toggleMoreInfo = () => {
    setShowMoreInfo(prevState => !prevState);
    Animated.timing(animatedHeight, {
      toValue: showMoreInfo ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setButtonImage(
      showMoreInfo
        ? require('shared/assets/profile/down.png')
        : require('shared/assets/profile/up.png'),
    );
  };

  const additionalInfoHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
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
    navigation.navigate(Screens.PROJECT, {projectId: projectID});
  };

  const openModal = () => {
    setTempDescription(additionalDescription);
    setModalVisible(true);
  };

  // При сохранении — переносим tempDescription в основной state и закрываем модал
  const saveDescription = () => {
    setAdditionalDescription(tempDescription);
    setModalVisible(false);
  };

  const cancelEditing = () => {
    setTempDescription('');
    setModalVisible(false);
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

        {/* Кнопка для открытия модального окна */}
        <TouchableOpacity
          style={styles.additionalButton}
          onPress={openModal}
        >
          <Text style={{ color: '#fff' }}>Дополнительное описание</Text>
        </TouchableOpacity>

        {/* Модальное окно */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={cancelEditing}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
                Введите дополнительное описание
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ваше дополнительное описание..."
                value={tempDescription}
                onChangeText={setTempDescription}
                multiline
              />
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveDescription}
                >
                  <Text style={styles.saveButtonText}>Сохранить</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelEditing}
                >
                  <Text style={styles.cancelButtonText}>Отмена</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Отображение дополнительного описания */}
        {additionalDescription.length > 0 && (
          <View style={styles.additionalDescriptionBox}>
            <Text style={{ fontWeight: 'bold' }}>Дополнительное описание:</Text>
            <Text>{additionalDescription}</Text>
          </View>
        )}

        <Text style={styles.text_project}>Проекты:</Text>
        <ScrollView contentContainerStyle={styles.projectList}>
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
  additionalButton: {
    backgroundColor: '#B39DDB', // Лавандовый цвет
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24, 
    marginBottom: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: 300,
    elevation: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  additionalDescriptionBox: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'flex-start',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#B39DDB', // Лавандовый цвет
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336', // красный цвет для отмены
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
