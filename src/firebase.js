// Firebase 초기화 설정
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAw2ZTmqjqlJoML16Hub9LbDEUP1u7qD5E",
  authDomain: "handmadefactorynew.firebaseapp.com",
  projectId: "handmadefactorynew",
  storageBucket: "handmadefactorynew.firebasestorage.app",
  messagingSenderId: "515632397449",
  appId: "1:515632397449:web:ff89646c5b051664ee5a58",
  measurementId: "G-1644YLRKK3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

