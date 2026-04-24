/**
 * VoteWise — Unit Tests for Constants
 *
 * Validates that all application constants are properly defined
 * and maintain structural integrity across updates.
 * @module tests/constants
 */

import { describe, it, expect } from 'vitest';
import {
  APP_NAME,
  APP_TAGLINE,
  APP_DESCRIPTION,
  ROUTES,
  NAV_LABELS,
  VALIDATION,
  FAQ_CATEGORIES,
  BOOTH_STEPS,
  ERRORS,
  SUCCESS,
  ANALYTICS_EVENTS,
  TIMELINE_STATUS,
  CITIZENSHIP_OPTIONS,
  RESIDENCE_OPTIONS,
} from '../src/utils/constants';

describe('Application Metadata', () => {
  it('APP_NAME is defined', () => {
    expect(APP_NAME).toBe('VoteWise');
  });

  it('APP_TAGLINE is defined', () => {
    expect(APP_TAGLINE).toBeTruthy();
    expect(typeof APP_TAGLINE).toBe('string');
  });

  it('APP_DESCRIPTION is defined and descriptive', () => {
    expect(APP_DESCRIPTION).toBeTruthy();
    expect(APP_DESCRIPTION.length).toBeGreaterThan(50);
  });
});

describe('Routes', () => {
  it('all routes start with /', () => {
    Object.values(ROUTES).forEach((route) => {
      expect(route).toMatch(/^\//);
    });
  });

  it('contains required routes', () => {
    expect(ROUTES.HOME).toBe('/');
    expect(ROUTES.CHAT).toBe('/chat');
    expect(ROUTES.JOURNEY).toBe('/journey');
    expect(ROUTES.FAQ).toBe('/faq');
    expect(ROUTES.ELIGIBILITY).toBe('/eligibility');
    expect(ROUTES.TIMELINE).toBe('/timeline');
    expect(ROUTES.PROFILE).toBe('/profile');
    expect(ROUTES.ONBOARDING).toBe('/onboarding');
  });

  it('all routes are unique', () => {
    const values = Object.values(ROUTES);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });
});

describe('Validation Constants', () => {
  it('MAX_MESSAGE_LENGTH is a reasonable positive number', () => {
    expect(VALIDATION.MAX_MESSAGE_LENGTH).toBeGreaterThan(0);
    expect(VALIDATION.MAX_MESSAGE_LENGTH).toBeLessThanOrEqual(10000);
  });

  it('VOTING_AGE is 18', () => {
    expect(VALIDATION.VOTING_AGE).toBe(18);
  });

  it('age range is valid', () => {
    expect(VALIDATION.MIN_AGE).toBeLessThan(VALIDATION.MAX_AGE);
    expect(VALIDATION.MIN_AGE).toBeGreaterThanOrEqual(1);
  });
});

describe('FAQ Categories', () => {
  it('has at least 3 categories', () => {
    expect(FAQ_CATEGORIES.length).toBeGreaterThanOrEqual(3);
  });

  it('first category is "all"', () => {
    expect(FAQ_CATEGORIES[0].id).toBe('all');
  });

  it('each category has id and label', () => {
    FAQ_CATEGORIES.forEach((cat) => {
      expect(cat.id).toBeTruthy();
      expect(cat.label).toBeTruthy();
    });
  });
});

describe('Booth Steps', () => {
  it('has 5 steps', () => {
    expect(BOOTH_STEPS).toHaveLength(5);
  });

  it('each step has required fields', () => {
    BOOTH_STEPS.forEach((step) => {
      expect(step.id).toBeDefined();
      expect(step.title).toBeTruthy();
      expect(step.description).toBeTruthy();
      expect(step.icon).toBeTruthy();
    });
  });

  it('steps are in order', () => {
    for (let i = 0; i < BOOTH_STEPS.length; i++) {
      expect(BOOTH_STEPS[i].id).toBe(i + 1);
    }
  });
});

describe('Error Messages', () => {
  it('all error messages are non-empty strings', () => {
    Object.values(ERRORS).forEach((msg) => {
      expect(typeof msg).toBe('string');
      expect(msg.length).toBeGreaterThan(0);
    });
  });
});

describe('Success Messages', () => {
  it('all success messages are non-empty strings', () => {
    Object.values(SUCCESS).forEach((msg) => {
      expect(typeof msg).toBe('string');
      expect(msg.length).toBeGreaterThan(0);
    });
  });
});

describe('Analytics Events', () => {
  it('all event names are snake_case strings', () => {
    Object.values(ANALYTICS_EVENTS).forEach((event) => {
      expect(event).toMatch(/^[a-z][a-z_]*$/);
    });
  });
});

describe('Timeline Status', () => {
  it('has completed, active, upcoming', () => {
    expect(TIMELINE_STATUS.COMPLETED).toBe('completed');
    expect(TIMELINE_STATUS.ACTIVE).toBe('active');
    expect(TIMELINE_STATUS.UPCOMING).toBe('upcoming');
  });
});

describe('Form Options', () => {
  it('citizenship options include indian', () => {
    const indianOption = CITIZENSHIP_OPTIONS.find((o) => o.value === 'indian');
    expect(indianOption).toBeTruthy();
  });

  it('residence options include resident and nri', () => {
    const resident = RESIDENCE_OPTIONS.find((o) => o.value === 'resident');
    const nri = RESIDENCE_OPTIONS.find((o) => o.value === 'nri');
    expect(resident).toBeTruthy();
    expect(nri).toBeTruthy();
  });
});
