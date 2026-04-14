// React Auth Context for EduReach AI
// Handles Firebase Auth state & role-based access

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUser } from '../lib/firestore';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Firebase user object
  const [userProfile, setUserProfile] = useState(null); // Firestore user document
  const [loading, setLoading] = useState(true);

  // Track admin session (stored in sessionStorage since admin uses Flask, not Firebase Auth)
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('edureach_admin') === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Fetch Firestore profile
        try {
          const profile = await getUser(user.uid);
          setUserProfile(profile);
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Logout function
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setIsAdmin(false);
    sessionStorage.removeItem('edureach_admin');
  };

  // Admin login (via Flask API, not Firebase Auth)
  const loginAdmin = () => {
    setIsAdmin(true);
    sessionStorage.setItem('edureach_admin', 'true');
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('edureach_admin');
  };

  const value = {
    currentUser,
    userProfile,
    isAdmin,
    loading,
    logout,
    loginAdmin,
    logoutAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
