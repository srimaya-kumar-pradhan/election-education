/**
 * @fileoverview Environment-aware logging utility for VoteWise.
 * In development: outputs colored, prefixed messages to console.
 * In production: suppresses info/warn, routes errors to Analytics.
 * Never use console.log directly — always use this logger.
 * @module logger
 */

/** @constant {boolean} Whether the app is running in development */
const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;

/**
 * @description Environment-aware application logger.
 * Use logger.info() for informational messages,
 * logger.warn() for warnings, logger.error() for errors.
 *
 * @example
 * import { logger } from "../utils/logger";
 * logger.info("User signed in", { uid: user.uid });
 * logger.error("Fetch failed", error);
 */
export const logger = {
  /**
   * @description Logs an informational message in development only.
   * @param {string} message - The message to log
   * @param {...*} args - Additional data to include in the log
   * @returns {void}
   */
  info: (message, ...args) => {
    if (isDev) {
      console.info(
        `%c[VoteWise INFO]%c ${message}`,
        'color: #1A73E8; font-weight: bold',
        'color: inherit',
        ...args,
      );
    }
  },

  /**
   * @description Logs a warning in development only.
   * @param {string} message - The warning message
   * @param {...*} args - Additional context data
   * @returns {void}
   */
  warn: (message, ...args) => {
    if (isDev) {
      console.warn(
        `%c[VoteWise WARN]%c ${message}`,
        'color: #FBBC04; font-weight: bold',
        'color: inherit',
        ...args,
      );
    }
  },

  /**
   * @description Logs an error in development and reports to
   * Firebase Analytics in production for monitoring.
   * @param {string} message - The error description
   * @param {Error|null} [error=null] - The error object if available
   * @returns {void}
   */
  error: (message, error = null) => {
    if (isDev) {
      console.error(
        `%c[VoteWise ERROR]%c ${message}`,
        'color: #EA4335; font-weight: bold',
        'color: inherit',
        error,
      );
    }
    /* In production, report to Firebase Analytics */
    if (!isDev) {
      try {
        import('firebase/analytics').then(({ getAnalytics, logEvent }) => {
          logEvent(getAnalytics(), 'app_error', {
            message: message,
            errorType: error?.name || 'UnknownError',
            /* DO NOT log error.message — may contain PII */
          });
        });
      } catch {
        /* Silently fail if analytics is unavailable */
      }
    }
  },
};
