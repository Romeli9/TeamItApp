import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {getSkills, getToken, uploadFile} from 'api';
import {Skill} from 'components';
import * as ImagePicker from 'expo-image-picker';
import {LinearGradient} from 'expo-linear-gradient';
import {addDoc, collection, getDocs} from 'firebase/firestore';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {useDispatch, useSelector} from 'react-redux';
import {ProjectType, setYourProjects} from 'redux/slices/projectsSlice';
import {RootState} from 'redux/store';
import {categoriesMock} from 'shared/assets/consts/Categories';
import {requiredMock} from 'shared/assets/consts/Required';
import {PhotoIcon} from 'shared/assets/icons/icons';

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
  const [loading, setLoading] = useState(false);

  // New states for hard and soft skills
  const [HardSkills, setHardSkills] = useState<Skill[]>([]);
  const [SoftSkills, setSoftSkills] = useState<Skill[]>([]);
  const [hardSearchTerm, setHardSearchTerm] = useState('');
  const [softSearchTerm, setSoftSearchTerm] = useState('');
  const [hardSuggestions, setHardSuggestions] = useState<Skill[]>([]);
  const [softSuggestions, setSoftSuggestions] = useState<Skill[]>([]);

  const [pickerResponse, setPickerResponse] =
    useState<ImagePicker.ImagePickerResult | null>(null);

  const {userName, userId} = useSelector((state: RootState) => state.user);
  const {yourProjects} = useSelector((state: RootState) => state.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (hardSearchTerm.trim()) {
        getSkills('ST1', hardSearchTerm, 10)
          .then(res => {
            setHardSuggestions(res.data.data);
          })
          .catch(async error => {
            if (error.response.status === 401) {
              await getToken();
            }
          });
      } else setHardSuggestions([]);
    }, 400);

    return () => clearTimeout(timeout);
  }, [hardSearchTerm]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (softSearchTerm.trim()) {
        getSkills('ST2', softSearchTerm, 10)
          .then(res => setSoftSuggestions(res.data.data))
          .catch(async error => {
            if (error.response.status === 401) {
              await getToken();
            }
          });
      } else setSoftSuggestions([]);
    }, 400);

    return () => clearTimeout(timeout);
  }, [softSearchTerm]);

  // Handlers for adding/removing skills
  const handleAddHard = (skill: Skill) => {
    if (!HardSkills.find(s => s.id === skill.id)) {
      setHardSkills([...HardSkills, skill]);
      setHardSearchTerm('');
      setHardSuggestions([]);
    }
  };
  const handleRemoveHard = (id: string) => {
    setHardSkills(HardSkills.filter(s => s.id !== id));
  };
  const handleAddSoft = (skill: Skill) => {
    if (!SoftSkills.find(s => s.id === skill.id)) {
      setSoftSkills([...SoftSkills, skill]);
      setSoftSearchTerm('');
      setSoftSuggestions([]);
    }
  };
  const handleRemoveSoft = (id: string) => {
    setSoftSkills(SoftSkills.filter(s => s.id !== id));
  };

  const uploadImageToFirebase = async () => {
    try {
      if (!pickerResponse || pickerResponse.canceled) return null;
      const imageUri = pickerResponse.assets[0].uri;
      const fileName = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(fileName || '');
      const type = match ? `image/${match[1]}` : 'image';

      // Формируем FormData для отправки на сервер
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: fileName,
        type,
      } as any);

      const fileId = await uploadFile(formData);

      return fileId;
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
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 1,
    });
    if (!result.canceled) {
      setPickerResponse(result);
      setSelectedImage(result.assets[0].uri);
    }
  }, [userName]);

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

  const сreateProject = async () => {
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
    setLoading(true);

    let imageUrl = '';
    if (pickerResponse && !pickerResponse.canceled) {
      imageUrl = (await uploadImageToFirebase()) ?? '';
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
      HardSkills: JSON.stringify(HardSkills),
      SoftSkills: JSON.stringify(SoftSkills),
    };

    try {
      const projectsRef = collection(FIREBASE_DB, 'projects');
      const docRef = await addDoc(projectsRef, projectData);
      const newProject: ProjectType = {
        id: docRef.id,
        ...projectData,
        HardSkills,
        SoftSkills,
      };
      const chatData = {
        group: true,
        image: imageUrl,
        name: projectName,
        participants: [userId],
        projectId: docRef.id,
        lastMessage: 'Чат создан',
        time: Date.now(),
      };
      await addDoc(collection(FIREBASE_DB, 'chats'), chatData);
      dispatch(setYourProjects([newProject, ...yourProjects]));
      // Reset form
      setProjectName('');
      setProjectDescRaw('');
      setRequiredSelected([]);
      setCategoriesSelected([]);
      setPickerResponse(null);
      setSelectedImage('');
      setMembers([]);
      setHardSkills([]);
      setSoftSkills([]);
      setLoading(false);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Modal visible={isModalVisible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}>
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
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
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
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      borderColor: '#000000',
                      borderWidth: 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <PhotoIcon size={32} />
                  </View>
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
                      {requiredMock.map((item, ix) => (
                        <TouchableOpacity
                          key={ix}
                          style={[
                            styles.dropdownItem,
                            requiredSelected.includes(item) &&
                              styles.dropdownItemSelected,
                          ]}
                          onPress={() => handleRequiredSelect(item)}>
                          <View style={styles.dropdownItemContainer}>
                            <View style={styles.dropdownItem_icon}>
                              <Text style={styles.plus2}>+</Text>
                            </View>
                            <Text style={styles.dropdownItemText}>{item}</Text>
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
                {/*  TODO: сделать так, что бы если уже выл выбран, то вместо 
                плюсика ставим красный минусик */}
                {categoriesOpen && (
                  <ScrollView style={styles.dropdownContainer}>
                    <View style={styles.dropdownWrapper}>
                      {categoriesMock.map((item, ix) => (
                        <TouchableOpacity
                          key={ix}
                          style={[
                            styles.dropdownItem,
                            categoriesSelected.includes(item) &&
                              styles.dropdownItemSelected,
                          ]}
                          onPress={() => handleCategorySelect(item)}>
                          <View style={styles.dropdownItemContainer}>
                            <View style={styles.dropdownItem_icon}>
                              <Text style={styles.plus2}>+</Text>
                            </View>
                            <Text style={styles.dropdownItemText}>{item}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                )}
              </View>

              <View style={styles.skillsInputContainer}>
                <Text style={styles.project__text}>Hard навыки:</Text>
                <TextInput
                  placeholder="Введите hard-навык"
                  value={hardSearchTerm}
                  onChangeText={setHardSearchTerm}
                  style={styles.skillsInput}
                  placeholderTextColor="#A8A8A8"
                />
                <View style={styles.selectedSkillsContainer}>
                  {HardSkills.map(s => (
                    <TouchableOpacity
                      key={s.id}
                      onPress={() => handleRemoveHard(s.id)}
                      style={styles.skillPill}>
                      <Text style={styles.skillPillText}>{s.name} ×</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {hardSuggestions.length > 0 && (
                  <View style={styles.skillsDropdown}>
                    <ScrollView nestedScrollEnabled style={{maxHeight: 150}}>
                      {hardSuggestions.map(item => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => handleAddHard(item)}
                          style={styles.skillDropdownItem}>
                          <Text>{item.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Soft Skills Input */}
              <View style={styles.skillsInputContainer}>
                <Text style={styles.project__text}>Soft навыки:</Text>
                <TextInput
                  placeholder="Введите soft-навык"
                  value={softSearchTerm}
                  onChangeText={setSoftSearchTerm}
                  style={styles.skillsInput}
                  placeholderTextColor="#A8A8A8"
                />
                <View style={styles.selectedSkillsContainer}>
                  {SoftSkills.map(s => (
                    <TouchableOpacity
                      key={s.id}
                      onPress={() => handleRemoveSoft(s.id)}
                      style={styles.skillPill}>
                      <Text style={styles.skillPillText}>{s.name} ×</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {softSuggestions.length > 0 && (
                  <View style={styles.skillsDropdown}>
                    <ScrollView nestedScrollEnabled style={{maxHeight: 150}}>
                      {softSuggestions.map(item => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => handleAddSoft(item)}
                          style={styles.skillDropdownItem}>
                          <Text>{item.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <TouchableOpacity
                disabled={loading}
                style={styles.project__button_create}
                onPress={сreateProject}>
                <Text style={styles.project__text_create}>Создать</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ProjectModal;
