/**
 * Unit Tests — validators.js
 *
 * Tests the pure validation and utility functions used across the app.
 * Covers:
 * 1. Chat message validation (happy path, edge cases, error paths)
 * 2. Eligibility form validation
 * 3. Eligibility checking logic
 * 4. Input sanitization
 * 5. Timestamp formatting
 */

import {
  validateChatMessage,
  validateEligibilityForm,
  checkEligibility,
  sanitizeInput,
  formatTimestamp,
  formatChatTime,
} from '../src/utils/validators';

/* ──────────────────────────────────────────────────────────── */
/*                 validateChatMessage                         */
/* ──────────────────────────────────────────────────────────── */

describe('validateChatMessage', () => {
  test('accepts a valid message (happy path)', () => {
    const result = validateChatMessage('What documents do I need to vote?');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  test('rejects an empty string', () => {
    const result = validateChatMessage('');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('enter a message');
  });

  test('rejects a whitespace-only string', () => {
    const result = validateChatMessage('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('enter a message');
  });

  test('rejects null input', () => {
    const result = validateChatMessage(null);
    expect(result.valid).toBe(false);
  });

  test('rejects undefined input', () => {
    const result = validateChatMessage(undefined);
    expect(result.valid).toBe(false);
  });

  test('rejects a message exceeding 500 characters', () => {
    const longMessage = 'a'.repeat(501);
    const result = validateChatMessage(longMessage);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('500');
  });

  test('accepts a message exactly at 500 characters', () => {
    const exactMessage = 'a'.repeat(500);
    const result = validateChatMessage(exactMessage);
    expect(result.valid).toBe(true);
  });
});

/* ──────────────────────────────────────────────────────────── */
/*               validateEligibilityForm                       */
/* ──────────────────────────────────────────────────────────── */

describe('validateEligibilityForm', () => {
  test('accepts valid form data (happy path)', () => {
    const result = validateEligibilityForm({
      age: 25,
      citizenship: 'indian',
      residenceStatus: 'resident',
    });
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  test('rejects missing age', () => {
    const result = validateEligibilityForm({
      age: null,
      citizenship: 'indian',
      residenceStatus: 'resident',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('age');
  });

  test('rejects age below 1', () => {
    const result = validateEligibilityForm({
      age: 0,
      citizenship: 'indian',
      residenceStatus: 'resident',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.age).toContain('valid age');
  });

  test('rejects age above 120', () => {
    const result = validateEligibilityForm({
      age: 121,
      citizenship: 'indian',
      residenceStatus: 'resident',
    });
    expect(result.valid).toBe(false);
  });

  test('rejects missing citizenship', () => {
    const result = validateEligibilityForm({
      age: 25,
      citizenship: '',
      residenceStatus: 'resident',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('citizenship');
  });

  test('rejects missing residence status', () => {
    const result = validateEligibilityForm({
      age: 25,
      citizenship: 'indian',
      residenceStatus: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('residenceStatus');
  });

  test('collects multiple errors at once', () => {
    const result = validateEligibilityForm({
      age: null,
      citizenship: '',
      residenceStatus: '',
    });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(3);
  });
});

/* ──────────────────────────────────────────────────────────── */
/*                    checkEligibility                         */
/* ──────────────────────────────────────────────────────────── */

describe('checkEligibility', () => {
  test('eligible Indian citizen over 18 (happy path)', () => {
    const result = checkEligibility({
      age: 25,
      citizenship: 'indian',
      residenceStatus: 'resident',
    });
    expect(result.eligible).toBe(true);
    expect(result.reason).toContain('eligible');
  });

  test('ineligible for non-Indian citizen', () => {
    const result = checkEligibility({
      age: 25,
      citizenship: 'other',
      residenceStatus: 'resident',
    });
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('Indian citizens');
  });

  test('ineligible for underage person', () => {
    const result = checkEligibility({
      age: 16,
      citizenship: 'indian',
      residenceStatus: 'resident',
    });
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('18');
    expect(result.details).toContain('2 years');
  });

  test('eligible NRI voter gets specific NRI details', () => {
    const result = checkEligibility({
      age: 30,
      citizenship: 'indian',
      residenceStatus: 'nri',
    });
    expect(result.eligible).toBe(true);
    expect(result.reason).toContain('NRI');
    expect(result.details).toContain('Form 6A');
  });

  test('exactly 18 years old is eligible', () => {
    const result = checkEligibility({
      age: 18,
      citizenship: 'indian',
      residenceStatus: 'resident',
    });
    expect(result.eligible).toBe(true);
  });

  test('exactly 17 years old is ineligible with 1 year message', () => {
    const result = checkEligibility({
      age: 17,
      citizenship: 'indian',
      residenceStatus: 'resident',
    });
    expect(result.eligible).toBe(false);
    expect(result.details).toContain('1 year');
    /* Should NOT say "1 years" */
    expect(result.details).not.toContain('1 years');
  });
});

/* ──────────────────────────────────────────────────────────── */
/*                    sanitizeInput                            */
/* ──────────────────────────────────────────────────────────── */

describe('sanitizeInput', () => {
  test('strips leading and trailing whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  test('escapes HTML angle brackets', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  test('escapes single quotes', () => {
    expect(sanitizeInput("it's")).toBe("it&#x27;s");
  });

  test('returns empty string for non-string input', () => {
    expect(sanitizeInput(123)).toBe('');
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
  });
});

/* ──────────────────────────────────────────────────────────── */
/*                  formatTimestamp                             */
/* ──────────────────────────────────────────────────────────── */

describe('formatTimestamp', () => {
  test('formats a Date object correctly', () => {
    const date = new Date('2024-04-19T10:00:00Z');
    const result = formatTimestamp(date);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContain('2024');
  });

  test('handles Firestore-style timestamp with toDate method', () => {
    const firestoreTimestamp = {
      toDate: () => new Date('2024-04-19T10:00:00Z'),
    };
    const result = formatTimestamp(firestoreTimestamp);
    expect(result).toContain('2024');
  });

  test('returns empty string for null/undefined', () => {
    expect(formatTimestamp(null)).toBe('');
    expect(formatTimestamp(undefined)).toBe('');
  });
});

describe('formatChatTime', () => {
  test('formats a Date into HH:MM string', () => {
    const date = new Date('2024-04-19T14:30:00Z');
    const result = formatChatTime(date);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('returns empty string for null', () => {
    expect(formatChatTime(null)).toBe('');
  });
});
