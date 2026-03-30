// Weekly global watch party schedule — one prime-time event per day
// hour is 24h local time
export const WATCH_PARTY_SCHEDULE = [
  { channelId: 'comedy',      label: 'Sunday Comedy Night',      hour: 20, maxViewers: 1200 },
  { channelId: 'action',      label: 'Monday Adrenaline Rush',   hour: 21, maxViewers: 950  },
  { channelId: 'romance',     label: 'Tuesday Love Night',       hour: 20, maxViewers: 820  },
  { channelId: 'thriller',    label: 'Wednesday Dark Suspense',  hour: 21, maxViewers: 1100 },
  { channelId: 'documentary', label: 'Thursday Discovery Night', hour: 20, maxViewers: 700  },
  { channelId: 'scifi',       label: 'Friday Sci-Fi Night',      hour: 21, maxViewers: 1060 },
  { channelId: 'action',      label: 'Saturday Action Pack',     hour: 20, maxViewers: 1400 },
];

/**
 * Generates a warm, live-focused teaser line for the personal premier card.
 * Wired to actual live channel progress — pushes joining over browsing.
 */
export function generateLiveTeaser(channel, currentItem, elapsed, userName) {
  const minutesIn = Math.floor(elapsed / 60);
  const minutesLeft = Math.floor((currentItem.duration - elapsed) / 60);
  const progress = (elapsed / currentItem.duration) * 100;
  const name = userName ? `, ${userName}` : '';

  if (progress < 5) {
    return `"${currentItem.title}" just started on ${channel.name}${name}. Perfect time to jump in.`;
  }
  if (progress < 25) {
    return `${minutesIn} mins in and it's already picking up${name}. Still early — join the stream.`;
  }
  if (progress < 55) {
    return `Right in the middle of "${currentItem.title}"${name}. ${minutesLeft} mins left — worth joining.`;
  }
  if (progress < 80) {
    return `${minutesLeft} mins left of "${currentItem.title}"${name}, then something new drops. Catch the ending.`;
  }
  return `"${currentItem.title}" wraps in ${minutesLeft} mins${name}. A new title starts on ${channel.name} after.`;
}

/**
 * Empathetic subtitle for the upcoming premier card — tone shifts with time of day.
 */
export function getPremierSubtitle(period, channelName, userName) {
  const name = userName ? `, ${userName}` : '';
  const lines = {
    morning:   `Your ${channelName} is warmed up${name}. Something short before the day starts?`,
    afternoon: `${channelName} is running live${name}. A quick 15-minute break?`,
    evening:   `We've held your spot on ${channelName} for tonight${name}. Ready when you are.`,
    night:     `${channelName} is live and waiting${name}. Tonight's lineup is good.`,
    latenight: `Still up${name}? ${channelName} has something running right now.`,
  };
  return lines[period] || `${channelName} is live${name}.`;
}

/**
 * Short copy for the "Just Play" tooltip — one line, time-aware.
 */
export function getJustPlayCaption(period, channelName) {
  const lines = {
    morning:   `A light one to start the day — ${channelName}`,
    afternoon: `Quick watch — ${channelName} is mid-stream`,
    evening:   `Your evening pick — ${channelName} is live`,
    night:     `Something for the night — ${channelName}`,
    latenight: `Late night — ${channelName} is still running`,
  };
  return lines[period] || `${channelName} is live now`;
}
