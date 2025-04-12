import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import api from './api';

export const getToken = async () => {
  return axios({
    method: 'post',
    url: 'https://auth.emsicloud.com/connect/token',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: {
      client_id: process.env.EXPO_PUBLIC_CLIENT_ID,
      client_secret: process.env.EXPO_PUBLIC_CLIENT_SECRET,
      scope: process.env.EXPO_PUBLIC_SCOPE,
      grant_type: 'client_credentials',
    },
  }).then(async res => {
    const token = JSON.stringify(res.data.access_token);
    await AsyncStorage.setItem('token', token);
    console.log(res);
  });
};

export const getSkills = (q?: string, limit?: number) => {
  return api.get('/skills/versions/latest/skills', {
    params: {q, limit},
  });
};
