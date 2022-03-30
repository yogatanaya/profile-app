import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCq-Q61_aXD5zbBaom1-iSotRhWrnt0QgE",
  authDomain: "profile-crud-77f39.firebaseapp.com",
  projectId: "profile-crud-77f39",
  storageBucket: "profile-crud-77f39.appspot.com",
  messagingSenderId: "294493873573",
  appId: "1:294493873573:web:ebd248cb4ef4dee037344c",
  measurementId: "G-LC3SMMHWCF"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
