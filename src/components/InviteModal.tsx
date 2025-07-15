import React, {useState} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import {FIREBASE_DB} from 'app/FireBaseConfig';
import {addDoc, collection} from 'firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {ProjectType, selectProjectById} from 'redux/slices/projectsSlice';
import {RootState} from 'redux/store';

type InviteModalProps = {
  onModalClose: () => void;
  userData: any;
  userIdRec: string;
};

export const InviteModal: React.FC<InviteModalProps> = ({
  onModalClose,
  userData,
  userIdRec, // юзер id получателя
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
    null,
  );
  const [selectedRole, setSelectedRole] = useState('');
  const [message, setMessage] = useState<string>('');
  const [part, setPart] = useState(0);

  const projects = useSelector(
    (state: RootState) => state.projects.yourProjects,
  );

  const {userId, userName} = useSelector((state: RootState) => state.user);

  const handleInvite = async () => {
    if (selectedProject?.id) {
      try {
        const requestData = {
          projectId: selectedProject.id,
          projectName: selectedProject.name,
          senderId: userId,
          senderName: userName,
          recipientId: userIdRec,
          recipientName: userData.username,
          role: selectedRole,
          message,
          status: 'pending',
          createdAt: Date.now(),
        };

        await addDoc(collection(FIREBASE_DB, 'projectRequests'), requestData);
        Alert.alert('Приглашение отправлено!');
        onModalClose();
      } catch (error) {
        console.error('Ошибка при отправке приглашения:', error);
      }
    } else {
      Alert.alert('Пожалуйста, выберите проект.');
    }
  };

  const renderPart = () => {
    switch (part) {
      case 0:
        return (
          <>
            <Text>Выберите проект:</Text>
            <Picker
              selectedValue={selectedProject?.id}
              style={styles.picker}
              itemStyle={{color: 'black', fontSize: 16}}
              onValueChange={itemValue => {
                const selectedProject = projects.find(
                  project => project.id === itemValue,
                );
                setSelectedProject(selectedProject || null);
              }}>
              <Picker.Item label="Выберите проект" value={''} />
              {projects && projects.length > 0 ? (
                projects.map(project => (
                  <Picker.Item
                    key={project.id}
                    label={project.name || 'Без названия'}
                    value={project.id}
                  />
                ))
              ) : (
                <Picker.Item label="Нет доступных проектов" value={undefined} />
              )}
            </Picker>

            <TouchableOpacity
              style={styles.button}
              disabled={!selectedProject}
              onPress={() => setPart(1)}>
              <Text style={styles.buttonText}>Далее</Text>
            </TouchableOpacity>
          </>
        );

      case 1:
        return (
          <>
            <Text>Выберите роль</Text>
            <Picker
              selectedValue={selectedRole}
              style={styles.picker}
              itemStyle={{color: 'black', fontSize: 16}}
              onValueChange={(item: string) => {
                setSelectedRole(item);
              }}>
              <Picker.Item label="Выберите роль" value={''} />
              {selectedProject?.required.map((item, ix) => (
                <Picker.Item key={ix} label={item} value={item} />
              ))}
            </Picker>

            <TextInput
              style={styles.input}
              placeholder="Введите ваше сообщение"
              placeholderTextColor="#A8A8A8"
              value={message}
              onChangeText={setMessage}
              multiline
            />

            <TouchableOpacity
              style={styles.button}
              disabled={!selectedRole}
              onPress={handleInvite}>
              <Text style={styles.buttonText}>Отправить приглашение</Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={true}
      onRequestClose={onModalClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Пригласить в проект</Text>

            {renderPart()}

            <TouchableOpacity style={styles.button} onPress={onModalClose}>
              <Text style={styles.buttonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    height: 455,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#BE9DE8',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    top: 175,
  },

  buttonText: {
    color: 'white',
  },
  picker: {
    width: '100%',
    height: 50,
    top: -20,
    color: '#00000',
  },
  input: {
    width: '90%',
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    top: 150,
    padding: 10,
    color: 'black',
  },
});
