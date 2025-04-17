import * as eva from '@eva-design/eva';
import {NavigationContainer} from '@react-navigation/native';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import React, {useEffect} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken} from 'api';
import 'react-native-svg';
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
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <RootNavigator />
        </ApplicationProvider>
      </NavigationContainer>
    </Provider>
  );
};
export {navigationRef};
