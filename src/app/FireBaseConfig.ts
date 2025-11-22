import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeApp} from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDoNZsMzHjaqvNWa1HjMxeISn3Mksx6ZIo',
  authDomain: 'team-it-e6c00.firebaseapp.com',
  databaseURL:
    'https://team-it-e6c00-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'team-it-e6c00',
  storageBucket: 'team-it-e6c00.appspot.com',
  messagingSenderId: '63417815638',
  appId: '1:63417815638:web:40cdfb1dc7eca04ae861f7',
  measurementId: 'G-TTDP197B9F',
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

export const auth = getAuth(FIREBASE_APP);
