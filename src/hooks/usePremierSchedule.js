import { useState, useEffect, useMemo, useCallback } from 'react';

const PREMIER_KEY = 'sv_premiers';
const MAX_PUSHES = 3;

/**
 * Manages the personal premier schedule.
 * - Detects the user's typical watch hour from history
 * - Picks their most-watched channel
 * - Handles push (+1hr, up to 3 times) and cancel-for-today
 */
export function usePremierSchedule(preferences, history, channels) {
  const [premierData, setPremierData] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PREMIER_KEY)) || {}; }
    catch { return {}; }
  });

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem(PREMIER_KEY, JSON.stringify(premierData));
  }, [premierData]);

  // Detect typical watch hour (most frequent hour across recent history)
  const typicalWatchHour = useMemo(() => {
    if (!history || history.length < 2) return 20; // default: 8 PM
    const hours = history.map((h) => new Date(h.timestamp).getHours());
    const counts = hours.reduce((acc, h) => {
      acc[h] = (acc[h] || 0) + 1;
      return acc;
    }, {});
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return parseInt(sorted[0][0], 10);
  }, [history]);

  // Most-watched channel
  const preferredChannel = useMemo(() => {
    if (!channels || channels.length === 0) return null;
    if (!preferences || Object.keys(preferences).length === 0) return channels[0];
    return [...channels].sort(
      (a, b) => (preferences[b.id] || 0) - (preferences[a.id] || 0)
    )[0];
  }, [preferences, channels]);

  const todayKey = new Date().toDateString();

  // Compute scheduled premier timestamp for today
  const todaysPremierTime = useMemo(() => {
    const saved = premierData[todayKey];
    if (saved?.cancelled) return null;

    if (saved?.pushedTime) return saved.pushedTime;

    // Base time = today at typicalWatchHour
    const base = new Date();
    base.setHours(typicalWatchHour, 0, 0, 0);
    return base.getTime();
  }, [typicalWatchHour, premierData, tick]);

  // Premier state machine
  const premierState = useMemo(() => {
    if (!todaysPremierTime) return 'cancelled';
    const diff = todaysPremierTime - Date.now();
    if (diff > 15 * 60 * 1000)         return 'upcoming';    // > 15 min away
    if (diff > 0)                       return 'approaching'; // ≤ 15 min away
    if (diff > -2 * 60 * 60 * 1000)    return 'live';        // up to 2h past
    return 'expired';
  }, [todaysPremierTime, tick]);

  const pushesUsed = premierData[todayKey]?.pushCount || 0;
  const pushesRemaining = MAX_PUSHES - pushesUsed;

  const pushOneHour = useCallback(() => {
    setPremierData((prev) => {
      const current = prev[todayKey] || {};
      if ((current.pushCount || 0) >= MAX_PUSHES) return prev;

      const currentScheduled =
        current.pushedTime ||
        (() => {
          const b = new Date();
          b.setHours(typicalWatchHour, 0, 0, 0);
          return b.getTime();
        })();

      return {
        ...prev,
        [todayKey]: {
          ...current,
          pushedTime: currentScheduled + 3_600_000,
          pushCount: (current.pushCount || 0) + 1,
        },
      };
    });
  }, [todayKey, typicalWatchHour]);

  const cancelToday = useCallback(() => {
    setPremierData((prev) => ({
      ...prev,
      [todayKey]: { ...prev[todayKey], cancelled: true },
    }));
  }, [todayKey]);

  // Format the scheduled time as "8:00 PM"
  const formattedTime = useMemo(() => {
    if (!todaysPremierTime) return null;
    return new Date(todaysPremierTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [todaysPremierTime]);

  return {
    preferredChannel,
    typicalWatchHour,
    todaysPremierTime,
    premierState,
    pushOneHour,
    cancelToday,
    pushesRemaining,
    formattedTime,
  };
}
