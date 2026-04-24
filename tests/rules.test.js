import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';

/**
 * Integration tests for Firestore security rules.
 */

let testEnv;

beforeAll(async () => {
  // Load the rules file
  const rules = readFileSync('firestore.rules', 'utf8');

  // Initialize the test environment
  testEnv = await initializeTestEnvironment({
    projectId: 'votewise-demo-test',
    firestore: {
      rules,
    },
  });
});

beforeEach(async () => {
  // Clear the database between tests
  await testEnv.clearFirestore();
});

afterAll(async () => {
  // Cleanup
  await testEnv.cleanup();
});

describe('Firestore Security Rules', () => {
  describe('Public Collections (faqs, journeySteps, timelinePhases)', () => {
    it('should allow anyone to read faqs', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      await assertSucceeds(unauthDb.collection('faqs').get());
    });

    it('should deny unauthenticated users to write faqs', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      await assertFails(unauthDb.collection('faqs').add({ q: 'test' }));
    });

    it('should allow anyone to read journeySteps', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      await assertSucceeds(unauthDb.collection('journeySteps').get());
    });

    it('should deny unauthenticated users to write journeySteps', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      await assertFails(unauthDb.collection('journeySteps').add({ step: 1 }));
    });

    it('should allow anyone to read timelinePhases', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      await assertSucceeds(unauthDb.collection('timelinePhases').get());
    });

    it('should deny unauthenticated users to write timelinePhases', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      await assertFails(unauthDb.collection('timelinePhases').add({ phase: 1 }));
    });
  });

  describe('Users Collection', () => {
    it('should deny unauthenticated users to read user data', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      await assertFails(unauthDb.collection('users').doc('user123').get());
    });

    it('should allow authenticated users to read their own data', async () => {
      const authDb = testEnv.authenticatedContext('user123').firestore();
      // Setup mock user
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('users').doc('user123').set({ name: 'Test' });
      });
      await assertSucceeds(authDb.collection('users').doc('user123').get());
    });

    it('should deny authenticated users to read other users data', async () => {
      const authDb = testEnv.authenticatedContext('user123').firestore();
      await assertFails(authDb.collection('users').doc('user456').get());
    });

    it('should allow authenticated users to update their own data', async () => {
      const authDb = testEnv.authenticatedContext('user123').firestore();
      await assertSucceeds(authDb.collection('users').doc('user123').set({ name: 'Test' }));
    });

    it('should deny authenticated users to update other users data', async () => {
      const authDb = testEnv.authenticatedContext('user123').firestore();
      await assertFails(authDb.collection('users').doc('user456').set({ name: 'Test' }));
    });
  });

  describe('Chat History Subcollection', () => {
    it('should allow users to read their own chat history', async () => {
      const authDb = testEnv.authenticatedContext('user123').firestore();
      await assertSucceeds(authDb.collection('users').doc('user123').collection('chatHistory').get());
    });

    it('should deny users to read other users chat history', async () => {
      const authDb = testEnv.authenticatedContext('user123').firestore();
      await assertFails(authDb.collection('users').doc('user456').collection('chatHistory').get());
    });

    it('should allow users to write to their own chat history', async () => {
      const authDb = testEnv.authenticatedContext('user123').firestore();
      await assertSucceeds(authDb.collection('users').doc('user123').collection('chatHistory').add({ message: 'Hello' }));
    });

    it('should deny users to write to other users chat history', async () => {
      const authDb = testEnv.authenticatedContext('user123').firestore();
      await assertFails(authDb.collection('users').doc('user456').collection('chatHistory').add({ message: 'Hello' }));
    });
  });
});
