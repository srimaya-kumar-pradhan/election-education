/**
 * Firebase Configuration & Service Initialization
 * All Firebase services are initialized here and exported for use throughout the app.
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';

/**
 * Firebase configuration object.
 * In production, these values come from environment variables.
 * For development/demo, we use placeholders that should be replaced
 * with actual Firebase project credentials.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'votewise-demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'votewise-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'votewise-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX',
};

/** Initialize Firebase app */
const app = initializeApp(firebaseConfig);

/** Initialize Firebase services */
export const auth = getAuth(app);
export const db = getFirestore(app);

/** Initialize Analytics (only in browser environment) */
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn('Analytics initialization failed:', e.message);
  }
}
export { analytics };

/** Google Auth Provider */
const googleProvider = new GoogleAuthProvider();

/**
 * Signs in user with Google popup
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

/**
 * Signs out the current user
 * @returns {Promise<void>}
 */
export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
}

/**
 * Creates or updates user document in Firestore on first sign-in
 * @param {import('firebase/auth').User} user - Firebase auth user
 */
export async function createUserDocument(user) {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Anonymous',
      isFirstTimeVoter: true,
      fcmToken: null,
      eligibilityResult: null,
      createdAt: serverTimestamp(),
    });
  }
}

/**
 * Fetches the user document from Firestore
 * @param {string} uid - User UID
 * @returns {Promise<object|null>}
 */
export async function getUserDocument(uid) {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error('Error fetching user document:', error);
    return null;
  }
}

/**
 * Updates user document fields
 * @param {string} uid
 * @param {object} data
 */
export async function updateUserDocument(uid, data) {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }
}

/**
 * Fetches journey steps ordered by order field
 * @returns {Promise<Array>}
 */
export async function fetchJourneySteps() {
  try {
    const q = query(collection(db, 'journeySteps'), orderBy('order'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching journey steps:', error);
    return [];
  }
}

/**
 * Fetches all FAQs ordered by order field
 * @returns {Promise<Array>}
 */
export async function fetchFAQs() {
  try {
    const q = query(collection(db, 'faqs'), orderBy('order'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

/**
 * Fetches timeline phases ordered by phase number
 * @returns {Promise<Array>}
 */
export async function fetchTimelinePhases() {
  try {
    const q = query(collection(db, 'timelinePhases'), orderBy('phase'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching timeline phases:', error);
    return [];
  }
}

/**
 * Saves a chat message to user's chatHistory subcollection
 * @param {string} uid
 * @param {string} role - 'user' or 'model'
 * @param {string} content
 */
export async function saveChatMessage(uid, role, content) {
  try {
    const chatRef = collection(db, 'users', uid, 'chatHistory');
    await addDoc(chatRef, {
      role,
      content,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
  }
}

/**
 * Fetches chat history for a user
 * @param {string} uid
 * @returns {Promise<Array>}
 */
export async function fetchChatHistory(uid) {
  try {
    const chatRef = collection(db, 'users', uid, 'chatHistory');
    const q = query(chatRef, orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
}

/**
 * Logs an analytics event
 * @param {string} eventName
 * @param {object} params
 */
export function logAnalyticsEvent(eventName, params = {}) {
  if (analytics) {
    try {
      logEvent(analytics, eventName, params);
    } catch (e) {
      console.warn('Analytics event logging failed:', e.message);
    }
  }
}

export {
  onAuthStateChanged,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
};

export default app;
