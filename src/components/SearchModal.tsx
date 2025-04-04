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

type SearchModalProps = {
  visible: boolean;
  onClose: () => void;
  onUserSelect: (username: UserFrom) => void;
  requiredRoles: string[];
};

export type UserFrom = {
  username: string;
  id: string;
  skills?: string[];
};

const SearchModal = ({
  visible,
  onClose,
  onUserSelect,
  requiredRoles,
}: SearchModalProps) => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<UserFrom[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserFrom[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const fetchUsers = async () => {
    const firestore = FIREBASE_DB;
    const usersRef = collection(firestore, 'users');
    const snapshot = await getDocs(usersRef);

    const allUsers = snapshot.docs
      .map(doc => {
        const data = doc.data();
        const skillsArray =
          typeof data.Skills === 'string'
            ? data.Skills.split(',').map(s => s.trim())
            : data.Skills || [];

        return {
          username: data.username,
          id: doc.id,
          skills: skillsArray,
        } as UserFrom;
      })
      .filter(user => user.username);

    setUsers(allUsers);
  };

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
      const rolesMatch =
        selectedRoles.length === 0 ||
        selectedRoles.some(role =>
          user.skills?.some(skill =>
            skill.toLowerCase().includes(role.toLowerCase()),
          ),
        );
      return nameMatch && rolesMatch;
    });

    setFilteredUsers(filtered);
  }, [searchText, users, selectedRoles]);

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role],
    );
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

            <View style={styles.rolesContainer}>
              {requiredRoles.map((role, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.roleButton,
                    selectedRoles.includes(role) && styles.selectedRoleButton,
                  ]}
                  onPress={() => toggleRole(role)}>
                  <Text
                    style={[
                      styles.roleText,
                      selectedRoles.includes(role) && styles.selectedRoleText,
                    ]}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Введите имя пользователя..."
              value={searchText}
              onChangeText={setSearchText}
            />

            {selectedRoles.length > 0 && (
              <Text style={styles.selectedRoleInfo}>
                Подходящие на роли: {selectedRoles.join(', ')}
              </Text>
            )}

            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => onUserSelect(user)}
                  style={styles.userItemContainer}>
                  <Text style={styles.userItem}>{user.username}</Text>
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
});

export default SearchModal;
