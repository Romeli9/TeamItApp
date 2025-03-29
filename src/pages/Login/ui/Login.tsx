import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  TextInput,
  View,
} from 'react-native';

import {FIREBASE_AUTH} from 'app/FireBaseConfig';
import {Screens, Stacks} from 'app/navigation/navigationEnums';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

import {LoginPagestyles as styles} from './Login.styles';

export const LoginPage = () => {
  const {navigate} = useAppNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const SignIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      navigate(Screens.PROFILE);
    } catch (error: any) {
      Alert.alert('Sign In failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate(Screens.REGISTER);
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
