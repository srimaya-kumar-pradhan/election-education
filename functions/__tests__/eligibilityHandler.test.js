/**
 * Jest Tests — eligibilityHandler Cloud Function
 */

jest.mock('firebase-admin/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase-admin/firestore', () => {
  const mockDoc = {
    update: jest.fn().mockResolvedValue(undefined),
  };

  return {
    getFirestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => mockDoc),
      })),
    })),
    FieldValue: {
      serverTimestamp: jest.fn(() => 'mock-timestamp'),
    },
  };
});

jest.mock('firebase-functions/v2/https', () => ({
  onCall: jest.fn((config, handler) => handler),
  HttpsError: class HttpsError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
    }
  },
}));

describe('checkEligibility', () => {
  let checkEligibility;

  beforeAll(() => {
    const module = require('../src/eligibilityHandler');
    checkEligibility = module.checkEligibility;
  });

  test('rejects unauthenticated requests', async () => {
    await expect(
      checkEligibility({
        auth: null,
        data: { age: 20, citizenship: 'indian', residenceStatus: 'resident' },
      })
    ).rejects.toThrow('signed in');
  });

  test('rejects invalid age', async () => {
    await expect(
      checkEligibility({
        auth: { uid: 'user1' },
        data: { age: -1, citizenship: 'indian', residenceStatus: 'resident' },
      })
    ).rejects.toThrow('between 1 and 120');
  });

  test('rejects invalid citizenship', async () => {
    await expect(
      checkEligibility({
        auth: { uid: 'user1' },
        data: { age: 20, citizenship: 'invalid', residenceStatus: 'resident' },
      })
    ).rejects.toThrow('Citizenship');
  });

  test('returns eligible for valid Indian citizen over 18', async () => {
    const result = await checkEligibility({
      auth: { uid: 'user1' },
      data: { age: 20, citizenship: 'indian', residenceStatus: 'resident' },
    });

    expect(result.eligible).toBe(true);
    expect(result.reason).toContain('eligible');
  });

  test('returns not eligible for non-Indian citizen', async () => {
    const result = await checkEligibility({
      auth: { uid: 'user1' },
      data: { age: 25, citizenship: 'other', residenceStatus: 'resident' },
    });

    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('Indian citizens');
  });

  test('returns not eligible for underage person', async () => {
    const result = await checkEligibility({
      auth: { uid: 'user1' },
      data: { age: 16, citizenship: 'indian', residenceStatus: 'resident' },
    });

    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('18');
  });

  test('returns eligible with NRI details', async () => {
    const result = await checkEligibility({
      auth: { uid: 'user1' },
      data: { age: 30, citizenship: 'indian', residenceStatus: 'nri' },
    });

    expect(result.eligible).toBe(true);
    expect(result.reason).toContain('NRI');
  });
});
