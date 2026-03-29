import React, { useState } from 'react';
import { useSchedule } from '../hooks/useSchedule';

export default function LiveChannelCard({ channel, onClick }) {
  const [hovered, setHovered] = useState(false);
  const { currentItem, progress, upcomingItems } = useSchedule(channel);

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer card-hover"
      style={{ width: '280px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(channel)}
    >
      <div className="relative rounded-xl overflow-hidden bg-gray-800 group">
        {/* Thumbnail */}
        <div className="relative" style={{ height: '158px' }}>
          <img
            src={channel.thumbnail}
            alt={channel.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Category gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${channel.color} opacity-40`} />
          <div className="absolute inset-0 channel-gradient" />

          {/* LIVE badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-red-600 rounded-md">
            <span className="w-2 h-2 bg-white rounded-full live-dot" />
            <span className="text-white text-xs font-bold uppercase tracking-wide">LIVE</span>
          </div>

          {/* Emoji */}
          <div className="absolute top-3 right-3 text-2xl">{channel.emoji}</div>

          {/* Channel name */}
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white font-bold text-base leading-tight">{channel.name}</p>
            <p className="text-gray-300 text-xs mt-0.5 truncate">
              {currentItem ? `Now: ${currentItem.title}` : 'Loading...'}
            </p>
          </div>

          {/* Hover play button */}
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 animate-fade-in">
              <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                <svg className="w-7 h-7 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-gray-700">
          <div
            className="h-full transition-all duration-1000"
            style={{
              width: `${progress}%`,
              backgroundColor: channel.accentColor,
            }}
          />
        </div>

        {/* Schedule info */}
        <div className="p-3 bg-gray-900">
          {currentItem && (
            <div className="flex items-start gap-2 mb-2">
              <div
                className="w-1 h-full rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: channel.accentColor, minHeight: '30px' }}
              />
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{currentItem.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{currentItem.genre}</p>
              </div>
            </div>
          )}
          {upcomingItems[0] && (
            <div className="flex items-center gap-2">
              <div className="w-1 rounded-full bg-gray-700 flex-shrink-0" style={{ minHeight: '24px' }} />
              <div className="min-w-0">
                <p className="text-gray-400 text-xs truncate">Up Next: {upcomingItems[0].title}</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom accent */}
        <div className={`h-0.5 bg-gradient-to-r ${channel.color}`} />
      </div>
    </div>
  );
}
