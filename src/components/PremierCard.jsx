import React, { useState, useEffect } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import { useTimeContext } from '../hooks/useTimeContext';
import { generateLiveTeaser, getPremierSubtitle } from '../data/premiers';

function Countdown({ targetTime }) {
  const [diff, setDiff] = useState(() => targetTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => setDiff(targetTime - Date.now()), 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  if (diff <= 0) return <span className="text-red-400 font-semibold">Live now</span>;

  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);

  if (h > 0)   return <span>{h}h {m}m away</span>;
  if (m > 5)   return <span>{m}m away</span>;
  return <span className="text-yellow-400 font-semibold animate-pulse">{m}m {s}s — get ready</span>;
}

export default function PremierCard({
  channel,
  userName,
  premierState,
  todaysPremierTime,
  formattedTime,
  pushOneHour,
  cancelToday,
  pushesRemaining,
  onJoin,
}) {
  const { currentItem, elapsed, progress } = useSchedule(channel);
  const { period } = useTimeContext();
  const [localDismissed, setLocalDismissed] = useState(false);

  if (
    !channel ||
    !currentItem ||
    premierState === 'cancelled' ||
    premierState === 'expired' ||
    localDismissed
  ) return null;

  const isLive       = premierState === 'live';
  const isApproaching = premierState === 'approaching';

  const bodyText = isLive
    ? generateLiveTeaser(channel, currentItem, elapsed, userName)
    : getPremierSubtitle(period, channel.name, userName);

  const borderColor = isLive
    ? 'rgba(239,68,68,0.5)'
    : isApproaching
    ? 'rgba(234,179,8,0.4)'
    : 'rgba(255,255,255,0.08)';

  const topBarClass = isLive
    ? 'bg-red-500'
    : isApproaching
    ? 'bg-yellow-500'
    : `bg-gradient-to-r ${channel.color}`;

  const labelText = isLive
    ? '🔴 Your Premier is Live'
    : isApproaching
    ? '⏰ Starting Soon'
    : '🔔 Your Premier Tonight';

  const labelColor = isLive ? '#ef4444' : isApproaching ? '#eab308' : channel.accentColor;

  return (
    <div className="px-8 md:px-16 mb-6">
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-500"
        style={{
          border: `1px solid ${borderColor}`,
          boxShadow: isLive ? '0 0 24px rgba(239,68,68,0.15)' : isApproaching ? '0 0 16px rgba(234,179,8,0.1)' : 'none',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)',
        }}
      >
        {/* Top accent bar */}
        <div className={`h-0.5 w-full ${topBarClass} ${isLive ? 'live-dot' : ''}`} />

        <div className="flex items-center gap-4 p-4 md:p-5">
          {/* Thumbnail with live progress */}
          <div
            className="relative flex-shrink-0 rounded-xl overflow-hidden"
            style={{ width: '96px', height: '54px' }}
          >
            <img
              src={channel.thumbnail}
              alt={channel.name}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${channel.color} opacity-40`} />

            {isLive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Live progress strip */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/40">
              <div
                className="h-full transition-all duration-1000"
                style={{ width: `${progress}%`, backgroundColor: channel.accentColor }}
              />
            </div>
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: labelColor }}>
                {labelText}
              </span>
              <span className="text-gray-700 text-xs">·</span>
              <span className="text-gray-500 text-xs">{channel.name} {channel.emoji}</span>
            </div>

            <p className="text-white text-sm font-medium leading-snug mb-1">
              {bodyText}
            </p>

            {!isLive && todaysPremierTime && (
              <p className="text-gray-600 text-xs">
                {currentItem.title} · Scheduled {formattedTime} ·{' '}
                <Countdown targetTime={todaysPremierTime} />
              </p>
            )}

            {isLive && (
              <p className="text-gray-600 text-xs">
                {currentItem.title} · {currentItem.genre}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isLive ? (
              <button
                onClick={() => onJoin(channel)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors text-sm whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full live-dot" />
                Join Now
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onJoin(channel)}
                  className="px-4 py-2.5 font-bold rounded-lg text-sm whitespace-nowrap text-black transition-opacity hover:opacity-90"
                  style={{ backgroundColor: channel.accentColor }}
                >
                  Watch Live
                </button>

                {pushesRemaining > 0 && (
                  <button
                    onClick={pushOneHour}
                    title={`${pushesRemaining} push${pushesRemaining === 1 ? '' : 'es'} remaining`}
                    className="px-3 py-2.5 bg-white/8 hover:bg-white/12 border border-white/10 text-gray-400 hover:text-white text-xs rounded-lg transition-colors whitespace-nowrap"
                  >
                    Push 1hr ›
                  </button>
                )}

                {pushesRemaining === 0 && (
                  <span className="text-gray-700 text-xs px-2">Max pushes reached</span>
                )}
              </div>
            )}

            {/* Dismiss / Not tonight */}
            <button
              onClick={isLive ? () => setLocalDismissed(true) : cancelToday}
              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-gray-400 transition-colors"
              title={isLive ? 'Dismiss' : 'Not tonight'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
