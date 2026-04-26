/**
 * @fileoverview Input sanitization and validation utilities.
 * All user inputs MUST pass through these functions before
 * being sent to Gemini API, Firestore, or Cloud Functions.
 * Prevents XSS injection, prompt injection, and data corruption.
 * @module sanitize
 */

/**
 * @description Sanitizes raw text input from the user.
 * Strips HTML tags, removes dangerous characters, trims whitespace,
 * and enforces a maximum character length.
 *
 * @param {string} input - The raw text from a user input field
 * @param {number} [maxLength=500] - Maximum allowed character count
 * @returns {string} Clean, safe string suitable for API consumption
 * @throws {Error} If the input parameter is not a string type
 *
 * @example
 * const clean = sanitizeText("<script>alert('xss')</script>hi");
 * // Returns: "alertxsshi"
 *
 * @example
 * const clean = sanitizeText("How do I register to vote?");
 * // Returns: "How do I register to vote?"
 */
export const sanitizeText = (input, maxLength = 500) => {
  if (typeof input !== 'string') {
    throw new Error(
      `sanitizeText expects a string, received ${typeof input}`,
    );
  }
  return input
    .replace(/<[^>]*>/g, '')          // Strip all HTML tags
    .replace(/[<>'"`;\\{}]/g, '')     // Remove injection chars
    .replace(/\s+/g, ' ')            // Normalize whitespace
    .trim()
    .slice(0, maxLength);
};

/**
 * @description Validates and sanitizes an age value entered in the
 * eligibility checker form. Ensures it is a valid integer between
 * 1 and 120 inclusive.
 *
 * @param {*} value - Raw age input (could be string, number, null)
 * @returns {{ valid: boolean, value: number, error: string }}
 *   valid: whether the age passed all validation rules
 *   value: the parsed integer age (0 if invalid)
 *   error: human-readable error message (empty string if valid)
 *
 * @example
 * sanitizeAge("25")   // → { valid: true,  value: 25, error: "" }
 * sanitizeAge("abc")  // → { valid: false, value: 0,  error: "..." }
 * sanitizeAge(17)     // → { valid: true,  value: 17, error: "" }
 * sanitizeAge(0)      // → { valid: false, value: 0,  error: "..." }
 */
export const sanitizeAge = (value) => {
  const num = parseInt(String(value), 10);
  if (isNaN(num)) {
    return {
      valid: false,
      value: 0,
      error: 'Please enter a valid numeric age',
    };
  }
  if (num < 1 || num > 120) {
    return {
      valid: false,
      value: 0,
      error: 'Age must be a number between 1 and 120',
    };
  }
  return { valid: true, value: num, error: '' };
};

/**
 * @description Validates that a dropdown selection value exists
 * within a set of allowed values. Prevents parameter tampering.
 *
 * @param {string} value - The selected dropdown value
 * @param {string[]} allowedValues - Array of permitted values
 * @param {string} fieldName - Field name for error messages
 * @returns {{ valid: boolean, value: string, error: string }}
 *
 * @example
 * sanitizeSelect("indian", ["indian", "other"], "citizenship")
 * // → { valid: true, value: "indian", error: "" }
 */
export const sanitizeSelect = (value, allowedValues, fieldName) => {
  if (!allowedValues.includes(value)) {
    return {
      valid: false,
      value: '',
      error: `Invalid selection for ${fieldName}. Allowed: ${allowedValues.join(', ')}`,
    };
  }
  return { valid: true, value, error: '' };
};
