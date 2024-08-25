import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
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
      <View style={styles.container}>
        <Text style={styles.text}>Hello, {userName}</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setEditProfileVisible(true)}>
          <Image
            source={require('../assets/profile/edit.png')}
            style={{width: 25, height: 25}}
          />
        </TouchableOpacity>
        <View style={styles.container1}>
          {aboutMe ? (
            <ProfileInfo />
          ) : (
            <View style={styles.profileDataContainer}>
              <Text>Пожалуйста, заполните свой профиль</Text>
              <Text>нажмите кнопку справа с верху</Text>
            </View>
          )}
        </View>
        <Button title="Sign Out" onPress={handleSignOut} />
        {isEditProfileVisible && (
          <EditProfile
            onModalClose={() => setEditProfileVisible(false)}
            userDocRef={userDocRef}
          />
        )}
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
  text: {
    fontSize: 22,
    color: '#333',
    fontFamily: 'Inter-Regular',
  },
});
