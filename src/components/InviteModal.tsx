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
import {DocumentReference, updateDoc} from 'firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {ProjectType, selectProjectById} from 'redux/slices/projectsSlice';
import {RootState} from 'redux/store';

type InviteModalProps = {
  onModalClose: () => void;
  userDocRef: DocumentReference<any> | undefined;
  Project: {projectId: string};
};

export const InviteModal: React.FC<InviteModalProps> = ({
  onModalClose,
  userDocRef,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  ); // Добавлено состояние для выбранного проекта
  const [message, setMessage] = useState<string>('');
  const projects = useSelector(
    (state: RootState) => state.projects.yourProjects,
  );
  const handleInvite = async () => {
    if (userDocRef && selectedProjectId) {
      // Используем selectedProjectId
      try {
        await updateDoc(userDocRef, {
          projects: selectedProjectId,
          message: message,
        }); // Обновляем с использованием выбранного проекта
        Alert.alert('Приглашение отправлено!');
        onModalClose(); // Закрываем модальное окно после отправки
      } catch (error) {
        console.error('Ошибка при отправке приглашения:', error);
      }
    } else {
      Alert.alert('Пожалуйста, выберите проект.'); // Уведомление, если проект не выбран
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
            <Text>Выберите проект:</Text>
            <Picker
              selectedValue={selectedProjectId}
              style={styles.picker}
              itemStyle={{color: 'black', fontSize: 16}}
              onValueChange={itemValue => setSelectedProjectId(itemValue)}>
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

            <TextInput
              style={styles.input}
              placeholder="Введите ваше сообщение"
              placeholderTextColor="#A8A8A8"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleInvite}>
              <Text style={styles.buttonText}>Отправить приглашение</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2} onPress={onModalClose}>
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
  button2: {
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
