import React, { useRef, useMemo } from 'react';
import WatchPartyCard from './WatchPartyCard';
import { WATCH_PARTY_SCHEDULE } from '../data/premiers';
import { CHANNELS } from '../data/channels';

export default function GlobalPremiersRow({ onChannelClick }) {
  const rowRef = useRef(null);
  const today = new Date().getDay(); // 0 = Sunday

  // Show today's party first, then next 3 days
  const parties = useMemo(() =>
    [0, 1, 2, 3].map((offset) => {
      const dayIndex = (today + offset) % 7;
      return {
        ...WATCH_PARTY_SCHEDULE[dayIndex],
        daysOffset: offset,
        isToday: offset === 0,
      };
    }),
  [today]);

  const scroll = (dir) => {
    rowRef.current?.scrollBy({ left: dir * 640, behavior: 'smooth' });
  };

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 px-8 md:px-16">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌍</span>
          <h2 className="text-xl font-bold text-white">Global Watch Parties</h2>
        </div>
        <span className="px-2 py-0.5 bg-purple-700 text-white text-xs font-bold rounded uppercase tracking-wide">
          Events
        </span>
        <p className="text-gray-600 text-sm ml-1">— Watch together</p>
      </div>

      {/* Cards */}
      <div className="relative group">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ marginTop: '-20px' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div ref={rowRef} className="scroll-row px-8 md:px-16">
          {parties.map((party, i) => {
            const channel = CHANNELS.find((c) => c.id === party.channelId);
            return (
              <WatchPartyCard
                key={`party-${i}`}
                party={party}
                channel={channel}
                onJoin={onChannelClick}
                isToday={party.isToday}
              />
            );
          })}
        </div>

        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ marginTop: '-20px' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute left-0 top-0 bottom-0 w-14 bg-gradient-to-r from-brand-dark to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-brand-dark to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
