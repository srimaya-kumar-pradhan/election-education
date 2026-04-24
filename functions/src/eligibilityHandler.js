/**
 * eligibilityHandler Cloud Function
 * HTTPS Callable function to check voter eligibility server-side.
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

/** Minimum voting age in India */
const VOTING_AGE = 18;

/**
 * Server-side eligibility check
 */
const checkEligibility = onCall(
  {
    maxInstances: 10,
    timeoutSeconds: 30,
    memory: '128MiB',
  },
  async (request) => {
    /* Authentication check */
    if (!request.auth) {
      throw new HttpsError(
        'unauthenticated',
        'You must be signed in to check eligibility.'
      );
    }

    const uid = request.auth.uid;
    const { age, citizenship, residenceStatus } = request.data;

    /* Input validation */
    if (typeof age !== 'number' || age < 1 || age > 120) {
      throw new HttpsError(
        'invalid-argument',
        'Age must be a number between 1 and 120.'
      );
    }

    if (!citizenship || !['indian', 'other'].includes(citizenship)) {
      throw new HttpsError(
        'invalid-argument',
        'Citizenship must be either "indian" or "other".'
      );
    }

    if (!residenceStatus || !['resident', 'nri'].includes(residenceStatus)) {
      throw new HttpsError(
        'invalid-argument',
        'Residence status must be either "resident" or "nri".'
      );
    }

    /* Eligibility logic */
    let result;

    if (citizenship !== 'indian') {
      result = {
        eligible: false,
        reason: 'Only Indian citizens are eligible to vote in Indian elections.',
        details:
          'Voter eligibility requires Indian citizenship as per the Representation of the People Act.',
      };
    } else if (age < VOTING_AGE) {
      const yearsLeft = VOTING_AGE - age;
      result = {
        eligible: false,
        reason: `You must be at least ${VOTING_AGE} years old to vote.`,
        details: `You will be eligible to vote in ${yearsLeft} year${yearsLeft > 1 ? 's' : ''}. Start your registration process 6 months before you turn 18!`,
      };
    } else if (residenceStatus === 'nri') {
      result = {
        eligible: true,
        reason: 'You are eligible to vote as an NRI voter!',
        details:
          'As an NRI, you can vote in person at your constituency polling station. Register as an overseas elector using Form 6A on the NVSP portal.',
      };
    } else {
      result = {
        eligible: true,
        reason: 'Congratulations! You are eligible to vote!',
        details:
          'Make sure you are registered on the electoral roll. Visit voters.eci.gov.in to verify your name, or register using Form 6 on the NVSP portal.',
      };
    }

    /* Save result to user document */
    try {
      await db.collection('users').doc(uid).update({
        eligibilityResult: {
          ...result,
          checkedAt: new Date().toISOString(),
          inputs: { age, citizenship, residenceStatus },
        },
      });
    } catch (err) {
      console.error('Error saving eligibility result:', err);
    }

    return result;
  }
);

module.exports = { checkEligibility };
