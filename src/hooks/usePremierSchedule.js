import { useState, useEffect, useMemo, useCallback } from 'react';
import { getTodaysPremier } from '../data/premiers';
import { CHANNELS } from '../data/channels';

const PREMIER_KEY = 'sv_premiers';
const MAX_PUSHES  = 3;

// Smart default: pick the next prime-time hour that hasn't passed yet.
function smartDefaultHour() {
  const h = new Date().getHours();
  if (h < 18) return 20;   // 8 PM tonight
  if (h < 20) return 21;   // 9 PM tonight
  if (h < 21) return 22;   // 10 PM tonight
  return 20;               // tomorrow at 8 PM (push-to-tomorrow logic handles this)
}

export function usePremierSchedule(preferences, history) {
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

  // Platform picks today's editorial content
  const editorial = useMemo(() => getTodaysPremier(), []);

  // The channel the premier fires on (platform-curated)
  const premierChannel = useMemo(
    () => CHANNELS.find((c) => c.id === editorial.channelId) || CHANNELS[0],
    [editorial]
  );

  // User's typical watch hour — derived from history timestamps.
  // Falls back to a smart future default so we never immediately show "live".
  const typicalWatchHour = useMemo(() => {
    if (!history || history.length < 3) return smartDefaultHour();

    const hours  = history.map((h) => new Date(h.timestamp).getHours());
    const counts = hours.reduce((acc, h) => { acc[h] = (acc[h] || 0) + 1; return acc; }, {});
    const best   = parseInt(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0], 10);

    // If their typical hour has already passed by > 2h today, use smart default instead
    const todayAtBest = new Date();
    todayAtBest.setHours(best, 0, 0, 0);
    if (Date.now() > todayAtBest.getTime() + 2 * 3_600_000) return smartDefaultHour();

    return best;
  }, [history]);

  const todayKey = new Date().toDateString();

  // Compute the scheduled premier timestamp (never stuck in the past)
  const todaysPremierTime = useMemo(() => {
    const saved = premierData[todayKey];
    if (saved?.cancelled) return null;

    let baseTime;
    if (saved?.pushedTime) {
      baseTime = saved.pushedTime;
    } else {
      const base = new Date();
      base.setHours(typicalWatchHour, 0, 0, 0);
      baseTime = base.getTime();
    }

    // If the time is more than 2 hours in the past, push to tomorrow
    if (Date.now() > baseTime + 2 * 3_600_000) {
      const tomorrow = new Date(baseTime);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.getTime();
    }

    return baseTime;
  }, [typicalWatchHour, premierData, todayKey, tick]);

  // Three-state machine
  const premierState = useMemo(() => {
    if (!todaysPremierTime) return 'cancelled';
    const diff = todaysPremierTime - Date.now();
    if (diff > 15 * 60_000)       return 'upcoming';    // > 15 min away
    if (diff > 0)                 return 'approaching'; // ≤ 15 min, not yet
    if (diff > -2 * 3_600_000)   return 'live';         // within 2h window
    return 'expired';
  }, [todaysPremierTime, tick]);

  const pushesUsed      = premierData[todayKey]?.pushCount || 0;
  const pushesRemaining = MAX_PUSHES - pushesUsed;

  const pushOneHour = useCallback(() => {
    setPremierData((prev) => {
      const cur = prev[todayKey] || {};
      if ((cur.pushCount || 0) >= MAX_PUSHES) return prev;

      const current = cur.pushedTime ?? (() => {
        const b = new Date();
        b.setHours(typicalWatchHour, 0, 0, 0);
        return b.getTime();
      })();

      return {
        ...prev,
        [todayKey]: { ...cur, pushedTime: current + 3_600_000, pushCount: (cur.pushCount || 0) + 1 },
      };
    });
  }, [todayKey, typicalWatchHour]);

  const cancelToday = useCallback(() => {
    setPremierData((prev) => ({
      ...prev,
      [todayKey]: { ...prev[todayKey], cancelled: true },
    }));
  }, [todayKey]);

  const formattedTime = useMemo(() => {
    if (!todaysPremierTime) return null;
    return new Date(todaysPremierTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [todaysPremierTime]);

  return {
    premierChannel,
    editorial,
    typicalWatchHour,
    todaysPremierTime,
    premierState,
    pushOneHour,
    cancelToday,
    pushesRemaining,
    formattedTime,
  };
}
