import React, {useEffect, useState} from 'react';
import {
  Modal,
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
  onUserSelect: (username: UserFrom) => void; // Добавьте пропс для обработки выбора пользователя
};

export type UserFrom = {
  username: string;
  id: string;
};

const SearchModal = ({visible, onClose, onUserSelect}: SearchModalProps) => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<UserFrom[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserFrom[]>([]);

  const fetchUsers = async () => {
    const firestore = FIREBASE_DB;
    const usersRef = collection(firestore, 'users');
    const snapshot = await getDocs(usersRef);

    const allUsers = snapshot.docs
      .map(doc => {
        const data = doc.data();
        const obj: UserFrom = {username: data.username, id: doc.id};
        return obj;
      })
      .filter(username => username);

    setUsers(allUsers);
  };

  useEffect(() => {
    if (visible) {
      fetchUsers();
    }
  }, [visible]);

  useEffect(() => {
    setFilteredUsers(
      users.filter(user =>
        user.username?.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
  }, [searchText, users]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Поиск участников</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Введите имя пользователя..."
            value={searchText}
            onChangeText={setSearchText}
          />

          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <TouchableOpacity key={index} onPress={() => onUserSelect(user)}>
                <Text style={styles.userItem}>{user.username}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noResults}>Пользователи не найдены</Text>
          )}

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    top: 20,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    top: 10,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  userItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  noResults: {
    textAlign: 'center',
    color: 'gray',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#BE9DE8',
    padding: 10,
    width: 200,
    left: 85,
    borderRadius: 15,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default SearchModal;
