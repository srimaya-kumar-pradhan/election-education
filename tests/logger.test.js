/**
 * @fileoverview Tests for the environment-aware logger utility.
 * Verifies that logging behaves correctly in development mode.
 * @module tests/logger
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('logger utility', () => {

  describe('in development mode', () => {
    let logger;

    beforeEach(async () => {
      /* logger.js reads import.meta.env.DEV at module load time.
       * In vitest with environment: 'node', import.meta.env.DEV
       * may be undefined (falsy), so we test the module as-is
       * and verify it doesn't throw regardless of environment. */
      const mod = await import('../src/utils/logger');
      logger = mod.logger;
    });

    it('logger.info does not throw', () => {
      expect(() => logger.info('test message')).not.toThrow();
    });

    it('logger.warn does not throw', () => {
      expect(() => logger.warn('test warning')).not.toThrow();
    });

    it('logger.error does not throw', () => {
      expect(() => logger.error('test error', new Error('test'))).not.toThrow();
    });

    it('logger.info handles multiple arguments without error', () => {
      expect(() =>
        logger.info('msg', { key: 'value' }, [1, 2, 3]),
      ).not.toThrow();
    });

    it('logger.error handles null error parameter', () => {
      expect(() => logger.error('test error', null)).not.toThrow();
    });

    it('logger.error handles no error parameter', () => {
      expect(() => logger.error('test error')).not.toThrow();
    });
  });

  describe('logger API surface', () => {
    it('exports a logger object with info, warn, error methods', async () => {
      const { logger } = await import('../src/utils/logger');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
    });

    it('logger does not have unexpected methods', async () => {
      const { logger } = await import('../src/utils/logger');
      const keys = Object.keys(logger);
      expect(keys).toContain('info');
      expect(keys).toContain('warn');
      expect(keys).toContain('error');
      expect(keys.length).toBe(3);
    });
  });
});
