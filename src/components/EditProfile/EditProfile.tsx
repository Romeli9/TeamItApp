import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {FIREBASE_DB} from 'app/FireBaseConfig';
import {Skill, SkillsInput} from 'components';
import {
  DocumentReference,
  collection,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {setProfileData} from 'redux/slices/userSlice';
import {RootState} from 'redux/store';

import {EditProfileStyles as styles} from './EditProfile.styles';

export const EditProfile: React.FC<{
  onModalClose: () => void;
  userDocRef: DocumentReference;
}> = ({onModalClose, userDocRef}) => {
  // Состояния компонента
  const [isModalVisible, setModalVisible] = useState(true);
  const [aboutMeInput, setAboutMeInput] = useState('');
  const [experienceInput, setExperienceInput] = useState('');
  const [telegrammInput, setTelegrammInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedHardSkills, setSelectedHardSkills] = useState<Skill[]>([]);
  const [selectedSoftSkills, setSelectedSoftSkills] = useState<Skill[]>([]);

  const [rolesSelected, setRolesSelected] = useState<string[]>([]);
  const [rolesOpen, setRolesOpen] = useState(false);

  const [rolesData, setRolesData] = useState<string[]>([]);

  // Получаем данные из Redux store
  const {aboutMe, experience, HardSkills, SoftSkills, telegramm, roles} =
    useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const skills = useMemo(() => {
    if (HardSkills?.length && SoftSkills?.length) {
      return [...HardSkills, ...SoftSkills];
    }
    return [];
  }, [HardSkills, SoftSkills]);

  useEffect(() => {
    fetchData();

    setRolesSelected(roles || []);
    setAboutMeInput(aboutMe || '');
    setExperienceInput(experience || '');
    setTelegrammInput(telegramm || '');
  }, []);

  useEffect(() => {
    if (!skills || skills.length === 0) return;

    try {
      setSelectedHardSkills(JSON.parse(HardSkills));
      setSelectedSoftSkills(JSON.parse(SoftSkills));
    } catch (e) {
      console.error('Ошибка при парсинге навыков:', e);
      setSelectedHardSkills([]);
      setSelectedSoftSkills([]);
    }
  }, [skills]);

  const fetchData = async () => {
    let tempRoles: string[] = [];

    const querySnapshotRoles = await getDocs(collection(FIREBASE_DB, 'role'));
    querySnapshotRoles.forEach(doc => {
      if (doc.data().name && doc.data().name.length > 0)
        tempRoles.push(doc.data().name);
    });

    setRolesData(tempRoles);
  };

  const handleSave = async () => {
    setLoading(true);

    const allSkills = [...selectedHardSkills, ...selectedSoftSkills];

    if (allSkills.length === 0) {
      Alert.alert('Внимание', 'Пожалуйста, выберите хотя бы один навык');
      return;
    }

    const profileData = {
      AboutMe: aboutMeInput,
      Experience: experienceInput,
      HardSkills: JSON.stringify(selectedHardSkills),
      SoftSkills: JSON.stringify(selectedSoftSkills),
      roles: rolesSelected,
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
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (value: string) => {
    if (rolesSelected.includes(value)) {
      setRolesSelected(rolesSelected.filter(item => item !== value));
    } else {
      setRolesSelected([...rolesSelected, value]);
    }
  };

  const toggleRoles = () => {
    setRolesOpen(!rolesOpen);
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
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

              <Text style={styles.sectionTitle}>Hard Skills</Text>
              <SkillsInput
                selectedSkills={selectedHardSkills}
                setSelectedSkills={setSelectedHardSkills}
                type="ST1"
              />

              <Text style={styles.sectionTitle}>Soft Skills</Text>
              <SkillsInput
                selectedSkills={selectedSoftSkills}
                setSelectedSkills={setSelectedSoftSkills}
                type="ST2"
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

              <View style={styles.project__container_with_plus}>
                <Text style={styles.project__text_2}>Роли:</Text>
                <View style={styles.fdrow}>
                  <TouchableOpacity
                    style={styles.project__button_plus}
                    onPress={toggleRoles}>
                    <Text style={styles.plus1}>+</Text>
                  </TouchableOpacity>
                  {rolesSelected.map(item => (
                    <View key={item} style={styles.selectedItem}>
                      <Text style={styles.selectedItemText}>{item}</Text>
                      <TouchableOpacity
                        onPress={() => handleRoleSelect(item)}
                        style={styles.removeSelectedItem}>
                        <View style={styles.removeSelectedItemTextContainer}>
                          <Text style={styles.cross1}>+</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                {rolesOpen && (
                  <ScrollView style={styles.dropdownContainer}>
                    <View style={styles.dropdownWrapper}>
                      {rolesData &&
                        rolesData.length > 0 &&
                        rolesData.map((item, ix) => (
                          <TouchableOpacity
                            key={ix}
                            style={[
                              styles.dropdownItem,
                              rolesSelected.includes(item) &&
                                styles.dropdownItemSelected,
                            ]}
                            onPress={() => handleRoleSelect(item)}>
                            <View style={styles.dropdownItemContainer}>
                              <View style={styles.dropdownItem_icon}>
                                <Text style={styles.plus2}>+</Text>
                              </View>
                              <Text style={styles.dropdownItemText}>
                                {item}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </ScrollView>
                )}
              </View>
              <View style={styles.fixedBottom}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  disabled={loading}>
                  <Text style={styles.saveButtonText}>Сохранить</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
