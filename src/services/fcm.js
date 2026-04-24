/**
 * Firebase Cloud Messaging Service
 * Handles requesting permissions and receiving FCM tokens.
 */

import { getMessaging, getToken } from 'firebase/messaging';
import { updateUserDocument } from './firebase';
import app from './firebase';

let messaging = null;
if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
  } catch (e) {
    console.warn('FCM initialization failed:', e.message);
  }
}

/**
 * Requests notification permissions and saves the FCM token to Firestore.
 * @param {string} uid - User UID
 */
export async function requestNotificationPermission(uid) {
  if (!messaging) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      if (token) {
        await updateUserDocument(uid, { fcmToken: token });
      }
    }
  } catch (error) {
    console.error('FCM permission error:', error);
  }
}
