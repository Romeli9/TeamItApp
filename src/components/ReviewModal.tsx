import React, {useEffect, useState} from 'react';
import {
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

import {useDispatch} from 'react-redux';
import {addReviewThunk} from 'redux/slices/reviewsSlice';
import {AppDispatch} from 'redux/store';
import {getUserById} from 'services/getUserById';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  projectId: string;
  fromUserId: string;
  toUserId: string;
  role: 'creator' | 'member';
  projectData: any;
  onSubmitNext?: () => void;
}

const strengthsList = [
  'Чёткие задачи',
  'Хорошая коммуникация',
  'Поддержка команды',
  'Организация',
  'Умение решать конфликты',
];

const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  onClose,
  projectId,
  fromUserId,
  toUserId,
  role,
  projectData,
  onSubmitNext,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [hardSkills, setHardSkills] = useState('');
  const [softSkills, setSoftSkills] = useState('');
  const [deadlines, setDeadlines] = useState('');
  const [contribution, setContribution] = useState('');
  const [overall, setOverall] = useState('');
  const [comment, setComment] = useState('');
  const [strengths, setStrengths] = useState<string[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(toUserId);
        setUserName(userData?.username || 'Неизвестный');
        // Определяем роль участника в проекте
        const memberIndex = projectData.members.findIndex(
          (id: string) => id === toUserId,
        );
        setUserRole(
          toUserId === projectData.creatorId
            ? 'creator'
            : projectData.required[memberIndex] || 'member',
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [toUserId, projectData]);

  const toggleStrength = (item: string) => {
    if (strengths.includes(item)) {
      setStrengths(strengths.filter(s => s !== item));
    } else {
      setStrengths([...strengths, item]);
    }
  };

  const handleSubmit = () => {
    if (role === 'creator') {
      dispatch(
        addReviewThunk({
          projectId,
          fromUserId,
          toUserId,
          role,
          hardSkills: Number(hardSkills),
          softSkills: Number(softSkills),
          deadlines: Number(deadlines),
          contribution: Number(contribution),
          comment,
        }),
      );
    } else {
      dispatch(
        addReviewThunk({
          projectId,
          fromUserId,
          toUserId,
          role,
          overall: Number(overall),
          strengths,
          comment,
        }),
      );
    }

    // если есть onSubmitNext — вызываем его для перехода к следующему участнику
    if (onSubmitNext) {
      onSubmitNext();
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.title}>
              {role === 'creator' ? 'Оценка участника' : 'Оценка руководителя'}
            </Text>

            <Text style={styles.userInfo}>
              {userName} — {userRole}
            </Text>

            {role === 'creator' ? (
              <>
                <Text style={styles.inputLabel}>Hard Skills (1–5)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={hardSkills}
                  onChangeText={setHardSkills}
                />
                <Text style={styles.inputLabel}>Soft Skills (1–5)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={softSkills}
                  onChangeText={setSoftSkills}
                />
                <Text style={styles.inputLabel}>Соблюдение сроков (1–5)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={deadlines}
                  onChangeText={setDeadlines}
                />
                <Text style={styles.inputLabel}>Вклад в проект (1–5)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={contribution}
                  onChangeText={setContribution}
                />
              </>
            ) : (
              <>
                <Text style={styles.inputLabel}>Общая оценка (1–5)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={overall}
                  onChangeText={setOverall}
                />
                <Text style={styles.subTitle}>Сильные стороны:</Text>
                {strengthsList.map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.strengthButton,
                      strengths.includes(s) && styles.strengthButtonActive,
                    ]}
                    onPress={() => toggleStrength(s)}>
                    <Text
                      style={[
                        styles.strengthText,
                        strengths.includes(s) && {color: 'white'},
                      ]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            <Text style={styles.inputLabel}>Комментарий</Text>
            <TextInput
              style={[styles.input, {height: 80, textAlignVertical: 'top'}]}
              placeholder="До 300 символов"
              multiline
              maxLength={300}
              value={comment}
              onChangeText={setComment}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Отправить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.submitButtonText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  container: {
    backgroundColor: '#fff',
    width: 300,
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  userInfo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
  },
  inputLabel: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#EDEDED',
    color: 'black',
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    borderRadius: 30,
    paddingVertical: 9,
    paddingHorizontal: 18,
    width: '100%',
    maxWidth: '100%',
    height: 42,
    marginBottom: 10,
  },
  strengthButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9260D1',
    marginBottom: 8,
  },
  strengthButtonActive: {
    backgroundColor: '#9260D1',
  },
  strengthText: {
    color: '#9260D1',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#9260D1',
    height: 46,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: '#AAAAAA',
    height: 46,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReviewModal;
