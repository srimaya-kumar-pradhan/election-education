/**
 * Unit Tests — demoData.js
 *
 * Verifies that the centralized demo data module:
 * 1. Exports all required collections
 * 2. Has correct data structure for each collection
 * 3. Has proper ordering and linking (journey steps, FAQ categories)
 */

import { DEMO_DATA } from '../src/utils/demoData';

/* ──────────────────────────────────────────────────────────── */
/*                     Structure                               */
/* ──────────────────────────────────────────────────────────── */

describe('DEMO_DATA module structure', () => {
  test('exports all three Firestore collections', () => {
    expect(DEMO_DATA).toHaveProperty('journeySteps');
    expect(DEMO_DATA).toHaveProperty('faqs');
    expect(DEMO_DATA).toHaveProperty('timelinePhases');
  });

  test('all collections are non-empty arrays', () => {
    expect(Array.isArray(DEMO_DATA.journeySteps)).toBe(true);
    expect(DEMO_DATA.journeySteps.length).toBeGreaterThan(0);
    expect(Array.isArray(DEMO_DATA.faqs)).toBe(true);
    expect(DEMO_DATA.faqs.length).toBeGreaterThan(0);
    expect(Array.isArray(DEMO_DATA.timelinePhases)).toBe(true);
    expect(DEMO_DATA.timelinePhases.length).toBeGreaterThan(0);
  });
});

/* ──────────────────────────────────────────────────────────── */
/*                    Journey Steps                            */
/* ──────────────────────────────────────────────────────────── */

describe('journeySteps', () => {
  const steps = DEMO_DATA.journeySteps;

  test('has exactly 5 steps', () => {
    expect(steps).toHaveLength(5);
  });

  test('each step has required fields', () => {
    steps.forEach((step) => {
      expect(step).toHaveProperty('id');
      expect(step).toHaveProperty('order');
      expect(step).toHaveProperty('title');
      expect(step).toHaveProperty('description');
      expect(step).toHaveProperty('icon');
      expect(step).toHaveProperty('ctaLabel');
    });
  });

  test('steps are in ascending order', () => {
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i].order).toBeGreaterThan(steps[i - 1].order);
    }
  });

  test('first step has no prevStepId, last step has no nextStepId', () => {
    expect(steps[0].prevStepId).toBeNull();
    expect(steps[steps.length - 1].nextStepId).toBeNull();
  });

  test('step chain is properly linked', () => {
    for (let i = 0; i < steps.length - 1; i++) {
      expect(steps[i].nextStepId).toBe(steps[i + 1].id);
      expect(steps[i + 1].prevStepId).toBe(steps[i].id);
    }
  });
});

/* ──────────────────────────────────────────────────────────── */
/*                        FAQs                                 */
/* ──────────────────────────────────────────────────────────── */

describe('faqs', () => {
  const faqs = DEMO_DATA.faqs;

  test('has at least 10 FAQs', () => {
    expect(faqs.length).toBeGreaterThanOrEqual(10);
  });

  test('each FAQ has required fields', () => {
    faqs.forEach((faq) => {
      expect(faq).toHaveProperty('question');
      expect(faq).toHaveProperty('answer');
      expect(faq).toHaveProperty('category');
      expect(faq).toHaveProperty('order');
      expect(typeof faq.question).toBe('string');
      expect(typeof faq.answer).toBe('string');
    });
  });

  test('covers all expected categories', () => {
    const categories = [...new Set(faqs.map((f) => f.category))];
    expect(categories).toEqual(expect.arrayContaining(['documents', 'registration', 'evm', 'booth']));
  });

  test('FAQs have unique order values', () => {
    const orders = faqs.map((f) => f.order);
    const uniqueOrders = new Set(orders);
    expect(uniqueOrders.size).toBe(orders.length);
  });
});

/* ──────────────────────────────────────────────────────────── */
/*                   Timeline Phases                           */
/* ──────────────────────────────────────────────────────────── */

describe('timelinePhases', () => {
  const phases = DEMO_DATA.timelinePhases;

  test('has at least 8 phases', () => {
    expect(phases.length).toBeGreaterThanOrEqual(8);
  });

  test('each phase has required fields', () => {
    phases.forEach((phase) => {
      expect(phase).toHaveProperty('id');
      expect(phase).toHaveProperty('phase');
      expect(phase).toHaveProperty('label');
      expect(phase).toHaveProperty('date');
      expect(phase).toHaveProperty('description');
      expect(phase).toHaveProperty('status');
    });
  });

  test('phases have valid status values', () => {
    const validStatuses = ['completed', 'active', 'upcoming'];
    phases.forEach((phase) => {
      expect(validStatuses).toContain(phase.status);
    });
  });

  test('phases are in ascending order by phase number', () => {
    for (let i = 1; i < phases.length; i++) {
      expect(phases[i].phase).toBeGreaterThan(phases[i - 1].phase);
    }
  });

  test('dates are in ascending chronological order', () => {
    for (let i = 1; i < phases.length; i++) {
      expect(new Date(phases[i].date) >= new Date(phases[i - 1].date)).toBe(true);
    }
  });
});
