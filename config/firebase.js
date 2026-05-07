// Firebase Configuration
// Replace these values with your own Firebase project config
import { initializeApp, getApps, getApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAdBy5lgqnw7HnBEcQFeENlhD_NgfWjtgk",
  authDomain: "chatwave-dbb41.firebaseapp.com",
  projectId: "chatwave-dbb41",
  storageBucket: "chatwave-dbb41.firebasestorage.app",
  messagingSenderId: "167531870739",
  appId: "1:167531870739:web:bdbd667e469847a9e59de6"
};

// Initialize Firebase only if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

import { getAuth, initializeAuth, getReactNativePersistence, browserLocalPersistence } from 'firebase/auth';
import { Platform } from 'react-native';

// Initialize Auth safely based on platform
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export { auth };

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;
