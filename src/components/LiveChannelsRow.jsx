import React, { useRef } from 'react';
import LiveChannelCard from './LiveChannelCard';
import { CHANNELS } from '../data/channels';

export default function LiveChannelsRow({ onChannelClick, sortedChannels }) {
  const rowRef = useRef(null);
  const channels = sortedChannels || CHANNELS;

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 600, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-12">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6 px-8 md:px-16">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full live-dot" />
          <h2 className="text-xl font-bold text-white">Live Channels</h2>
        </div>
        <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded uppercase tracking-wide">
          Live Now
        </span>
        <p className="text-gray-500 text-sm ml-1">— Always something playing</p>
        <button
          onClick={() => onChannelClick && onChannelClick(null)}
          className="text-red-500 text-sm font-medium hover:text-red-400 ml-auto flex items-center gap-1"
        >
          All Channels
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Cards scroll */}
      <div className="relative group">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
          style={{ marginTop: '-30px' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div ref={rowRef} className="scroll-row px-8 md:px-16">
          {channels.map((channel) => (
            <LiveChannelCard
              key={channel.id}
              channel={channel}
              onClick={onChannelClick}
            />
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
          style={{ marginTop: '-30px' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-brand-dark to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-brand-dark to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
