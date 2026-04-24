/**
 * VoteWise — Unit Tests for Validators
 *
 * Tests all validation and eligibility logic in utils/validators.js
 * @module tests/validators
 */

import { describe, it, expect } from 'vitest';
import {
  validateChatMessage,
  validateEligibilityForm,
  checkEligibility,
  sanitizeInput,
  formatTimestamp,
} from '../src/utils/validators';

describe('validateChatMessage', () => {
  it('accepts valid messages', () => {
    const result = validateChatMessage('How do I register to vote?');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('rejects empty string', () => {
    const result = validateChatMessage('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('rejects whitespace-only string', () => {
    const result = validateChatMessage('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('rejects null/undefined', () => {
    expect(validateChatMessage(null).valid).toBe(false);
    expect(validateChatMessage(undefined).valid).toBe(false);
  });

  it('rejects messages exceeding max length (500 chars)', () => {
    const longMessage = 'A'.repeat(501);
    const result = validateChatMessage(longMessage);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('500');
  });

  it('accepts messages at exactly max length', () => {
    const exactMessage = 'A'.repeat(500);
    const result = validateChatMessage(exactMessage);
    expect(result.valid).toBe(true);
  });
});

describe('validateEligibilityForm', () => {
  it('accepts valid form data', () => {
    const result = validateEligibilityForm({
      age: 25,
      citizenship: 'indian',
      residenceStatus: 'resident',
    });
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('rejects missing age', () => {
    const result = validateEligibilityForm({
      age: null,
      citizenship: 'indian',
      residenceStatus: 'resident',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.age).toBeTruthy();
  });

  it('rejects age out of range', () => {
    const tooLow = validateEligibilityForm({ age: 0, citizenship: 'indian', residenceStatus: 'resident' });
    expect(tooLow.valid).toBe(false);

    const tooHigh = validateEligibilityForm({ age: 121, citizenship: 'indian', residenceStatus: 'resident' });
    expect(tooHigh.valid).toBe(false);
  });

  it('rejects missing citizenship', () => {
    const result = validateEligibilityForm({
      age: 20,
      citizenship: '',
      residenceStatus: 'resident',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.citizenship).toBeTruthy();
  });

  it('rejects missing residenceStatus', () => {
    const result = validateEligibilityForm({
      age: 20,
      citizenship: 'indian',
      residenceStatus: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.residenceStatus).toBeTruthy();
  });

  it('returns multiple errors at once', () => {
    const result = validateEligibilityForm({
      age: 0,
      citizenship: '',
      residenceStatus: '',
    });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThanOrEqual(3);
  });
});

describe('checkEligibility', () => {
  it('eligible Indian citizen of voting age', () => {
    const result = checkEligibility({ age: 25, citizenship: 'indian', residenceStatus: 'resident' });
    expect(result.eligible).toBe(true);
    expect(result.reason).toContain('eligible');
  });

  it('eligible at exact voting age (18)', () => {
    const result = checkEligibility({ age: 18, citizenship: 'indian', residenceStatus: 'resident' });
    expect(result.eligible).toBe(true);
  });

  it('ineligible non-Indian citizen', () => {
    const result = checkEligibility({ age: 25, citizenship: 'other', residenceStatus: 'resident' });
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('Indian citizen');
  });

  it('ineligible underage voter', () => {
    const result = checkEligibility({ age: 16, citizenship: 'indian', residenceStatus: 'resident' });
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('18');
    expect(result.details).toContain('2 year');
  });

  it('eligible NRI voter with special guidance', () => {
    const result = checkEligibility({ age: 30, citizenship: 'indian', residenceStatus: 'nri' });
    expect(result.eligible).toBe(true);
    expect(result.reason).toContain('NRI');
    expect(result.details).toContain('Form 6A');
  });

  it('correctly calculates years remaining for underage', () => {
    const result = checkEligibility({ age: 15, citizenship: 'indian', residenceStatus: 'resident' });
    expect(result.details).toContain('3 year');
  });
});

describe('sanitizeInput', () => {
  it('escapes HTML tags', () => {
    const result = sanitizeInput('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  it('escapes double quotes', () => {
    const result = sanitizeInput('He said "hello"');
    expect(result).toContain('&quot;');
  });

  it('escapes single quotes', () => {
    const result = sanitizeInput("It's a test");
    expect(result).toContain('&#x27;');
  });

  it('trims whitespace', () => {
    const result = sanitizeInput('   hello   ');
    expect(result).toBe('hello');
  });

  it('returns empty string for non-string input', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
    expect(sanitizeInput(123)).toBe('');
  });

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });
});

describe('formatTimestamp', () => {
  it('formats a JavaScript Date object', () => {
    const date = new Date('2024-04-19');
    const result = formatTimestamp(date);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('handles Firestore timestamp with toDate', () => {
    const firestoreTs = { toDate: () => new Date('2024-06-04') };
    const result = formatTimestamp(firestoreTs);
    expect(result).toBeTruthy();
  });

  it('returns empty string for null', () => {
    expect(formatTimestamp(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatTimestamp(undefined)).toBe('');
  });
});
