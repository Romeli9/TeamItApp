import {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {DocumentReference, getDoc, updateDoc} from 'firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {setProfileData} from 'redux/slices/userSlice';
import {RootState} from 'redux/store';

type EditProfileProps = {
  onModalClose: () => void;
  userDocRef: DocumentReference<any, any> | undefined;
};

interface UserProfile {
  AboutMe: string;
  Experience: string;
  Skills: string;
  Telegramm: string;
}

export const EditProfile: React.FC<EditProfileProps> = ({
  onModalClose,
  userDocRef,
}) => {
  const [isModalVisible, setModalVisible] = useState(true);

  const dispatch = useDispatch();

  const {aboutMe, experience, skills, telegramm} = useSelector(
    (state: RootState) => state.user,
  );

  const [aboutMeInput, setAboutMeInput] = useState(aboutMe);
  const [experienceInput, setExperienceInput] = useState(experience);
  const [skillsInput, setSkillsInput] = useState(skills);
  const [telegrammInput, setTelegrammInput] = useState(telegramm);

  const ModalCloseCreate = () => {
    dataProfile();
    onModalClose();
  };
  const dataProfile = async () => {
    try {
      if (userDocRef) {
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const updatedProfileData: Partial<UserProfile> = {};

          updatedProfileData.AboutMe = aboutMeInput;
          updatedProfileData.Experience = experienceInput;
          updatedProfileData.Skills = skillsInput;
          updatedProfileData.Telegramm = telegrammInput;

          dispatch(setProfileData(updatedProfileData));

          await updateDoc(userDocRef, updatedProfileData);

          console.log(
            'Profile data successfully updated in Firebase:',
            updatedProfileData,
          );
        }
      }
    } catch (error) {
      console.error('Error edit profile: ', error);
    }
  };
  return (
    <Modal visible={isModalVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => onModalClose()}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <View>
            <Text style={[styles.profile_aboutMe, {fontSize: 17}]}>О себе</Text>
          </View>
          <View style={[styles.project__about__container1, {marginTop: 5}]}>
            <TextInput
              value={aboutMeInput}
              placeholder="Напишите о себе"
              autoCapitalize="none"
              placeholderTextColor="#A8A8A8"
              onChangeText={text => setAboutMeInput(text)}
              style={styles.project_name__placeholder}
            />
          </View>
          <View>
            <Text style={[styles.profile_aboutMe, {fontSize: 17}]}>Опыт</Text>
          </View>
          <View style={[styles.project__about__container2, {marginTop: 5}]}>
            <TextInput
              value={experienceInput}
              placeholder="Ваш опыт"
              autoCapitalize="none"
              placeholderTextColor="#A8A8A8"
              onChangeText={text => setExperienceInput(text)}
              style={styles.project_name__placeholder}
            />
          </View>
          <View>
            <Text style={[styles.profile_aboutMe, {fontSize: 17}]}>Навыки</Text>
          </View>
          <View style={[styles.project__about__container2, {marginTop: 5}]}>
            <TextInput
              value={skillsInput}
              placeholder="Ваши навыки"
              autoCapitalize="none"
              placeholderTextColor="#A8A8A8"
              onChangeText={text => setSkillsInput(text)}
              style={styles.project_name__placeholder}
            />
          </View>
          <View>
            <Text style={[styles.profile_aboutMe, {fontSize: 17}]}>
              Telegram
            </Text>
          </View>
          <View style={[styles.project__about__container2, {marginTop: 5}]}>
            <TextInput
              value={telegrammInput}
              placeholder="Ссылка на телеграмм"
              autoCapitalize="none"
              placeholderTextColor="#A8A8A8"
              onChangeText={text => setTelegrammInput(text)}
              style={styles.project_name__placeholder}
            />
          </View>
          <TouchableOpacity
            style={styles.project__button_create}
            onPress={ModalCloseCreate}>
            <Text style={styles.project__text_create}>Сохранить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  project_name__placeholder: {
    backgroundColor: '#EDEDED',
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#A8A8A8',
    borderRadius: 30,
    paddingVertical: 9,
    paddingHorizontal: 18,
    width: 274,
    height: 42,
  },
  modalContent: {
    width: 316,
    height: 450,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    position: 'relative',
  },
  project__button_create: {
    backgroundColor: '#9260D1',
    width: 177,
    height: 46,
    left: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  project__text_create: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  closeButtonText: {
    fontSize: 24,
    color: 'white',
  },
  profile_aboutMe: {
    color: '#000000',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 5,
    width: 250,
    height: 27,
  },
  project__about__container1: {
    width: 274,
  },
  project__about__container2: {
    width: 274,
  },
});
