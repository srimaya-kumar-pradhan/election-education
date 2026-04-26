/**
 * @fileoverview Edge case, boundary value, and negative path tests
 * for VoteWise core utilities. These tests cover scenarios not
 * addressed in the primary happy-path test suite and ensure
 * robust handling of unexpected or malicious inputs.
 * @module tests/edgeCases
 */

import { describe, it, expect } from 'vitest';
import { sanitizeText, sanitizeAge, sanitizeSelect } from '../src/utils/sanitize';

// ── sanitizeText ─────────────────────────────────────────────────
describe('sanitizeText — input sanitization', () => {

  describe('XSS and injection prevention', () => {
    it('strips script tags completely', () => {
      expect(sanitizeText("<script>alert('xss')</script>")).not.toContain('<script>');
    });

    it('strips onclick and event handler attributes', () => {
      expect(sanitizeText('<div onclick="steal()">text</div>')).not.toContain('onclick');
    });

    it('removes backtick characters (injection risk)', () => {
      expect(sanitizeText('`rm -rf /`')).not.toContain('`');
    });

    it('removes semicolons (injection risk)', () => {
      expect(sanitizeText('DROP TABLE users;')).not.toContain(';');
    });

    it('removes curly braces (template injection risk)', () => {
      const result = sanitizeText('{{constructor.constructor("return this")()}}');
      expect(result).not.toContain('{');
      expect(result).not.toContain('}');
    });
  });

  describe('length enforcement', () => {
    it('enforces default 500 char maximum', () => {
      expect(sanitizeText('a'.repeat(600)).length).toBe(500);
    });

    it('respects custom maxLength parameter', () => {
      expect(sanitizeText('hello world', 5).length).toBe(5);
    });

    it('returns full string when under limit', () => {
      const msg = 'How do I vote?';
      expect(sanitizeText(msg)).toBe(msg);
    });
  });

  describe('whitespace handling', () => {
    it('trims leading and trailing spaces', () => {
      expect(sanitizeText('  hello  ')).toBe('hello');
    });

    it('normalizes multiple internal spaces to one', () => {
      expect(sanitizeText('hello   world')).toBe('hello world');
    });
  });

  describe('edge cases', () => {
    it('handles empty string without error', () => {
      expect(sanitizeText('')).toBe('');
    });

    it('throws Error when input is null', () => {
      expect(() => sanitizeText(null)).toThrow();
    });

    it('throws Error when input is a number', () => {
      expect(() => sanitizeText(42)).toThrow();
    });

    it('throws Error when input is an object', () => {
      expect(() => sanitizeText({})).toThrow();
    });

    it('throws Error when input is an array', () => {
      expect(() => sanitizeText([])).toThrow();
    });

    it('throws Error when input is undefined', () => {
      expect(() => sanitizeText(undefined)).toThrow();
    });

    it('handles unicode and Hindi characters correctly', () => {
      const hindi = 'मैं कैसे मतदान करूं?';
      expect(sanitizeText(hindi).length).toBeGreaterThan(0);
    });

    it('preserves normal punctuation like periods and commas', () => {
      const msg = 'Hello, world. How are you?';
      expect(sanitizeText(msg)).toBe(msg);
    });
  });
});

// ── sanitizeAge ──────────────────────────────────────────────────
describe('sanitizeAge — age validation boundary tests', () => {

  describe('boundary values at age 18', () => {
    it('accepts age 18 — exactly at voting threshold', () => {
      const result = sanitizeAge(18);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(18);
      expect(result.error).toBe('');
    });

    it('accepts age 17 as valid number (eligibility check is separate)', () => {
      const result = sanitizeAge(17);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(17);
    });
  });

  describe('boundary values at minimum', () => {
    it('accepts age 1 — minimum valid age', () => {
      expect(sanitizeAge(1).valid).toBe(true);
    });

    it('rejects age 0 — below minimum', () => {
      expect(sanitizeAge(0).valid).toBe(false);
      expect(sanitizeAge(0).error).toBeTruthy();
    });

    it('rejects negative age', () => {
      expect(sanitizeAge(-5).valid).toBe(false);
    });
  });

  describe('boundary values at maximum', () => {
    it('accepts age 120 — maximum valid age', () => {
      expect(sanitizeAge(120).valid).toBe(true);
    });

    it('rejects age 121 — exceeds maximum', () => {
      expect(sanitizeAge(121).valid).toBe(false);
      expect(sanitizeAge(121).error).toBeTruthy();
    });
  });

  describe('type coercion and invalid inputs', () => {
    it('rejects non-numeric string', () => {
      expect(sanitizeAge('abc').valid).toBe(false);
    });

    it('rejects empty string', () => {
      expect(sanitizeAge('').valid).toBe(false);
    });

    it('rejects null', () => {
      expect(sanitizeAge(null).valid).toBe(false);
    });

    it('rejects undefined', () => {
      expect(sanitizeAge(undefined).valid).toBe(false);
    });

    it('parses string number correctly', () => {
      expect(sanitizeAge('25').valid).toBe(true);
      expect(sanitizeAge('25').value).toBe(25);
    });

    it('parses float string — parseInt truncates to integer', () => {
      expect(sanitizeAge('17.9').value).toBe(17);
    });
  });
});

// ── sanitizeSelect ──────────────────────────────────────────────
describe('sanitizeSelect — dropdown validation', () => {

  it('accepts a valid option', () => {
    const result = sanitizeSelect('indian', ['indian', 'other'], 'citizenship');
    expect(result.valid).toBe(true);
    expect(result.value).toBe('indian');
    expect(result.error).toBe('');
  });

  it('rejects an invalid option', () => {
    const result = sanitizeSelect('martian', ['indian', 'other'], 'citizenship');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('citizenship');
  });

  it('rejects an empty string option', () => {
    const result = sanitizeSelect('', ['indian', 'other'], 'citizenship');
    expect(result.valid).toBe(false);
  });

  it('error message includes allowed values', () => {
    const result = sanitizeSelect('xyz', ['a', 'b', 'c'], 'field');
    expect(result.error).toContain('a, b, c');
  });

  it('works with residence status options', () => {
    expect(sanitizeSelect('nri', ['resident', 'nri'], 'residence').valid).toBe(true);
    expect(sanitizeSelect('resident', ['resident', 'nri'], 'residence').valid).toBe(true);
    expect(sanitizeSelect('abroad', ['resident', 'nri'], 'residence').valid).toBe(false);
  });
});
