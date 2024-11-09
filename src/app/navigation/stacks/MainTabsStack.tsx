import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import React from 'react';

import {ChatList} from 'pages';
import {HomeIcon, MessageIcon, ProfileIcon} from 'shared/icons';
import {Colors} from 'shared/libs/helpers/colors';

import {HomeStackNavigator, ProfileStackNavigator} from '.';
import {Screens} from '../navigationEnums';
import {MainTabsStackParamsList} from '../navigationTypes';

export const MainTabsNavigator = () => {
  const MainTabsStack = createBottomTabNavigator<MainTabsStackParamsList>();

  return (
    <MainTabsStack.Navigator
      detachInactiveScreens={false}
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          const iconProps = {fill: color, style: {width: size, height: size}};
          if (route.name === Screens.HOME_TAB)
            return <HomeIcon {...iconProps} />;
          if (route.name === Screens.PROFILE_TAB)
            return <ProfileIcon {...iconProps} />;
          if (route.name === Screens.CHATLIST)
            return <MessageIcon {...iconProps} />;
        },
        tabBarActiveTintColor: Colors.Green400,
        tabBarInactiveTintColor: Colors.Gray500,
        tabBarStyle: (route => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          if (routeName === Screens.MESSENGER) return {display: 'none'};
        })(route),
      })}>
      <MainTabsStack.Screen
        name={Screens.PROFILE_TAB}
        component={ProfileStackNavigator}
        options={{headerShown: false}}
      />
      <MainTabsStack.Screen
        name={Screens.HOME_TAB}
        component={HomeStackNavigator}
        options={{headerShown: false}}
      />
      <MainTabsStack.Screen
        name={Screens.CHATLIST}
        component={ChatList}
        options={{headerShown: false}}
      />
    </MainTabsStack.Navigator>
  );
};
