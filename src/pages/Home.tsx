import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { FIREBASE_AUTH } from '../../FireBaseConfig';

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  
  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      // После выхода из учетной записи, например, перенаправляем на страницу Login
      navigation.navigate('Login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Homepage!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
