import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { User, onAuthStateChanged } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from './FireBaseConfig';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import Home from './src/pages/Home';
import Profile from './src/pages/Profile';
import Messenger from './src/pages/Messenger';
import Project from './src/pages/Project';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
      }}
    >
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused  }) => (
            <View style={[styles.tabIcon, { backgroundColor: focused ? '#9D69DE' : '#FFFFFF' }]}>
              <MaterialCommunityIcons name="account" color={focused ? '#FFFFFF' : '#BBBBBB'} size={size} />
            </View>
          ),
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIcon, { backgroundColor: focused ? '#9D69DE' : '#FFFFFF' }]}>
              <MaterialCommunityIcons name="home" color={focused ? '#FFFFFF' : '#BBBBBB'} size={size} />
            </View>
          ),
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="Messenger"
        component={Messenger}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIcon, { backgroundColor: focused ? '#9D69DE' : '#FFFFFF' }]}>
              <MaterialCommunityIcons name="email" color={focused ? '#FFFFFF' : '#BBBBBB'} size={size} />
            </View>
          ),
          tabBarLabel: '',
        }}
      />
      
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Homepage' : 'Login'}>
        {user ? (
          <Stack.Screen name='Homepage' component={MyTabs} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
            <Stack.Screen name='RegisterPage' component={Register} options={{ headerShown: false }} />
          </>
        )}
        <Stack.Screen name="Project" component={Project} options={{ headerShown: false }} />
      </Stack.Navigator>
      <StatusBar style='auto' />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    marginTop: 30,
    width: 74,
    height: 39,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
