import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FireBaseConfig';
import { collection, addDoc, doc, setDoc } from "firebase/firestore"

const RegisterPage: React.FC<{ navigation: any }> = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const firestore = FIREBASE_DB;

  const SignUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const user = response.user;

      // Create user record in 'users' collection with user's uid as document ID
      const userDocRef = doc(collection(firestore, 'users'), user.uid);
      await setDoc(userDocRef, {
        username: username,
        email: email,
      });

      console.log('User registered:', user.uid);
      navigation.navigate('Homepage');
    } catch (error: any) {
      console.log(error);
      alert('Sign Up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior='padding'>
        <TextInput
          value={email}
          style={styles.input}
          placeholder='Email'
          autoCapitalize='none'
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />

        <TextInput
          value={username}
          style={styles.input}
          placeholder='Username'
          autoCapitalize='none'
          onChangeText={(text) => setUsername(text)}
        />

        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder='Password'
          autoCapitalize='none'
          onChangeText={(text) => setPassword(text)}
        />

        {loading ? (
          <ActivityIndicator size='large' color='#0000ff' />
        ) : (
          <Button title='Register' onPress={SignUp} />
        )}

        <Button title='Go to Login' onPress={() => navigation.navigate('Login')} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderColor: '#ccc',
    borderRadius: 10,
  },
});
