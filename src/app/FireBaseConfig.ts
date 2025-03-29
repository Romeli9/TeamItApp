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
  apiKey: 'AIzaSyAG5nA3_hhvGWXv3GkA1RvzZucKbyjsudU',
  authDomain: 'teamit-fd85a.firebaseapp.com',
  projectId: 'teamit-fd85a',
  storageBucket: 'teamit-fd85a.appspot.com',
  messagingSenderId: '86866590567',
  appId: '1:86866590567:web:2b3e358bd77d8acdc40dc2',
  measurementId: 'G-MYPH1TJZDM',
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

export const auth = getAuth(FIREBASE_APP);
