import axios from 'axios';
import {storage} from 'shared/libs/storage';

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
    },
  }).then(res => {
    storage.set('token', res.data.access_token);
    console.log(res);
  });
};

export const getSkills = (q?: string, limit?: number) => {
  return api.get('/skills/versions/latest/skills', {
    params: {q, limit},
  });
};
