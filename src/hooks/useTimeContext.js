import { useState, useEffect, useMemo } from 'react';

export function useTimeContext() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const hour = now.getHours();

  const period = useMemo(() => {
    if (hour >= 5  && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    if (hour >= 21 && hour < 24) return 'night';
    return 'latenight';
  }, [hour]);

  const greeting = useMemo(() => ({
    morning:   'Good morning',
    afternoon: 'Good afternoon',
    evening:   'Good evening',
    night:     'Good night',
    latenight: 'Still up',
  }[period]), [period]);

  const subtitle = useMemo(() => ({
    morning:   'Something light before the day starts?',
    afternoon: 'A quick watch during your break?',
    evening:   'Your channels are ready for tonight.',
    night:     "Tonight's picks are lined up.",
    latenight: "Can't sleep? We've got you covered.",
  }[period]), [period]);

  const moodLabel = useMemo(() => ({
    morning:   '☀️ Morning Pick',
    afternoon: '🌤 Afternoon Vibe',
    evening:   '🌆 Evening Watch',
    night:     '🌙 Night Mode',
    latenight: '⭐ Late Night',
  }[period]), [period]);

  // Channel IDs ordered by suitability for this time of day
  const recommendedChannelIds = useMemo(() => ({
    morning:   ['documentary', 'comedy', 'romance'],
    afternoon: ['comedy', 'romance', 'documentary'],
    evening:   ['action', 'thriller', 'scifi', 'romance'],
    night:     ['thriller', 'scifi', 'action'],
    latenight: ['thriller', 'scifi', 'documentary'],
  }[period]), [period]);

  return { period, greeting, subtitle, moodLabel, recommendedChannelIds, hour, now };
}
