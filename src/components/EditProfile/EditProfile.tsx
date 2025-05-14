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

import {Skill, SkillsInput} from 'components';
import {DocumentReference, updateDoc} from 'firebase/firestore';
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

  // Получаем данные из Redux store
  const {aboutMe, experience, HardSkills, SoftSkills, telegramm} = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch();

  const skills = useMemo(() => {
    if (HardSkills?.length && SoftSkills?.length) {
      return [...HardSkills, ...SoftSkills];
    }
    return [];
  }, [HardSkills, SoftSkills]);

  useEffect(() => {
    setAboutMeInput(aboutMe || '');
    setExperienceInput(experience || '');
    setTelegrammInput(telegramm || '');
  }, []);

  useEffect(() => {
    if (!skills || skills.length === 0) return;

    try {
      const parsedSkills =
        typeof skills === 'string' ? JSON.parse(skills) : skills;

      setSelectedHardSkills(
        parsedSkills.filter((s: Skill) => s.type.includes('ST1')),
      );
      setSelectedSoftSkills(
        parsedSkills.filter((s: Skill) => s.type.includes('ST2')),
      );
    } catch (e) {
      console.error('Ошибка при парсинге навыков:', e);
      setSelectedHardSkills([]);
      setSelectedSoftSkills([]);
    }
  }, [skills]);

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
            </ScrollView>

            <View style={styles.fixedBottom}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={loading}>
                <Text style={styles.saveButtonText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
