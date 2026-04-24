/**
 * notificationScheduler Cloud Function
 * Runs daily to check for upcoming election phases and sends
 * push notifications to registered users.
 */

const { onSchedule } = require('firebase-functions/v2/scheduler');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');
const { initializeApp } = require('firebase-admin/app');

try {
  initializeApp();
} catch (_e) {
  /* Already initialized */
}

const db = getFirestore();

const notificationScheduler = onSchedule('every day 09:00', async () => {
  try {
    const now = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(now.getDate() + 2);

    // Format dates to YYYY-MM-DD
    const dateStr = twoDaysFromNow.toISOString().split('T')[0];

    // Find timeline phases happening in exactly 2 days
    const phasesRef = db.collection('timelinePhases');
    const snapshot = await phasesRef.where('date', '==', dateStr).get();

    if (snapshot.empty) {
      console.log('No upcoming phases in the next 48 hours.');
      return;
    }

    const phases = snapshot.docs.map(doc => doc.data());
    
    // For simplicity, take the first upcoming phase
    const upcomingPhase = phases[0];
    
    const payload = {
      notification: {
        title: 'VoteWise Reminder 🗳️',
        body: `${upcomingPhase.label} is approaching on ${upcomingPhase.date}!`,
      },
      data: {
        screen: 'timeline'
      }
    };

    // Get all users with FCM tokens
    const usersRef = db.collection('users');
    const usersSnapshot = await usersRef.where('fcmToken', '!=', null).get();

    if (usersSnapshot.empty) {
      console.log('No users with FCM tokens found.');
      return;
    }

    const tokens = usersSnapshot.docs.map(doc => doc.data().fcmToken).filter(Boolean);
    
    if (tokens.length > 0) {
      const response = await getMessaging().sendEachForMulticast({
        tokens,
        ...payload
      });
      console.log(`Successfully sent ${response.successCount} messages; ${response.failureCount} failed.`);
    }
  } catch (error) {
    console.error('Error sending push notifications:', error);
  }
});

module.exports = { notificationScheduler };
