import { useMemo, useState, useEffect } from 'react';

/**
 * Computes a deterministic schedule for a channel based on the current time.
 * The schedule is anchored to midnight so it remains consistent across refreshes.
 */
export function useSchedule(channel) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const schedule = useMemo(() => {
    if (!channel) return [];
    const playlist = channel.playlist;
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    const secondsSinceMidnight = (Date.now() - midnight.getTime()) / 1000;

    // Build a full day schedule by repeating the playlist
    const items = [];
    let cursor = 0;
    let playlistIndex = 0;

    while (cursor < 86400) {
      const video = playlist[playlistIndex % playlist.length];
      items.push({
        ...video,
        startTime: cursor,
        endTime: cursor + video.duration,
        playlistIndex: playlistIndex % playlist.length,
      });
      cursor += video.duration;
      playlistIndex++;
    }

    return items;
  }, [channel]);

  const currentItem = useMemo(() => {
    if (!schedule.length) return null;
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    const secondsSinceMidnight = (now - midnight.getTime()) / 1000;
    return schedule.find(
      (item) => secondsSinceMidnight >= item.startTime && secondsSinceMidnight < item.endTime
    ) || schedule[0];
  }, [schedule, now]);

  const currentIndex = useMemo(() => {
    if (!currentItem) return 0;
    return schedule.indexOf(currentItem);
  }, [schedule, currentItem]);

  const elapsed = useMemo(() => {
    if (!currentItem) return 0;
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    const secondsSinceMidnight = (now - midnight.getTime()) / 1000;
    return secondsSinceMidnight - currentItem.startTime;
  }, [currentItem, now]);

  const progress = useMemo(() => {
    if (!currentItem) return 0;
    return Math.min((elapsed / currentItem.duration) * 100, 100);
  }, [elapsed, currentItem]);

  // Next 5 items starting from current
  const upcomingItems = useMemo(() => {
    if (!schedule.length || currentIndex === -1) return [];
    const start = currentIndex + 1;
    return schedule.slice(start, start + 5);
  }, [schedule, currentIndex]);

  // Format seconds-since-midnight to HH:MM
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
  };

  // Recent schedule (previous 2 + current + upcoming 5)
  const visibleSchedule = useMemo(() => {
    if (!schedule.length || currentIndex === -1) return [];
    const start = Math.max(0, currentIndex - 2);
    return schedule.slice(start, currentIndex + 6).map((item) => ({
      ...item,
      formattedStart: formatTime(item.startTime),
      isCurrent: item === currentItem,
    }));
  }, [schedule, currentIndex, currentItem]);

  return {
    currentItem,
    elapsed,
    progress,
    upcomingItems,
    visibleSchedule,
    formatTime,
    now,
  };
}

/**
 * Returns the video URL and seek offset for the current moment.
 */
export function useCurrentVideo(channel) {
  const { currentItem, elapsed } = useSchedule(channel);

  return {
    videoUrl: currentItem?.videoUrl || null,
    seekTo: Math.floor(elapsed),
    currentItem,
  };
}
