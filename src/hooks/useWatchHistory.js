import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'sv_watch_history';
const PREFS_KEY = 'sv_preferences';

export function useWatchHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [preferences, setPreferences] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const addToHistory = useCallback((channelId, channelName, itemTitle, watchedSeconds = 0) => {
    const entry = {
      channelId,
      channelName,
      itemTitle,
      watchedSeconds,
      timestamp: Date.now(),
    };
    setHistory((prev) => {
      const filtered = prev.filter((h) => !(h.channelId === channelId && h.itemTitle === itemTitle));
      return [entry, ...filtered].slice(0, 20);
    });

    // Update preferences: increment watch count per category
    setPreferences((prev) => ({
      ...prev,
      [channelId]: (prev[channelId] || 0) + 1,
    }));
  }, []);

  const updateWatchTime = useCallback((channelId, additionalSeconds) => {
    setHistory((prev) =>
      prev.map((h) =>
        h.channelId === channelId && h.timestamp === prev.find((x) => x.channelId === channelId)?.timestamp
          ? { ...h, watchedSeconds: h.watchedSeconds + additionalSeconds }
          : h
      )
    );
  }, []);

  // Returns channel IDs sorted by preference score descending
  const getSortedChannels = useCallback(
    (channels) => {
      return [...channels].sort((a, b) => (preferences[b.id] || 0) - (preferences[a.id] || 0));
    },
    [preferences]
  );

  const getRecentlyWatched = useCallback(() => {
    return history.slice(0, 6);
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setPreferences({});
  }, []);

  return {
    history,
    preferences,
    addToHistory,
    updateWatchTime,
    getSortedChannels,
    getRecentlyWatched,
    clearHistory,
  };
}
