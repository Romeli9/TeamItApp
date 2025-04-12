import axios from 'axios';
import {storage} from 'shared/libs/storage';

const api = axios.create({
  baseURL: 'https://emsiservices.com',
});

api.interceptors.request.use(config => {
  const token = storage.getString('token');

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

export default api;
