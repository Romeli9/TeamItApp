import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {FIREBASE_AUTH, FIREBASE_DB} from '../../FireBaseConfig';
import {collection, addDoc, doc, setDoc} from 'firebase/firestore';

const RegisterPage: React.FC<{navigation: any}> = ({navigation}) => {
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

      const userDocRef = doc(collection(firestore, 'users'), user.uid);

      await setDoc(userDocRef, {
        username: username,
        email: email,
        avatar:
          'https://firebasestorage.googleapis.com/v0/b/teamit-fd85a.appspot.com/o/empty%2Fimages.jpg?alt=media&token=997b132a-0902-4b26-8e97-81dfdfd3b44b',
      });

      console.log('User registered:', user.uid);
      navigation.navigate('Homepage');
    } catch (error: any) {
      console.log(error);
      Alert.alert('Sign Up failed: ' + error.message);
      Alert.alert('Sign Up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.image_teamIT}>
      <Image
            source={require('../assets/teamIt/Case2.png')}
            style={{width: 150, height: 150}}
          />
      </View>
      <View style={styles.image_teamIT}>
      <Image
            source={require('../assets/teamIt/Case1.png')}
            style={{width: 150, height: 150}}
          />
      </View>
      <View style={styles.image_team_IT}>
      <Image
            source={require('../assets/teamIt/imageTeamIt.png')}
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
          <Button color="#B783EC" title="Register" onPress={SignUp} />
        )}

        <Button
          color="#B783EC"
          title="Go to Login"
          onPress={() => navigation.navigate('Login')}
        />
      </KeyboardAvoidingView>
      <View style={styles.image_teamIT_down}>
      <Image
            source={require('../assets/teamIt/Case3.png')}
            style={{width: 450, height: 300}}
          />
      </View>
      <View style={styles.image_teamIT_down}>
      <Image
            source={require('../assets/teamIt/Case4.png')}
            style={{width: 450, height: 300}}
          />
      </View>
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
  image_teamIT:{
    position: 'absolute',
    top: 60,
    right: 0,
    width: 0,
    height: 0,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  image_team_IT:{
    position: 'absolute',
    top: 70,
    right: 10,
    width: 0,
    height: 0,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  image_teamIT_down:{
    position: 'absolute',
    top: 700,
    right: 200,
    width: 0,
    height: 100,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
});
