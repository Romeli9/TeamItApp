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
  projectHardSkills: Skill[];
  projectSoftSkills: Skill[];
};

export type UserFrom = {
  priorityScore: number;
  username: string;
  id: string;
  HardSkills: string[];
  SoftSkills: string[];
  projectsParticipated?: string[];
};

const SearchModal = ({
  visible,
  onClose,
  onUserSelect,
  requiredRoles,
  projectHardSkills,
  projectSoftSkills,
}: SearchModalProps) => {
  console.log(projectHardSkills, projectSoftSkills);
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<UserFrom[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserFrom[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(requiredRoles);

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

      const allSkills = [
        ...(user.HardSkills || []),
        ...(user.SoftSkills || []),
      ].map(s => s.toLowerCase());

      const rolesMatch =
        selectedRoles.length === 0 ||
        selectedRoles.some(role =>
          allSkills.some(skill =>
            skill.toLowerCase().includes(role.toLowerCase()),
          ),
        );

      return nameMatch && rolesMatch;
    });

    setFilteredUsers(filtered);
  }, [searchText, users, selectedRoles]);

  const fetchUsers = async () => {
    try {
      const firestore = FIREBASE_DB;
      const usersRef = collection(firestore, 'tempUsers');
      const snapshot = await getDocs(usersRef);

      const allUsers: UserFrom[] = snapshot.docs
        .map(doc => {
          const data = doc.data();

          let userHardSkills = data.HardSkills || [];
          let userSoftSkills = data.SoftSkills || [];

          if (typeof userHardSkills === 'string') {
            userHardSkills = JSON.parse(userHardSkills);
          }
          if (typeof userSoftSkills === 'string') {
            userSoftSkills = JSON.parse(userSoftSkills);
          }

          const normalizedHard = Array.isArray(userHardSkills)
            ? userHardSkills.map(
                (item: any) => item.name?.toLowerCase?.() || '',
              )
            : [];

          const normalizedSoft = Array.isArray(userSoftSkills)
            ? userSoftSkills.map(
                (item: any) => item.name?.toLowerCase?.() || '',
              )
            : [];

          return {
            id: doc.id,
            username: data.username || '',
            HardSkills: normalizedHard,
            SoftSkills: normalizedSoft,
            projectsParticipated: data.projects || [],
            priorityScore: 0,
          };
        })
        .filter(user => user.username);

      const hardSkillNames = projectHardSkills.map(skill =>
        skill.name.toLowerCase(),
      );
      const softSkillNames = projectSoftSkills.map(skill =>
        skill.name.toLowerCase(),
      );

      const prioritizedUsers = allUsers.map(user => {
        let matchingHardSkillsCount = 0;
        let matchingSoftSkillsCount = 0;

        hardSkillNames.forEach(skill => {
          if (user.HardSkills?.includes(skill)) {
            matchingHardSkillsCount += 1;
          }
        });

        softSkillNames.forEach(skill => {
          if (user.SoftSkills?.includes(skill)) {
            matchingSoftSkillsCount += 1;
          }
        });

        const totalUserHardSkills = user.HardSkills.length;
        const totalProjectHardSkills = hardSkillNames.length;

        const totalUserSoftSkills = user.SoftSkills.length;
        const totalProjectSoftSkills = softSkillNames.length;

        const firstCoef =
          totalUserHardSkills && totalProjectHardSkills
            ? (matchingHardSkillsCount /
                Math.sqrt(totalUserHardSkills * totalProjectHardSkills)) *
              0.7
            : 0;

        const secondCoef =
          totalUserSoftSkills && totalProjectSoftSkills
            ? (matchingSoftSkillsCount /
                Math.sqrt(totalUserSoftSkills * totalProjectSoftSkills)) *
              0.3
            : 0;

        const matchScore = firstCoef + secondCoef;

        

        return {
          ...user,
          priorityScore: matchScore,
        };
      });

      const sortedUsers = prioritizedUsers.sort(
        (a, b) => b.priorityScore - a.priorityScore,
      );

      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users or processing data:', error);
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
                    {[
                      ...(user.HardSkills || []),
                      ...(user.SoftSkills || []),
                    ].join(', ')}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noResults}>
                {selectedRoles.length > 0
                  ? `Не найдено пользователей с навыками: ${selectedRoles.join(', ')}`
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
