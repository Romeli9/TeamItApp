import axios from 'axios';
import Constants from 'expo-constants';

const SERVER = Constants.expoConfig?.extra?.serverUrl;

// Создаем инстанс
const api = axios.create({
  baseURL: SERVER,
});

export const getFileUrl = async (fileId: string) => {
  const res = await api.get(`/file/${fileId}`);
  return res.data.url;
};

export const uploadFile = async (formData: any): Promise<string> => {
  const res = await api.post(`/upload`, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
  return res.data.id;
};
