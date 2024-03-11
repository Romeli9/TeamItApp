import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Image } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FireBaseConfig';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, addDoc, getDocs } from 'firebase/firestore';
import ProjectWidget from '../widgets/ProjectWidget';
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker'; // Import ImagePickerResponse


import { loadFonts } from '../shared/fonts/fonts';


const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  
  const [username, setUsername] = useState<string | null>(null);
  const [userImgUrl, setUserImgUrl] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        const firestore = FIREBASE_DB;
        const usersRef = collection(firestore, 'users');
        const userDoc = doc(usersRef, user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUsername(userData.username);
          setUserImgUrl(userData.ImgUrl || '');
        }
      }

      const loadAppResources = async () => {
        await loadFonts();
        setFontsLoaded(true);
      };
  
      loadAppResources();
    });

    return unsubscribe;
  }, []);

  const insets = useSafeAreaInsets();

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View style = {{ flex: 1, paddingTop: insets.top}} >
          <Text>Loading...</Text>
        </View>
      </SafeAreaProvider>
      
    );
  }

  
  

  
  const ModalOpen = () => {
    setModalVisible(!isModalVisible);
  } 

  const ModalClose = () => {
    setModalVisible(false);
  };

  

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#FFFFFF', paddingLeft: 16 }}>
        <Text style={{ fontSize: 28 }}>Hello {username}</Text>

          <Text>Ваши проекты:</Text>
          <TouchableOpacity style={styles.create__button} onPress={ModalOpen}>
            <Text style={styles.create__text}>+</Text>
          </TouchableOpacity>
        

          <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Создание проекта</Text>
            <TouchableOpacity style={styles.closeButton} onPress={ModalClose}>
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
       
      </View>
    </SafeAreaProvider>

    
  );
};

export default Home;

const styles = StyleSheet.create({
  create__button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9D9D9',
    width: 82,
    height: 120,
    borderRadius: 20,
    marginTop: 13,
    marginBottom: 13,
  },
  create__text: {
    fontSize: 64,
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width: 316,
    height: 730,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 27,
    fontFamily: 'Inter-Bold',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'blue',
  },

});
