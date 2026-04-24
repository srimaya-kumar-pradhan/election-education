/**
 * useFirestore Hook
 *
 * Manages Firestore data fetching for read-only collections:
 * journeySteps, faqs, and timelinePhases.
 *
 * Features:
 * - Session-level caching: Data is fetched once per session and reused
 *   across component mounts to avoid redundant Firestore reads.
 * - Timeout fallback: If Firestore doesn't respond within 3 seconds
 *   (e.g., demo credentials or no internet), falls back to curated demo data.
 * - Demo data: Realistic election data that allows the app to function
 *   fully even without a live Firestore connection.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  fetchJourneySteps,
  fetchFAQs,
  fetchTimelinePhases,
} from '../services/firebase';
import { DEMO_DATA } from '../utils/demoData';

/**
 * Session-level cache for Firestore collections.
 * Persists across component unmounts/remounts within the same browser session.
 * This prevents redundant Firestore reads for static data like FAQs.
 * @type {Map<string, Array>}
 */
const sessionCache = new Map();

/**
 * Custom hook for fetching Firestore collections with caching
 * @param {'journeySteps' | 'faqs' | 'timelinePhases'} collectionName
 * @returns {{ data: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function useFirestore(collectionName) {
  const [data, setData] = useState(() => {
    /* Initialize from cache if available to avoid loading flash */
    return sessionCache.get(collectionName) || [];
  });
  const [loading, setLoading] = useState(!sessionCache.has(collectionName));
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (bypassCache = false) => {
    /* Return cached data if available and not explicitly bypassed */
    if (!bypassCache && sessionCache.has(collectionName)) {
      setData(sessionCache.get(collectionName));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result = [];

      /* Wrap Firestore calls with a 3-second timeout to avoid hanging with demo credentials */
      const fetchWithTimeout = (fetchFn) =>
        Promise.race([
          fetchFn(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Firestore timeout')), 3000)
          ),
        ]);

      switch (collectionName) {
        case 'journeySteps':
          result = await fetchWithTimeout(fetchJourneySteps);
          break;
        case 'faqs':
          result = await fetchWithTimeout(fetchFAQs);
          break;
        case 'timelinePhases':
          result = await fetchWithTimeout(fetchTimelinePhases);
          break;
        default:
          throw new Error(`Unknown collection: ${collectionName}`);
      }

      /* If Firestore returns empty, use demo data */
      if (result.length === 0) {
        result = DEMO_DATA[collectionName] || [];
      }

      /* Cache the result for this session */
      sessionCache.set(collectionName, result);
      setData(result);
    } catch (err) {
      console.warn(`Using demo data for ${collectionName}:`, err.message);
      setError(null);
      /* Fallback to demo data on error or timeout */
      const demoResult = DEMO_DATA[collectionName] || [];
      sessionCache.set(collectionName, demoResult);
      setData(demoResult);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Force-refetch from Firestore, bypassing the session cache.
   * Useful if the user expects fresh data (e.g., after seeding).
   */
  const refetch = useCallback(() => fetchData(true), [fetchData]);

  return { data, loading, error, refetch };
}
