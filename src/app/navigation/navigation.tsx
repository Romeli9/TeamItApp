import {createNavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';

import {auth} from 'app/FireBaseConfig.ts';
import {onAuthStateChanged} from 'firebase/auth';
import {
  LoginPage,
  Messenger,
  Project,
  ProjectRequests,
  RegisterPage,
} from 'pages';
import {ProjectRequestsList} from 'pages/ProjectRequestsList/ProjectRequestsList.tsx';
import {useAppNavigation} from 'shared/libs/useAppNavigation.tsx';
import {Header} from 'widgets';

import {Screens, Stacks} from './navigationEnums.ts';
import {RootStackParamsList} from './navigationTypes.ts';
import {MainTabsNavigator} from './stacks';

export const RootNavigator = () => {
  const RootStack = createNativeStackNavigator<RootStackParamsList>();
  const navigation = useAppNavigation();

  // Проверка авторизации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user && navigationRef.isReady()) {
        navigation.navigate(Screens.LOGIN);
      }
    });

    return unsubscribe;
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name={Screens.LOGIN}
        component={LoginPage}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={Screens.REGISTER}
        component={RegisterPage}
        options={{headerShown: false}}
      />

      <RootStack.Screen
        name={Stacks.MAIN}
        component={MainTabsNavigator}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={Screens.MESSENGER}
        component={Messenger}
        options={({route}) => ({
          header: () => (
            <Header
              showBackButton
              onBackPress={handleGoBack}
              chatName={route.params.chatName}
            />
          ),
        })}
      />
      <RootStack.Screen
        name={Screens.PROJECT}
        component={Project}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={Screens.PROJECT_LIST_REQUESTS}
        component={ProjectRequestsList}
        options={() => ({
          header: () => <Header showBackButton onBackPress={handleGoBack} />,
        })}
      />
      <RootStack.Screen
        name={Screens.PROJECT_REQUESTS}
        component={ProjectRequests}
        options={() => ({
          header: () => <Header showBackButton onBackPress={handleGoBack} />,
        })}
      />
    </RootStack.Navigator>
  );
};

export const navigationRef = createNavigationContainerRef();
