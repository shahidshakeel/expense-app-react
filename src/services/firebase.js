// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC1VTCAWVuD3Vo73j9VEFK9ofNBP4dbRDA',
  authDomain: 'dba2-25dbc.firebaseapp.com',
  projectId: 'dba2-25dbc',
  storageBucket: 'dba2-25dbc.appspot.com',
  messagingSenderId: '207150401488',
  appId: '1:207150401488:web:ce236cc9a261fff6a39bd5',
  measurementId: 'G-K324J8WK89',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
