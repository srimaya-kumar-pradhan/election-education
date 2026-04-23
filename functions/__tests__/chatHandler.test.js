/**
 * Jest Tests — chatHandler Cloud Function
 */

/* Mock Firebase Admin */
jest.mock('firebase-admin/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase-admin/firestore', () => {
  const mockDoc = {
    get: jest.fn().mockResolvedValue({ exists: false }),
    set: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
  };

  const mockCollection = {
    doc: jest.fn(() => mockDoc),
  };

  const mockSubCollection = {
    doc: jest.fn(() => ({
      ...mockDoc,
    })),
  };

  return {
    getFirestore: jest.fn(() => ({
      collection: jest.fn((name) => {
        if (name === 'rateLimits') return mockCollection;
        if (name === 'users') {
          return {
            doc: jest.fn(() => ({
              collection: jest.fn(() => mockSubCollection),
            })),
          };
        }
        return mockCollection;
      }),
      batch: jest.fn(() => ({
        create: jest.fn(),
        commit: jest.fn().mockResolvedValue(undefined),
      })),
    })),
    FieldValue: {
      serverTimestamp: jest.fn(() => 'mock-timestamp'),
    },
  };
});

/* Mock Gemini AI */
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn(() => ({
      startChat: jest.fn(() => ({
        sendMessage: jest.fn().mockResolvedValue({
          response: {
            text: () => 'You need a valid photo ID to vote.',
          },
        }),
      })),
    })),
  })),
}));

/* Mock Firebase Functions */
jest.mock('firebase-functions/v2/https', () => ({
  onCall: jest.fn((config, handler) => handler),
  HttpsError: class HttpsError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
    }
  },
}));

describe('chatHandler', () => {
  let chatHandler;

  beforeAll(() => {
    process.env.GEMINI_API_KEY = 'test-api-key';
    const module = require('../src/chatHandler');
    chatHandler = module.chatHandler;
  });

  test('rejects unauthenticated requests', async () => {
    await expect(
      chatHandler({ auth: null, data: { userMessage: 'hello' } })
    ).rejects.toThrow('You must be signed in');
  });

  test('rejects empty messages', async () => {
    await expect(
      chatHandler({ auth: { uid: 'user1' }, data: { userMessage: '' } })
    ).rejects.toThrow();
  });

  test('rejects non-string messages', async () => {
    await expect(
      chatHandler({ auth: { uid: 'user1' }, data: { userMessage: 123 } })
    ).rejects.toThrow('must be a string');
  });

  test('rejects messages over 500 characters', async () => {
    const longMessage = 'a'.repeat(501);
    await expect(
      chatHandler({ auth: { uid: 'user1' }, data: { userMessage: longMessage } })
    ).rejects.toThrow('under 500 characters');
  });

  test('processes valid messages successfully', async () => {
    const result = await chatHandler({
      auth: { uid: 'user1' },
      data: { userMessage: 'What ID do I need?', history: [] },
    });

    expect(result).toHaveProperty('reply');
    expect(typeof result.reply).toBe('string');
    expect(result.reply.length).toBeGreaterThan(0);
  });
});
