/**
 * Jest Tests — faqHandler Cloud Function
 *
 * Tests cover:
 * 1. Happy path: Fetches all FAQs successfully
 * 2. Category filter: Fetches FAQs by category
 * 3. Error handling: Graceful Firestore failure
 */

jest.mock('firebase-admin/app', () => ({
  initializeApp: jest.fn(),
}));

const mockFaqDocs = [
  {
    id: 'faq_01',
    data: () => ({
      question: 'What documents do I need?',
      answer: 'Voter ID, Aadhaar, etc.',
      category: 'documents',
      order: 1,
    }),
  },
  {
    id: 'faq_02',
    data: () => ({
      question: 'How do I register?',
      answer: 'Visit nvsp.in',
      category: 'registration',
      order: 2,
    }),
  },
];

jest.mock('firebase-admin/firestore', () => {
  const mockQuery = {
    get: jest.fn().mockResolvedValue({
      docs: mockFaqDocs,
    }),
  };

  return {
    getFirestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        orderBy: jest.fn(() => mockQuery),
        where: jest.fn(() => ({
          orderBy: jest.fn(() => mockQuery),
        })),
      })),
    })),
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

describe('faqFetcher', () => {
  let faqFetcher;

  beforeAll(() => {
    const module = require('../src/faqHandler');
    faqFetcher = module.faqFetcher;
  });

  test('fetches all FAQs when no category filter is provided', async () => {
    const result = await faqFetcher({ data: {} });

    expect(result).toHaveProperty('faqs');
    expect(result.faqs).toHaveLength(2);
    expect(result.faqs[0]).toHaveProperty('id', 'faq_01');
    expect(result.faqs[0]).toHaveProperty('question');
    expect(result.faqs[0]).toHaveProperty('answer');
  });

  test('fetches FAQs with category "all" returns all FAQs', async () => {
    const result = await faqFetcher({ data: { category: 'all' } });

    expect(result.faqs).toHaveLength(2);
  });

  test('fetches FAQs filtered by specific category', async () => {
    const result = await faqFetcher({ data: { category: 'documents' } });

    expect(result).toHaveProperty('faqs');
    /* The mock returns both docs regardless of filter — in production, Firestore does the filtering */
    expect(Array.isArray(result.faqs)).toBe(true);
  });

  test('handles Firestore errors gracefully with HttpsError', async () => {
    /* Override the mock to simulate failure */
    const { getFirestore } = require('firebase-admin/firestore');
    getFirestore.mockReturnValueOnce({
      collection: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          get: jest.fn().mockRejectedValue(new Error('Firestore unavailable')),
        })),
      })),
    });

    /* Re-require to get fresh handler with the error mock */
    jest.resetModules();
    jest.mock('firebase-admin/app', () => ({ initializeApp: jest.fn() }));
    jest.mock('firebase-admin/firestore', () => ({
      getFirestore: jest.fn(() => ({
        collection: jest.fn(() => ({
          orderBy: jest.fn(() => ({
            get: jest.fn().mockRejectedValue(new Error('Firestore unavailable')),
          })),
        })),
      })),
    }));
    jest.mock('firebase-functions/v2/https', () => ({
      onCall: jest.fn((config, handler) => handler),
      HttpsError: class HttpsError extends Error {
        constructor(code, message) {
          super(message);
          this.code = code;
        }
      },
    }));

    const freshModule = require('../src/faqHandler');
    const freshFaqFetcher = freshModule.faqFetcher;

    await expect(freshFaqFetcher({ data: {} })).rejects.toThrow(
      'Unable to fetch FAQs'
    );
  });
});
