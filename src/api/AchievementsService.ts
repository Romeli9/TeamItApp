import axios from 'axios';
import Constants from 'expo-constants';

const SERVER = Constants.expoConfig?.extra?.serverUrl;

// Создаем инстанс
const api = axios.create({
  baseURL: SERVER,
});

export const getAchievements = async ({userId, projects, reviews}: any) => {
  const response = await api.post('/achievements/calculate', {
    userId,
    projects,
    reviews,
  });

  return response.data;
};
