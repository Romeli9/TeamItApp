import * as eva from '@eva-design/eva';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {MaterialCommunityIcons} from '@expo/vector-icons';
import {StatusBar} from 'expo-status-bar';
import {User, onAuthStateChanged} from 'firebase/auth';
import {
  Home,
  LoginPage,
  Messenger,
  Profile,
  Project,
  RegisterPage,
  Search,
} from 'pages';
import {Provider} from 'react-redux';

import {FIREBASE_AUTH} from './src/app/FireBaseConfig';
import {store} from './src/redux/store';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackScreens() {
  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen
        name="Home2"
        component={Home}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
      }}>
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={[
                styles.tabIcon,
                {backgroundColor: focused ? '#9D69DE' : '#FFFFFF'},
              ]}>
              <MaterialCommunityIcons
                name="account"
                color={focused ? '#FFFFFF' : '#BBBBBB'}
                size={size}
              />
            </View>
          ),
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeStackScreens} 
        options={{
          headerShown: false,
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={[
                styles.tabIcon,
                {backgroundColor: focused ? '#9D69DE' : '#FFFFFF'},
              ]}>
              <MaterialCommunityIcons
                name="home"
                color={focused ? '#FFFFFF' : '#BBBBBB'}
                size={size}
              />
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
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={[
                styles.tabIcon,
                {backgroundColor: focused ? '#9D69DE' : '#FFFFFF'},
              ]}>
              <MaterialCommunityIcons
                name="email"
                color={focused ? '#FFFFFF' : '#BBBBBB'}
                size={size}
              />
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
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, user => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={user ? 'Homepage' : 'Login'}>
            {user ? (
              <Stack.Screen
                name="Homepage"
                component={MyTabs}
                options={{headerShown: false}}
              />
            ) : (
              <>
                <Stack.Screen
                  name="Login"
                  component={LoginPage}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="RegisterPage"
                  component={RegisterPage}
                  options={{headerShown: false}}
                />
              </>
            )}
            <Stack.Screen
              name="Project"
              component={Project}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </ApplicationProvider>
    </Provider>
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
