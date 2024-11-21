import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DocumentReference, updateDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { ProjectType, selectProjectById } from 'redux/slices/projectsSlice';

type InviteModalProps = {
  onModalClose: () => void;
  userDocRef: DocumentReference<any> | undefined;
  Project: { projectId: string };
};

const InviteModal: React.FC<InviteModalProps> = ({
  onModalClose,
  userDocRef,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null); // Добавлено состояние для выбранного проекта
  const [message, setMessage] = useState<string>('');
  const projects = useSelector((state: any) => state.projects.yourProjects);
  console.log(projects);
  const handleInvite = async () => {
    if (userDocRef && selectedProjectId) { // Используем selectedProjectId
      try {
        await updateDoc(userDocRef, { projects: selectedProjectId, message: message, }); // Обновляем с использованием выбранного проекта
        alert('Приглашение отправлено!');
        onModalClose(); // Закрываем модальное окно после отправки
      } catch (error) {
        console.error('Ошибка при отправке приглашения:', error);
      }
    }
    else {
      alert('Пожалуйста, выберите проект.'); // Уведомление, если проект не выбран
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={true}
      onRequestClose={onModalClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Пригласить в проект</Text>
          <Text>Выберите проект:</Text>
          <Picker
            selectedValue={selectedProjectId}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedProjectId(itemValue)}>
           <Picker.Item label="Выберите проект" value={null} />
            {projects && projects.length > 0 ? (
              projects.map((project: { id: React.Key | null | undefined; name: string | undefined; }) => (
                <Picker.Item key={project.id} label={project.name} value={project.id} />
              ))
            ) : (
              <Picker.Item label="Нет доступных проектов" value={undefined} />
            )}
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Введите ваше сообщение"
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
      </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
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
    color: '#FFFFFF',
  },
  picker: {
    width: '100%', // Добавлено для корректного отображения Picker
    height: 50,
    top: -20,
  },
  input: {
    width: '90%',
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    top: 150,
    padding: 10,
  },
});

export default InviteModal;
