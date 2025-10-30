import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {FIREBASE_AUTH, FIREBASE_DB} from 'app/FireBaseConfig';
import {Screens, Stacks} from 'app/navigation/navigationEnums';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {collection, doc, setDoc} from 'firebase/firestore';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

import {RegisterStyles as styles} from './Register.styles';

export const RegisterPage = () => {
  const {navigate} = useAppNavigation();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const firestore = FIREBASE_DB;

  const SignUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = response.user;

      //TODO: вернуть users
      const userDocRef = doc(collection(firestore, 'users'), user.uid);

      await setDoc(userDocRef, {
        username: username,
        email: email,
        avatar:
          'https://firebasestorage.googleapis.com/v0/b/teamit-fd85a.appspot.com/o/empty%2Fimages.jpg?alt=media&token=997b132a-0902-4b26-8e97-81dfdfd3b44b',
      }).then(() =>
        navigate(Stacks.MAIN, {
          screen: Stacks.PROFILE_TAB,
          params: {
            screen: Screens.PROFILE,
          },
        }),
      );
    } catch (error) {
      Alert.alert('Sign Up failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.image_teamIT}>
        <Image
          source={require('shared/assets/teamIt/Case2.png')}
          style={{width: 150, height: 150}}
        />
      </View>
      <View style={styles.image_teamIT}>
        <Image
          source={require('shared/assets/teamIt/Case1.png')}
          style={{width: 150, height: 150}}
        />
      </View>
      <View style={styles.image_team_IT}>
        <Image
          source={require('shared/assets/teamIt/imageTeamIt.png')}
          style={{width: 75, height: 75}}
        />
      </View>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={text => setEmail(text)}
          keyboardType="email-address"
        />

        <TextInput
          value={username}
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          onChangeText={text => setUsername(text)}
        />

        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={text => setPassword(text)}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={SignUp}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigate(Screens.LOGIN)}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <View style={styles.image_teamIT_down}>
        <Image
          source={require('shared/assets/teamIt/Case3.png')}
          style={{width: 450, height: 300}}
        />
      </View>
      <View style={styles.image_teamIT_down}>
        <Image
          source={require('shared/assets/teamIt/Case4.png')}
          style={{width: 450, height: 300}}
        />
      </View>
    </View>
  );
};
