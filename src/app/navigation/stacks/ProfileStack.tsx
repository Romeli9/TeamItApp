import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {Profile, ProfileView} from 'pages';
import {useAppNavigation} from 'shared/libs/useAppNavigation';
import {Header} from 'widgets';

import {Screens} from '../navigationEnums';
import {ProfileStackParamsList} from '../navigationTypes';

export const ProfileStackNavigator = () => {
  const ProfileStack = createNativeStackNavigator<ProfileStackParamsList>();

  const navigation = useAppNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ProfileStack.Navigator screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name={Screens.PROFILE} component={Profile} />
      <ProfileStack.Screen
        name={Screens.VIEW_PROFILE}
        component={ProfileView}
        initialParams={{userId: undefined}}
      />
    </ProfileStack.Navigator>
  );
};
