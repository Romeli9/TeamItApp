import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FireBaseConfig';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import EditProfile from 'widgets/editProfile';

const Profile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [userDocRef, setUserDocRef] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const firestore = FIREBASE_DB;
        const usersRef = collection(firestore, 'users');
        const userDoc = doc(usersRef, user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUsername(userData.username);
          setProfileData(userData);
          console.log(profileData);
          setUserDocRef(userDoc);
        }
        
      }
    }
  
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, fetchData);
    return unsubscribe;

  }, []);

  const fetchUserProjects = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const usersRef = collection(FIREBASE_DB, 'users');
        const userDoc = doc(usersRef, user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setProfileData(userData);
          } else {
            console.log('Нет данных пользователя');
          }
        }
      }
     catch (error) {
      console.error('Error fetching user projects: ', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleCreateProfile = async () => {
    setEditProfileVisible(true);
  };

  const handleModalClose = () => {
    setEditProfileVisible(false);
  };
  const handleProjectDataChange = (data: any) => {
    setProfileData(data);
  };
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text>Hello, {username}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleCreateProfile}>
          <Image source={require('../shared/profile/edit.png')} style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
        <View style={styles.container1}>
        {profileData && (
          <View style={styles.profileDataContainer}>
          <Text>Обо мне: {profileData.AboutMe}</Text>
          <Text>Опыт: {profileData.Experience}</Text>
          <Text>Навыки: {profileData.Skills}</Text>
          </View>
        )}
        </View>
        <Button title="Sign Out" onPress={handleSignOut} />
        {isEditProfileVisible && <EditProfile onModalClose={handleModalClose} onProfileDataChange={handleProjectDataChange} userDocRef={userDocRef} />}
      </View>
    </SafeAreaProvider>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container1: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  project__about__container: {
    width: 274,
    marginTop: 5,
  },
  project__about__text: {
    fontSize: 18,
    color: '#000000',
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    textAlign: 'center',
  },
  profileDataContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
