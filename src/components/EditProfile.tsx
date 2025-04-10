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
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]); // Теперь массив
  const [loadingSkills, setLoadingSkills] = useState(true);

  // Получаем данные из Redux store
  const {aboutMe, experience, skills, telegramm} = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setAboutMeInput(aboutMe || '');
    setExperienceInput(experience || '');
    setTelegrammInput(telegramm || '');
    setSelectedSkills(skills ? skills.split(',') : []); // Преобразуем строку в массив

    loadSkillsFromDB();
  }, []);

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

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  const handleSave = async () => {
    if (selectedSkills.length === 0) {
      Alert.alert('Внимание', 'Пожалуйста, выберите хотя бы один навык');
      return;
    }

    const profileData = {
      AboutMe: aboutMeInput,
      Experience: experienceInput,
      Skills: selectedSkills.join(','), // Сохраняем как строку с разделителем
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

  const renderSelectedSkills = () => {
    if (selectedSkills.length === 0) {
      return (
        <Text style={[styles.skillsInputText, {color: '#A8A8A8'}]}>
          Выберите роли
        </Text>
      );
    }
    return (
      <View style={styles.selectedSkillsContainer}>
        {selectedSkills.map((skill, index) => (
          <View key={index} style={styles.selectedSkillTag}>
            <Text style={styles.selectedSkillText}>{skill}</Text>
          </View>
        ))}
      </View>
    );
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

              <Text style={styles.sectionTitle}>Роли</Text>
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
              </TouchableOpacity>

              {skillsOpen && (
                <View style={styles.skillsDropdown}>
                  {loadingSkills ? (
                    <ActivityIndicator color="#9260D1" size="large" />
                  ) : allSkills.length > 0 ? (
                    <ScrollView nestedScrollEnabled style={{maxHeight: 200}}>
                      {allSkills.map((skill, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.skillItem,
                            selectedSkills.includes(skill) &&
                              styles.selectedSkillItem,
                          ]}
                          onPress={() => toggleSkill(skill)}>
                          <Text style={styles.skillText}>{skill}</Text>
                          {selectedSkills.includes(skill) && (
                            <Text style={styles.selectedIcon}>✓</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  ) : (
                    <Text style={styles.emptyText}>Нет доступных навыков</Text>
                  )}
                </View>
              )}

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
});
