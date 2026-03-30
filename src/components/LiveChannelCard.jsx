import React, { useState } from 'react';
import { useSchedule } from '../hooks/useSchedule';

export default function LiveChannelCard({ channel, onClick }) {
  const [hovered, setHovered] = useState(false);
  const { currentItem, progress, upcomingItems } = useSchedule(channel);

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer card-hover"
      style={{ width: '260px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(channel)}
    >
      <div className="rounded-2xl overflow-hidden"
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Thumbnail */}
        <div className="relative" style={{ height: '146px' }}>
          <img
            src={channel.thumbnail}
            alt={channel.name}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
            loading="lazy"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${channel.color} opacity-35 transition-opacity duration-300`}
            style={{ opacity: hovered ? 0.5 : 0.35 }} />
          <div className="absolute inset-0 channel-gradient" />

          {/* LIVE badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-red-600 rounded-lg shadow-lg">
            <span className="w-1.5 h-1.5 bg-white rounded-full live-dot" />
            <span className="text-white text-xs font-bold tracking-wide">LIVE</span>
          </div>

          <div className="absolute top-3 right-3 text-xl">{channel.emoji}</div>

          {/* Play button on hover */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-2xl">
              <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Channel name at bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
            <p className="text-white font-bold text-sm leading-tight">{channel.name}</p>
            <p className="text-gray-400 text-xs mt-0.5 truncate">
              {currentItem ? currentItem.title : 'Loading…'}
            </p>
          </div>
        </div>

        {/* Live progress bar */}
        <div className="h-0.5 bg-white/8">
          <div className="h-full transition-all duration-1000"
            style={{ width: `${progress}%`, backgroundColor: channel.accentColor }} />
        </div>

        {/* Schedule preview */}
        <div className="px-3 py-2.5 space-y-1.5">
          {currentItem && (
            <div className="flex items-center gap-2">
              <div className="w-1 rounded-full flex-shrink-0 self-stretch"
                style={{ backgroundColor: channel.accentColor, minHeight: '12px' }} />
              <div className="min-w-0">
                <p className="text-white text-xs font-medium truncate">{currentItem.title}</p>
                <p className="text-gray-600 text-xs">{currentItem.genre}</p>
              </div>
            </div>
          )}
          {upcomingItems[0] && (
            <div className="flex items-center gap-2">
              <div className="w-1 rounded-full bg-white/15 flex-shrink-0 self-stretch" style={{ minHeight: '12px' }} />
              <p className="text-gray-500 text-xs truncate">Next: {upcomingItems[0].title}</p>
            </div>
          )}
        </div>

        {/* Bottom accent */}
        <div className={`h-px bg-gradient-to-r ${channel.color} opacity-50`} />
      </div>
    </div>
  );
}
