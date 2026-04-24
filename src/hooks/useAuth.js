/**
 * useAuth Hook
 * Manages Firebase Authentication state throughout the application.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  auth,
  signInWithGoogle,
  signOutUser,
  createUserDocument,
  getUserDocument,
  onAuthStateChanged,
  logAnalyticsEvent,
} from '../services/firebase';
import { ANALYTICS_EVENTS } from '../utils/constants';

/**
 * Custom hook for Firebase Authentication
 * @returns {{ user, userData, loading, error, signIn, signOut, isFirstTimeVoter }}
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          await createUserDocument(firebaseUser);
          const data = await getUserDocument(firebaseUser.uid);
          setUserData(data);

          // Attempt to request push notifications permission
          import('../services/fcm').then(({ requestNotificationPermission }) => {
            requestNotificationPermission(firebaseUser.uid);
          }).catch(err => console.warn('FCM module not loaded', err));
        } catch (err) {
          console.error('Error loading user data:', err);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    setError(null);
    try {
      const result = await signInWithGoogle();
      logAnalyticsEvent(ANALYTICS_EVENTS.SIGN_IN);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const signOutHandler = useCallback(async () => {
    setError(null);
    try {
      await signOutUser();
      logAnalyticsEvent(ANALYTICS_EVENTS.SIGN_OUT);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    user,
    userData,
    loading,
    error,
    signIn,
    signOut: signOutHandler,
    isFirstTimeVoter: userData?.isFirstTimeVoter ?? false,
  };
}
