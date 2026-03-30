// Platform's weekly editorial premier pick — same content for everyone,
// but the time it fires adapts to when the individual user usually watches.
export const DAILY_PREMIERS = [
  {
    day: 0, // Sunday
    channelId: 'comedy',
    featuredVideoId: 'YE7VzlLtp-4',
    featuredTitle: 'Big Buck Bunny',
    teaser: 'A bunny, three squirrels, and a meadow that turns into a war zone.',
    hook: 'Sunday is for laughing. We picked the right one.',
  },
  {
    day: 1, // Monday
    channelId: 'action',
    featuredVideoId: 'R6MlUcmOul8',
    featuredTitle: 'Tears of Steel',
    teaser: 'A team of rebels. An AI that could end everything. One last shot.',
    hook: 'Start the week the right way — something that moves.',
  },
  {
    day: 2, // Tuesday
    channelId: 'romance',
    featuredVideoId: 'eRsGyueVLvQ',
    featuredTitle: 'Sintel',
    teaser: 'A journey across the world for someone worth finding.',
    hook: 'Tuesday evenings are made for this kind of story.',
  },
  {
    day: 3, // Wednesday
    channelId: 'thriller',
    featuredVideoId: 'Y-rmzh0PI3c',
    featuredTitle: 'Cosmos Laundromat',
    teaser: "You think you know what's real. You don't.",
    hook: 'Midweek calls for something that makes you think.',
  },
  {
    day: 4, // Thursday
    channelId: 'documentary',
    featuredVideoId: '_9LX9HSU9NM',
    featuredTitle: "Elephant's Dream",
    teaser: 'The world inside the machine. Not what you expect.',
    hook: 'Almost the weekend — unwind with something different.',
  },
  {
    day: 5, // Friday
    channelId: 'scifi',
    featuredVideoId: 'R6MlUcmOul8',
    featuredTitle: 'Tears of Steel',
    teaser: 'In a city without memory, the past is the only weapon.',
    hook: 'Friday night deserves a full cinematic experience.',
  },
  {
    day: 6, // Saturday
    channelId: 'comedy',
    featuredVideoId: 'pz6HbPiaN0E',
    featuredTitle: 'Sprite Fright',
    teaser: 'A camping trip goes terribly, wonderfully wrong.',
    hook: 'Saturday is yours. Start it with something fun.',
  },
];

export function getTodaysPremier() {
  const day = new Date().getDay();
  return DAILY_PREMIERS[day];
}

// Weekly global watch party schedule
export const WATCH_PARTY_SCHEDULE = [
  { channelId: 'comedy',      label: 'Sunday Comedy Night',      hour: 20, maxViewers: 1200 },
  { channelId: 'action',      label: 'Monday Adrenaline Rush',   hour: 21, maxViewers: 950  },
  { channelId: 'romance',     label: 'Tuesday Love Night',       hour: 20, maxViewers: 820  },
  { channelId: 'thriller',    label: 'Wednesday Dark Suspense',  hour: 21, maxViewers: 1100 },
  { channelId: 'documentary', label: 'Thursday Discovery Night', hour: 20, maxViewers: 700  },
  { channelId: 'scifi',       label: 'Friday Sci-Fi Night',      hour: 21, maxViewers: 1060 },
  { channelId: 'action',      label: 'Saturday Action Pack',     hour: 20, maxViewers: 1400 },
];

// Teaser copy based on live progress — fixes "0 mins" by handling that case explicitly
export function generateLiveTeaser(channel, currentItem, elapsed, userName) {
  const minutesIn   = Math.floor(elapsed / 60);
  const minutesLeft = Math.floor((currentItem.duration - elapsed) / 60);
  const progress    = (elapsed / currentItem.duration) * 100;
  const name        = userName ? `, ${userName}` : '';

  if (progress < 3) {
    return `"${currentItem.title}" just kicked off on ${channel.name}${name}. Jump in from the beginning.`;
  }
  if (progress < 25) {
    return `${minutesIn} min${minutesIn === 1 ? '' : 's'} in and it's already picking up${name}. Still early — join the stream.`;
  }
  if (progress < 55) {
    return `Halfway through "${currentItem.title}"${name}. ${minutesLeft} mins left — still worth it.`;
  }
  if (progress < 80) {
    return `${minutesLeft} mins left of "${currentItem.title}"${name}. Catch the ending — then something new starts.`;
  }
  return `"${currentItem.title}" wraps in ${minutesLeft} min${minutesLeft === 1 ? '' : 's'}${name}. New title up next on ${channel.name}.`;
}

export function getJustPlayCaption(period, channelName) {
  return {
    morning:   `A light one to start — ${channelName}`,
    afternoon: `Quick watch — ${channelName} is mid-stream`,
    evening:   `Your evening pick — ${channelName} is live`,
    night:     `Something for the night — ${channelName}`,
    latenight: `Late night — ${channelName} is still running`,
  }[period] || `${channelName} is live now`;
}
