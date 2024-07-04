// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FG_API_KEY,
  authDomain: process.env.FG_AUTH_DOMAIN,
  projectId: process.env.FG_PROJECT_ID,
  storageBucket: process.env.FG_STORAGE_BUCKET,
  messagingSenderId: process.env.FG_MESSAGING_SENDER_ID,
  appId: process.env.FG_APP_ID,
  measurementId: process.env.FG_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };