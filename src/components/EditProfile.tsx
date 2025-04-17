import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {getRelatedSkills, getSkills} from 'api';
import {
  DocumentReference,
  collection,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {setProfileData} from 'redux/slices/userSlice';
import {RootState} from 'redux/store';

import {FIREBASE_DB} from '../app/FireBaseConfig';

type Skill = {
  id: string;
  name: string;
  infoUrl: string;
  type: any[];
};

export const EditProfile: React.FC<{
  onModalClose: () => void;
  userDocRef: DocumentReference;
}> = ({onModalClose, userDocRef}) => {
  // Состояния компонента
  const [isModalVisible, setModalVisible] = useState(true);
  const [aboutMeInput, setAboutMeInput] = useState('');
  const [experienceInput, setExperienceInput] = useState('');
  const [telegrammInput, setTelegrammInput] = useState('');
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [skillsInput, setSkillsInput] = useState('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [skillsInputDeb, setSkillsInputDeb] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [skillsList, setSkillsList] = useState<Skill[]>([]);

  // Получаем данные из Redux store
  const {aboutMe, experience, skills, telegramm} = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setAboutMeInput(aboutMe || '');
    setExperienceInput(experience || '');
    setTelegrammInput(telegramm || '');
    // if (skills) {
    //   const skillNames = skills.split(',').map(s => s.trim());
    //   const initialSkills = skillNames.map(name => ({
    //     id: name,
    //     name,
    //     infoUrl: '',
    //     type: [],
    //   }));
    //   setSelectedSkills(initialSkills);
    //   setSkillsInput(skillNames.join(', '));
    // }
    // loadSkillsFromDB();

    const skillNames = skills?.split(',').map(s => s.trim()) || [];
    fetchInitialSkills(skillNames);
    loadSkillsFromDB();
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (skillsInput.length > 0) {
        getSkills(skillsInput, 10)
          .then(res => {
            console.log(res.data.data);
            setSkillsList(res.data.data);
          })
          .catch(error => {
            console.log(error);
          });
        setSkillsInputDeb(skillsInput);
      }
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [skillsInput]);

  useEffect(() => {
    if (selectedSkills.length > 0) {
      const ids = selectedSkills.map(skill => skill.id);
      console.log('ids', ids);
      getRelatedSkills(ids)
        .then(relatedSkills => {
          setSkillsList(relatedSkills.data.data);
          console.log('related', relatedSkills.data.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [selectedSkills]);

  const fetchInitialSkills = async (names: string[]) => {
    const allMatchedSkills: Skill[] = [];

    for (const name of names) {
      const res = await getSkills(name, 1); // получаем точный скилл
      if (res.data.data.length > 0) {
        allMatchedSkills.push(res.data.data[0]);
      } else {
        allMatchedSkills.push({id: name, name, infoUrl: '', type: []}); // fallback
      }
    }

    setSelectedSkills(allMatchedSkills);
    setSkillsInput(names.join(', '));
  };

  // Функция загрузки навыков из Firestore
  const loadSkillsFromDB = async () => {
    try {
      setLoadingSkills(true);
      const skillsFromDB: string[] = [];

      const rolesCollection = collection(FIREBASE_DB, 'role');
      const rolesSnapshot = await getDocs(rolesCollection);

      rolesSnapshot.forEach(doc => {
        const roleData = doc.data();
        if (roleData.name) {
          skillsFromDB.push(roleData.name.trim());
        }
      });

      setAllSkills(skillsFromDB);
    } catch (error) {
      console.error('[ERROR] Ошибка загрузки навыков:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить список навыков');
      setAllSkills([]);
    } finally {
      setLoadingSkills(false);
    }
  };

  const toggleSkill = (skill: Skill) => {
    setSelectedSkills(prev => {
      const exists = prev.find(s => s.id === skill.id);
      if (exists) {
        return prev.filter(s => s.id !== skill.id);
      } else {
        return [...prev, skill];
      }
    });
  };

  const handleSave = async () => {
    // if (selectedSkills.length === 0) {
    //   Alert.alert('Внимание', 'Пожалуйста, выберите хотя бы один навык');
    //   return;
    // }

    const profileData = {
      AboutMe: aboutMeInput,
      Experience: experienceInput,
      Skills: selectedSkills.join(','),
      Telegramm: telegrammInput,
    };

    try {
      dispatch(setProfileData(profileData));
      await updateDoc(userDocRef, profileData);
      setModalVisible(false);
      onModalClose();
      Alert.alert('Успешно', 'Данные профиля сохранены');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить данные');
    }
  };

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => {
        setModalVisible(false);
        onModalClose();
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                onModalClose();
              }}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled">
              <Text style={styles.sectionTitle}>О себе</Text>
              <TextInput
                value={aboutMeInput}
                onChangeText={setAboutMeInput}
                style={styles.input}
                placeholder="Напишите о себе"
                placeholderTextColor="#A8A8A8"
                multiline
                numberOfLines={3}
              />

              <Text style={styles.sectionTitle}>Опыт</Text>
              <TextInput
                value={experienceInput}
                onChangeText={setExperienceInput}
                style={styles.input}
                placeholder="Опишите ваш опыт"
                placeholderTextColor="#A8A8A8"
                multiline
                numberOfLines={3}
              />

              {/* <Text style={styles.sectionTitle}>Роли</Text>
              <TouchableOpacity
                style={styles.skillsInput}
                onPress={() => setSkillsOpen(!skillsOpen)}
                disabled={loadingSkills}>
                {loadingSkills ? (
                  <Text style={[styles.skillsInputText, {color: '#A8A8A8'}]}>
                    Загрузка навыков...
                  </Text>
                ) : (
                  renderSelectedSkills()
                )}
                {!loadingSkills && <Text style={styles.arrowIcon}>▼</Text>}
              </TouchableOpacity> */}

              <Text style={styles.sectionTitle}>Навыки</Text>

              <TextInput
                value={skillsInput}
                onChangeText={setSkillsInput}
                style={styles.input}
                placeholder="Введите свои навыки"
                placeholderTextColor="#A8A8A8"
                multiline
                numberOfLines={3}
              />

              {skillsList.map((skill: Skill, index: number) => (
                <TouchableOpacity
                  key={skill.id}
                  style={[
                    styles.skillButton,
                    selectedSkills.some(s => s.id === skill.id) &&
                      styles.skillButtonSelected,
                  ]}
                  onPress={() => toggleSkill(skill)}>
                  <Text
                    style={[
                      styles.skillButtonText,
                      selectedSkills.some(s => s.id === skill.id) &&
                        styles.skillButtonTextSelected,
                    ]}>
                    {skill.name}
                  </Text>
                </TouchableOpacity>
              ))}

              <TextInput
                placeholder="Выбранные навыки (можно редактировать)"
                value={selectedSkills.map(skill => skill.name).join(', ')}
                onChangeText={text => {
                  const parsed = text
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean);
                  const updatedSkills = parsed.map(name => ({
                    id: name,
                    name,
                    infoUrl: '',
                    type: [],
                  }));
                  setSelectedSkills(updatedSkills);
                  setSearchInput(parsed.join(', '));
                }}
                style={styles.input}
              />

              <Text style={styles.sectionTitle}>Telegram</Text>
              <TextInput
                value={telegrammInput}
                onChangeText={setTelegrammInput}
                style={styles.input}
                placeholder="@username или ссылка"
                placeholderTextColor="#A8A8A8"
                keyboardType="url"
              />
            </ScrollView>

            <View style={styles.fixedBottom}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={loadingSkills}>
                {loadingSkills ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Сохранить</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: 70,
  },
  fixedBottom: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    color: 'black',
    lineHeight: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  skillsInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  skillsInputText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  arrowIcon: {
    color: '#9260D1',
    fontSize: 14,
    marginLeft: 10,
  },
  skillsDropdown: {
    marginTop: -10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: 'white',
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  skillItem: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedSkillItem: {
    backgroundColor: '#F8F0FF',
  },
  skillText: {
    fontSize: 16,
    color: '#333',
  },
  selectedIcon: {
    color: '#9260D1',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#9260D1',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 30,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    padding: 15,
    color: '#999',
    fontSize: 16,
  },
  selectedSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  selectedSkillTag: {
    backgroundColor: '#E0D0FF',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  selectedSkillText: {
    color: '#5E3B9E',
    fontSize: 14,
  },
  skillsButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },

  skillButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },

  skillButtonSelected: {
    backgroundColor: '#9260D1',
  },

  skillButtonText: {
    color: '#333',
    fontSize: 14,
  },

  skillButtonTextSelected: {
    color: '#fff',
  },
});
