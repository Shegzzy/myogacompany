import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from 'firebase/auth';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "myoga-80daa.firebaseapp.com",
  databaseURL: "https://myoga-80daa-default-rtdb.firebaseio.com",
  projectId: "myoga-80daa",
  storageBucket: "myoga-80daa.appspot.com",
  messagingSenderId: "762957034592",
  appId: "1:762957034592:web:2c453bf2ef030f5cb23f05",
  measurementId: "G-VVQRGMHHL5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

