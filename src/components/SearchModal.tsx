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

import {collection, getDocs} from 'firebase/firestore';

import {FIREBASE_DB} from '../app/FireBaseConfig';
import {Skill} from './SkillsInput';

type SearchModalProps = {
  visible: boolean;
  onClose: () => void;
  onUserSelect: (username: UserFrom) => void;
  requiredRoles: string[];
  projectSkills: Skill[];
};

export type UserFrom = {
  priorityScore: number;
  username: string;
  id: string;
  skills?: string[];
  projectsParticipated?: string[];
};

const SearchModal = ({
  visible,
  onClose,
  onUserSelect,
  requiredRoles,
  projectSkills, // Навыки проекта
}: SearchModalProps) => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<UserFrom[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserFrom[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(requiredRoles);

  const skills = projectSkills.map(skill => skill.name);

  console.log('зашел');

  useEffect(() => {
    if (visible) {
      fetchUsers();
      setSelectedRoles([]);
      setSearchText('');
    }
  }, [visible]);

  useEffect(() => {
    const filtered = users.filter(user => {
      const nameMatch = user.username
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
      console.log(nameMatch);
      const rolesMatch =
        selectedRoles.length === 0 ||
        selectedRoles.some(role =>
          user.skills?.some(skill =>
            skill.toLowerCase().includes(role.toLowerCase()),
          ),
        );
      return nameMatch && rolesMatch;
    });
    console.log(filtered);
    setFilteredUsers(filtered);
  }, [searchText, users, selectedRoles]);

  const fetchUsers = async () => {
    try {
      console.log('123');
      const firestore = FIREBASE_DB;
      const usersRef = collection(firestore, 'tempUsers');
      const snapshot = await getDocs(usersRef);

      const allUsers = snapshot.docs
        .map(doc => {
          const data = doc.data();
          console.log(data);
          const skillsArray =
            typeof data.Skills === 'string'
              ? JSON.parse(data.Skills).map((s: Skill) => s.name)
              : data.Skills || [];

          return {
            username: data.username,
            id: doc.id,
            skills: skillsArray,
            projectsParticipated: data.projects || [],
          } as UserFrom;
        })
        .filter(user => user.username);

      // Вычисление приоритета пользователей
      const prioritizedUsers = allUsers.map(user => {
        let matchingSkillsCount = 0;
        const userSkills = user.skills || [];
        const totalUserSkills = userSkills.length;
        const totalProjectSkills = skills.length;

        // Считаем совпадения навыков
        skills.forEach(skill => {
          if (userSkills.includes(skill)) {
            matchingSkillsCount += 1;
          }
        });

        // Вычисляем приоритет
        const matchScore =
          matchingSkillsCount / Math.sqrt(totalUserSkills * totalProjectSkills);
        let participationScore = 0;
        if (user.projectsParticipated && user.projectsParticipated.length > 0) {
          participationScore = 1; // Если есть проекты, увеличиваем на 0.2
        }

        const finalScore = matchScore * 0.8 + participationScore * 0.2;

        return {
          ...user,
          priorityScore: finalScore,
        };
      });

      console.log('prioritizedUsers', prioritizedUsers);

      // Сортировка пользователей по приоритету
      const sortedUsers = prioritizedUsers.sort(
        (a, b) => b.priorityScore - a.priorityScore,
      );
      console.log('sortedUsers', sortedUsers);
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users or processing data:', error);
      // Здесь можно показать уведомление пользователю или выполнить другие действия
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <View style={styles.modalContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Поиск участников</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Введите имя пользователя..."
              value={searchText}
              onChangeText={setSearchText}
            />

            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => onUserSelect(user)}
                  style={styles.userItemContainer}>
                  <View style={styles.headerContent}>
                    <Text style={styles.userItem}>{user.username}</Text>
                    <Text
                      style={
                        user.priorityScore > 0.6
                          ? styles.userScoreHigh
                          : styles.userScore
                      }>
                      {user.priorityScore.toFixed(2)}
                    </Text>
                  </View>

                  <Text style={styles.userSkills}>
                    {user.skills?.join(', ')}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noResults}>
                {selectedRoles.length > 0
                  ? `Не найдено пользователей с навыками: ${selectedRoles.join(
                      ', ',
                    )}`
                  : 'Пользователи не найдены'}
              </Text>
            )}

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </ScrollView>
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
    backgroundColor: 'white',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  roleButton: {
    padding: 8,
    margin: 4,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  selectedRoleButton: {
    backgroundColor: '#BE9DE8',
  },
  roleText: {
    color: '#333',
  },
  selectedRoleText: {
    color: 'white',
  },
  selectedRoleInfo: {
    marginBottom: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  userItemContainer: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  userItem: {
    fontSize: 16,
    fontWeight: '500',
  },
  userScoreHigh: {
    fontSize: 16,
    fontWeight: '500',
    color: 'green',
  },
  userScore: {
    fontSize: 16,
    fontWeight: '500',
    color: 'red',
  },
  userSkills: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  noResults: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#BE9DE8',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SearchModal;
