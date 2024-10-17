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
import {signInWithEmailAndPassword} from 'firebase/auth';
import {FIREBASE_AUTH} from '../../FireBaseConfig';

const LoginPage: React.FC<{navigation: any}> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const SignIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      navigation.navigate('Homepage');
    } catch (error: any) {
      console.log(error);
      Alert.alert('Sign In failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigation.navigate('RegisterPage');
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
          <>
            <Button color="#B783EC" title="Login" onPress={SignIn} />
            <Button color="#B783EC" title="Register" onPress={goToRegister} />
          </>
        )}
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

export default LoginPage;

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
