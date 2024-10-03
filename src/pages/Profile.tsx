import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {onAuthStateChanged} from 'firebase/auth';
import {collection, doc, getDoc} from 'firebase/firestore';
import {useSelector, useDispatch} from 'react-redux';

import {FIREBASE_AUTH, FIREBASE_DB} from '../../FireBaseConfig';
import {setUserData, setProfileData} from 'redux/slices/userSlice';
import EditProfile from 'components/EditProfile';
import {RootState} from 'redux/store';
import ProfileInfo from 'components/ProfileInfo';

const Profile: React.FC<{navigation: any}> = ({navigation}) => {
  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [userDocRef, setUserDocRef] = useState<any>(null);

  const dispatch = useDispatch();

  const {userName, aboutMe} = useSelector((state: RootState) => state.user);

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
          dispatch(
            setUserData({
              userId: user.uid,
              username: userData.username,
              email: userData.email,
              avatar: userData.avatar,
            }),
          );
          dispatch(setProfileData(userData));
          setUserDocRef(userDoc);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, fetchData);
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Background */}
        <View style={styles.header}>
         
          <Image
            source={{uri: 'https://placekitten.com/100/100'}}
            style={styles.avatar}
          />
          <Text style={styles.username}>{userName || 'Valeriya Mitkina'}</Text>
          <Text style={styles.handle}>@llerka_vm</Text>
          <Text style={styles.location}>Сертифицированный web-дизайнер из Томска</Text>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Подписаться</Text>
          </TouchableOpacity>
        </View>

        {/* Project Section */}
        <View style={styles.projectsContainer}>
          <Text style={styles.projectsTitle}>Проекты</Text>
          <View style={styles.projectsGrid}>
            {/* Mockup for projects */}
            <View style={styles.projectCard}>
              
              <Text style={styles.projectTitle}>Разработка приложения</Text>
              <Text style={styles.projectViews}>57 230 просмотров</Text>
            </View>

            <View style={styles.projectCard}>
             
              <Text style={styles.projectTitle}>Разработка приложения</Text>
              <Text style={styles.projectViews}>45 908 просмотров</Text>
            </View>
          </View>
        </View>

        <Button title="Sign Out" onPress={handleSignOut} />

        {isEditProfileVisible && (
          <EditProfile
            onModalClose={() => setEditProfileVisible(false)}
            userDocRef={userDocRef}
          />
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#342a54',
    paddingBottom: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    position: 'absolute',
    top: 0,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    marginTop: 50,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  handle: {
    fontSize: 16,
    color: '#ccc',
  },
  location: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 10,
  },
  followButton: {
    backgroundColor: '#8e6ace',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  projectsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  projectsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  projectsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  projectImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  projectViews: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
