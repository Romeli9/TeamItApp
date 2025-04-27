import React, {useEffect, useState} from 'react';
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
  const {navigate, isAuthenticated} = useAppNavigation(); // Используем информацию об авторизации
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(Stacks.MAIN, {
        screen: Stacks.PROFILE_TAB,
        params: {screen: Screens.PROFILE},
      });
    }
  }, [isAuthenticated, navigate]); // Перенаправление, если пользователь уже авторизован

  const SignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password).then(
        () =>
          navigate(Stacks.MAIN, {
            screen: Stacks.PROFILE_TAB,
            params: {screen: Screens.PROFILE},
          }),
      );
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
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={setPassword}
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
    </View>
  );
};
