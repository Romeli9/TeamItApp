import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import React from 'react';

import {ChatList} from 'pages';
import {HomeIcon, MessageIcon, ProfileIcon} from 'shared/icons';
import {Colors} from 'shared/libs/helpers/colors';

import {Screens, Stacks} from '../navigationEnums';
import {HomeStackNavigator, ProfileStackNavigator} from './';

export const MainTabsNavigator = () => {
  const MainTabs = createBottomTabNavigator();
  return (
    <MainTabs.Navigator
      detachInactiveScreens={false}
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          const iconProps = {fill: color, style: {width: size, height: size}};
          if (route.name === Stacks.HOME_TAB)
            return <HomeIcon {...iconProps} />;
          if (route.name === Stacks.PROFILE_TAB)
            return <ProfileIcon {...iconProps} />;
          if (route.name === Screens.CHATLIST)
            return <MessageIcon {...iconProps} />;
        },
        tabBarActiveTintColor: Colors.Purple100,
        tabBarInactiveTintColor: Colors.Gray500,
        tabBarStyle: (() => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          if (routeName === 'Messenger') return {display: 'none'};
          return {};
        })(),
      })}>
      <MainTabs.Screen
        name={Stacks.PROFILE_TAB}
        component={ProfileStackNavigator}
        options={{title: 'Профиль', headerShown: false}}
      />
      <MainTabs.Screen
        name={Stacks.HOME_TAB}
        component={HomeStackNavigator}
        options={{title: 'Главная', headerShown: false}}
      />
      <MainTabs.Screen
        name={Screens.CHATLIST}
        component={ChatList}
        options={{title: 'Чаты', headerShown: false}}
      />
    </MainTabs.Navigator>
  );
};
