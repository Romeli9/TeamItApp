import {createNavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {Messenger, Project} from 'pages';
import {useAppNavigation} from 'shared/libs/useAppNavigation.tsx';
import {Header} from 'widgets';

import {Screens, Stacks} from './navigationEnums.ts';
import {RootStackParamsList} from './navigationTypes.ts';
import {MainTabsNavigator} from './stacks';

export const RootNavigator = () => {
  const RootStack = createNativeStackNavigator<RootStackParamsList>();
  const navigation = useAppNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name={Stacks.MAIN}
        component={MainTabsNavigator}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name={Screens.MESSENGER}
        component={Messenger}
        options={() => ({
          header: () => <Header showBackButton onBackPress={handleGoBack} />,
        })}
      />
      <RootStack.Screen
        name={Screens.PROJECT}
        component={Project}
        options={{headerShown: false}}
      />
    </RootStack.Navigator>
  );
};

export const navigationRef = createNavigationContainerRef();
