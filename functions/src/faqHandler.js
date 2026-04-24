/**
 * faqHandler Cloud Function
 * HTTPS Callable function to fetch and filter FAQs from Firestore.
 */

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { getFirestore } = require('firebase-admin/firestore');
const { initializeApp } = require('firebase-admin/app');

try {
  initializeApp();
} catch (_e) {
  /* Already initialized */
}

const db = getFirestore();

/**
 * FAQ fetcher — retrieves FAQs with optional category filtering
 */
const faqFetcher = onCall(
  {
    maxInstances: 10,
    timeoutSeconds: 30,
    memory: '128MiB',
  },
  async (request) => {
    const { category } = request.data || {};

    try {
      let query = db.collection('faqs').orderBy('order');

      if (category && category !== 'all') {
        query = db
          .collection('faqs')
          .where('category', '==', category)
          .orderBy('order');
      }

      const snapshot = await query.get();
      const faqs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { faqs };
    } catch (error) {
      console.error('FAQ fetcher error:', error);
      throw new HttpsError(
        'internal',
        'Unable to fetch FAQs. Please try again.'
      );
    }
  }
);

module.exports = { faqFetcher };
