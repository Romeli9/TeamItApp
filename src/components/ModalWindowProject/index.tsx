import React, {useCallback, useState} from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import {LinearGradient} from 'expo-linear-gradient';
import {addDoc, collection} from 'firebase/firestore';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {useDispatch, useSelector} from 'react-redux';
import {ProjectType, setYourProjects} from 'redux/slices/projectsSlice';
import {RootState} from 'redux/store';
import {categories} from 'shared/assets/consts/Categories';
import {required} from 'shared/assets/consts/Required';

import {FIREBASE_DB, FIREBASE_STORAGE} from '../../app/FireBaseConfig';
import {styles} from './styles';

interface ProjectModalProps {
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isModalVisible,
  setModalVisible,
}) => {
  const [members, setMembers] = useState<string[]>([]);
  const [requiredSelected, setRequiredSelected] = useState<string[]>([]);
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [requiredOpen, setRequiredOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [projectDescRaw, setProjectDescRaw] = useState('');
  const [projectName, setProjectName] = useState('');

  const [pickerResponse, setPickerResponse] =
    useState<ImagePicker.ImagePickerResult | null>(null);

  const {userName, userId} = useSelector((state: RootState) => state.user);

  const {yourProjects} = useSelector((state: RootState) => state.projects);

  const dispatch = useDispatch();

  const uploadImageToFirebase = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(
        FIREBASE_STORAGE,
        `images/${userName}_${Date.now()}`,
      );
      await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Error uploading image: ', error);
      return null;
    }
  };

  const onImageLibraryPress = useCallback(async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Извините, но нам нужно разрешение на доступ к вашей камере, чтобы это работало!',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 1, // Установка лимита на одно изображение
    });

    if (!result.canceled) {
      setPickerResponse(result);
      setSelectedImage(result.assets[0].uri);
      console.log(result);
    }
  }, []);

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
      setRequiredSelected(requiredSelected.filter(item => item !== value));
      members.splice(-1, 1);
    } else {
      setRequiredSelected([...requiredSelected, value]);
      setMembers([...members, '-']);
    }
  };

  const handleCategorySelect = (value: string) => {
    if (categoriesSelected.includes(value)) {
      setCategoriesSelected(categoriesSelected.filter(item => item !== value));
    } else {
      setCategoriesSelected([...categoriesSelected, value]);
    }
  };

  const CreateProject = async () => {
    try {
      if (
        !projectName.trim() ||
        !projectDescRaw.trim() ||
        !requiredSelected.length ||
        !categoriesSelected.length ||
        !pickerResponse
      ) {
        Alert.alert('Пожалуйста, заполните все поля.');
        return;
      }

      let imageUrl = '';
      if (pickerResponse && !pickerResponse.canceled) {
        const uploadedImageUrl = await uploadImageToFirebase(
          pickerResponse.assets[0].uri,
        );
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
        creator: userName,
        creatorId: userId,
        members: members,
      };

      const firestore = FIREBASE_DB;
      const projectsRef = collection(firestore, 'projects');

      const docRef = await addDoc(projectsRef, projectData);
      console.log('Project created with ID: ', docRef.id);

      const newProject: ProjectType = {
        id: docRef.id,
        ...projectData,
      };
      dispatch(setYourProjects([newProject, ...yourProjects]));

      setProjectName('');
      setProjectDescRaw('');
      setRequiredSelected([]);
      setCategoriesSelected([]);
      setPickerResponse(null);
      setSelectedImage('');
      setMembers([]);
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <Modal visible={isModalVisible} animationType="slide" transparent>
      <LinearGradient
        style={styles.modalContainer}
        colors={[
          'rgba(46, 10, 95, 0.94)',
          'rgba(177, 170, 219, 0.6043)',
          'rgba(31, 24, 75, 0.94)',
        ]}>
        <View style={styles.modalContent}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContainer}
            keyboardShouldPersistTaps="handled">
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Image source={require('shared/assets/icons/cros.png')} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Создание проекта</Text>
            <TouchableOpacity
              style={styles.add_image__button}
              onPress={onImageLibraryPress}>
              {selectedImage ? (
                <Image
                  source={{uri: selectedImage}}
                  style={styles.selectedImage}
                />
              ) : (
                <Text style={styles.add_image__text}>+</Text>
              )}
            </TouchableOpacity>
            <TextInput
              value={projectName}
              placeholder="Введите название"
              autoCapitalize="none"
              placeholderTextColor="#A8A8A8"
              onChangeText={text => setProjectName(text)}
              style={styles.project_name__placeholder}
            />
            <View style={styles.project__about__container}>
              <Text style={styles.project__text}>О проекте:</Text>
              <TextInput
                value={projectDescRaw}
                placeholder="Описание"
                autoCapitalize="none"
                placeholderTextColor="#A8A8A8"
                onChangeText={text => setProjectDescRaw(text)}
                style={styles.project_name__placeholder_about}
                multiline={true}
                keyboardType="default"
              />
            </View>

            <View style={styles.project__container_with_plus}>
              <Text style={styles.project__text_2}>Требуются:</Text>
              <View style={styles.fdrow}>
                <TouchableOpacity
                  style={styles.project__button_plus}
                  onPress={toggleRequired}>
                  <Text style={styles.plus1}>+</Text>
                </TouchableOpacity>
                {requiredSelected.map(item => (
                  <View key={item} style={styles.selectedItem}>
                    <Text style={styles.selectedItemText}>{item}</Text>
                    <TouchableOpacity
                      onPress={() => handleRequiredSelect(item)}
                      style={styles.removeSelectedItem}>
                      <View style={styles.removeSelectedItemTextContainer}>
                        <Text style={styles.cross1}>+</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              {requiredOpen && (
                <ScrollView style={styles.dropdownContainer}>
                  <View style={styles.dropdownWrapper}>
                    {required.map(item => (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.dropdownItem,
                          requiredSelected.includes(item.value) &&
                            styles.dropdownItemSelected,
                        ]}
                        onPress={() => handleRequiredSelect(item.value)}>
                        <View style={styles.dropdownItemContainer}>
                          <View style={styles.dropdownItem_icon}>
                            <Text style={styles.plus2}>+</Text>
                          </View>
                          <Text style={styles.dropdownItemText}>
                            {item.value}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>

            <View style={styles.project__container_with_plus}>
              <Text style={styles.project__text_2}>Категории:</Text>
              <View style={styles.fdrow}>
                <TouchableOpacity
                  style={styles.project__button_plus}
                  onPress={toggleCategory}>
                  <Text style={styles.plus1}>+</Text>
                </TouchableOpacity>
                {categoriesSelected.map(item => (
                  <View key={item} style={styles.selectedItem}>
                    <Text style={styles.selectedItemText}>{item}</Text>
                    <TouchableOpacity
                      onPress={() => handleCategorySelect(item)}
                      style={styles.removeSelectedItem}>
                      <View style={styles.removeSelectedItemTextContainer}>
                        <Text style={styles.cross1}>+</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              {categoriesOpen && (
                <ScrollView style={styles.dropdownContainer}>
                  <View style={styles.dropdownWrapper}>
                    {categories.map(item => (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.dropdownItem,
                          categoriesSelected.includes(item.value) &&
                            styles.dropdownItemSelected,
                        ]}
                        onPress={() => handleCategorySelect(item.value)}>
                        <View style={styles.dropdownItemContainer}>
                          <View style={styles.dropdownItem_icon}>
                            <Text style={styles.plus2}>+</Text>
                          </View>
                          <Text style={styles.dropdownItemText}>
                            {item.value}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
            <TouchableOpacity
              style={styles.project__button_create}
              onPress={CreateProject}>
              <Text style={styles.project__text_create}>Создать</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </LinearGradient>
    </Modal>
  );
};

export default ProjectModal;
