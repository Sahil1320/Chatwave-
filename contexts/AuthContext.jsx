import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        await fetchUserData(user.uid);
      } else {
        setUser(null);
        setUserData(null);
        setIsAuthenticated(false);
      }
    });

    return () => unsub();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  const updateUserData = async (uid, data) => {
    try {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, data, { merge: true });
      if (user && user.uid === uid) {
        setUserData(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.log('Error updating user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, isAuthenticated, updateUserData, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
