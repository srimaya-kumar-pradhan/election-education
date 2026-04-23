/**
 * VoteWise Input Validators
 * All validation logic for user inputs
 */

import { VALIDATION } from './constants';

/**
 * Validates a chat message input
 * @param {string} message - The user message to validate
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateChatMessage(message) {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Please enter a message.' };
  }
  if (message.length > VALIDATION.MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message must be under ${VALIDATION.MAX_MESSAGE_LENGTH} characters.`,
    };
  }
  return { valid: true, error: null };
}

/**
 * Validates eligibility form inputs
 * @param {{ age: number, citizenship: string, residenceStatus: string }} data
 * @returns {{ valid: boolean, errors: object }}
 */
export function validateEligibilityForm(data) {
  const errors = {};

  if (!data.age || data.age < VALIDATION.MIN_AGE || data.age > VALIDATION.MAX_AGE) {
    errors.age = `Please enter a valid age between ${VALIDATION.MIN_AGE} and ${VALIDATION.MAX_AGE}.`;
  }

  if (!data.citizenship) {
    errors.citizenship = 'Please select your citizenship status.';
  }

  if (!data.residenceStatus) {
    errors.residenceStatus = 'Please select your residence status.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Checks voter eligibility based on inputs
 * @param {{ age: number, citizenship: string, residenceStatus: string }} data
 * @returns {{ eligible: boolean, reason: string, details: string }}
 */
export function checkEligibility(data) {
  const { age, citizenship, residenceStatus } = data;

  if (citizenship !== 'indian') {
    return {
      eligible: false,
      reason: 'Only Indian citizens are eligible to vote in Indian elections.',
      details: 'Voter eligibility requires Indian citizenship as per the Representation of the People Act.',
    };
  }

  if (age < VALIDATION.VOTING_AGE) {
    const yearsLeft = VALIDATION.VOTING_AGE - age;
    return {
      eligible: false,
      reason: `You must be at least ${VALIDATION.VOTING_AGE} years old to vote.`,
      details: `You will be eligible to vote in ${yearsLeft} year${yearsLeft > 1 ? 's' : ''}. Start your registration process 6 months before you turn 18!`,
    };
  }

  if (residenceStatus === 'nri') {
    return {
      eligible: true,
      reason: 'You are eligible to vote as an NRI voter!',
      details: 'As an NRI, you can vote in person at your constituency polling station. Register as an overseas elector using Form 6A on the NVSP portal.',
    };
  }

  return {
    eligible: true,
    reason: 'Congratulations! You are eligible to vote!',
    details: 'Make sure you are registered on the electoral roll. Visit voters.eci.gov.in to verify your name, or register using Form 6 on the NVSP portal.',
  };
}

/**
 * Sanitizes user input string
 * @param {string} input - Raw user input
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Formats a timestamp for display
 * @param {Date|object} timestamp - Date or Firestore timestamp
 * @returns {string} Formatted date string
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats time for chat messages
 * @param {Date|object} timestamp
 * @returns {string}
 */
export function formatChatTime(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
