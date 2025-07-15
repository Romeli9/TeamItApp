import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken} from 'api';
import {Provider} from 'react-redux';
import {store} from 'redux/store';

import {RootNavigator, navigationRef} from './navigation/navigation';

export const App = () => {
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) await getToken();
  };

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
};
