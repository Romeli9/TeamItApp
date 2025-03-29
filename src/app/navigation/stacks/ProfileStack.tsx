import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {Profile} from 'pages';

import {Screens} from '../navigationEnums';
import {ProfileStackParamsList} from '../navigationTypes';

export const ProfileStackNavigator = () => {
  const ProfileStack = createNativeStackNavigator<ProfileStackParamsList>();

  return (
    <ProfileStack.Navigator screenOptions={{headerShown: false}}>
      <ProfileStack.Screen
        name={Screens.PROFILE}
        component={Profile}
        initialParams={{userId: undefined}}
      />
    </ProfileStack.Navigator>
  );
};
