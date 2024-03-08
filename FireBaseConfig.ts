
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAG5nA3_hhvGWXv3GkA1RvzZucKbyjsudU",
  authDomain: "teamit-fd85a.firebaseapp.com",
  projectId: "teamit-fd85a",
  storageBucket: "teamit-fd85a.appspot.com",
  messagingSenderId: "86866590567",
  appId: "1:86866590567:web:2b3e358bd77d8acdc40dc2",
  measurementId: "G-MYPH1TJZDM"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getAuth(FIREBASE_APP);