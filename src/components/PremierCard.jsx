import React, { useState, useEffect } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import { useTimeContext } from '../hooks/useTimeContext';
import { generateLiveTeaser } from '../data/premiers';

function Countdown({ targetTime }) {
  const [diff, setDiff] = useState(() => targetTime - Date.now());
  useEffect(() => {
    const i = setInterval(() => setDiff(targetTime - Date.now()), 1000);
    return () => clearInterval(i);
  }, [targetTime]);

  if (diff <= 0) return <span className="text-red-400 font-semibold">Live now</span>;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);

  if (h > 0) return <span className="tabular-nums">{h}h {String(m).padStart(2,'0')}m away</span>;
  if (m > 5) return <span className="tabular-nums">{m}m away</span>;
  return (
    <span className="text-yellow-400 font-semibold tabular-nums animate-pulse">
      {m}:{String(s).padStart(2,'0')} — get ready
    </span>
  );
}

export default function PremierCard({
  channel, editorial, userName,
  premierState, todaysPremierTime, formattedTime,
  pushOneHour, cancelToday, pushesRemaining,
  onJoin,
}) {
  const { currentItem, elapsed, progress } = useSchedule(channel);
  const { period } = useTimeContext();
  const [dismissed, setDismissed] = useState(false);

  if (!channel || !currentItem || premierState === 'cancelled' || premierState === 'expired' || dismissed) {
    return null;
  }

  const isLive       = premierState === 'live';
  const isApproaching = premierState === 'approaching';

  // Background — blurred YouTube thumbnail of what's currently on the channel
  const bgThumb = `https://img.youtube.com/vi/${currentItem.videoId}/hqdefault.jpg`;

  // Copy
  const headlineTag = isLive ? '🔴 YOUR PREMIER IS LIVE'
    : isApproaching  ? '⏰ STARTING SOON'
    : '🔔 YOUR PREMIER TONIGHT';

  const bodyText = isLive
    ? generateLiveTeaser(channel, currentItem, elapsed, userName)
    : editorial
    ? `${editorial.teaser}`
    : `${channel.name} is your premier tonight${userName ? `, ${userName}` : ''}.`;

  const hookText = !isLive && editorial?.hook;

  // Border + glow styling
  const glowStyle = isLive
    ? { border: '1px solid rgba(239,68,68,0.6)', boxShadow: '0 0 0 1px rgba(239,68,68,0.15), 0 8px 32px rgba(239,68,68,0.2)' }
    : isApproaching
    ? { border: '1px solid rgba(234,179,8,0.5)', boxShadow: '0 0 0 1px rgba(234,179,8,0.1), 0 8px 32px rgba(234,179,8,0.12)' }
    : { border: '1px solid rgba(255,255,255,0.08)' };

  const accentColor = isLive ? '#ef4444' : isApproaching ? '#eab308' : channel.accentColor;

  return (
    <div className="px-8 md:px-16 mb-8">
      <div className="relative overflow-hidden rounded-2xl" style={glowStyle}>

        {/* Blurred cinematic background */}
        <div className="absolute inset-0">
          <img
            src={bgThumb}
            alt=""
            className="w-full h-full object-cover scale-110"
            style={{ filter: 'blur(28px)', opacity: 0.35 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60" />
        </div>

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }} />

        {/* Card content */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-5 p-6">

          {/* Thumbnail preview */}
          <div className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-2xl"
            style={{ width: '120px', height: '68px' }}>
            <img src={bgThumb} alt={currentItem.title} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-br ${channel.color} opacity-30`} />
            {isLive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
            {/* Live progress strip */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/40">
              <div className="h-full transition-all duration-1000"
                style={{ width: `${progress}%`, backgroundColor: accentColor }} />
            </div>
          </div>

          {/* Text block */}
          <div className="flex-1 min-w-0">
            {/* Label row */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-widest"
                style={{ color: accentColor }}>{headlineTag}</span>
              <span className="text-gray-700">·</span>
              <span className="text-gray-400 text-xs font-medium">{channel.emoji} {channel.name}</span>
            </div>

            {/* Featured title */}
            {!isLive && editorial && (
              <p className="text-white font-bold text-base md:text-lg leading-tight mb-1">
                {editorial.featuredTitle}
              </p>
            )}

            {/* Teaser / body */}
            <p className="text-gray-300 text-sm leading-relaxed mb-1.5">
              {bodyText}
            </p>

            {/* Hook or schedule info */}
            {hookText && (
              <p className="text-gray-600 text-xs italic">{hookText}</p>
            )}
            {!isLive && todaysPremierTime && (
              <p className="text-gray-600 text-xs mt-1 flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Scheduled {formattedTime} ·{' '}
                <Countdown targetTime={todaysPremierTime} />
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            {isLive ? (
              <button onClick={() => onJoin(channel)}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-lg">
                <span className="w-1.5 h-1.5 bg-white rounded-full live-dot" />
                Join Now
              </button>
            ) : (
              <>
                <button onClick={() => onJoin(channel)}
                  className="px-5 py-2.5 font-bold rounded-xl text-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap text-black shadow-md"
                  style={{ backgroundColor: channel.accentColor }}>
                  Watch Live
                </button>
                {pushesRemaining > 0 && (
                  <button onClick={pushOneHour}
                    title={`${pushesRemaining} push${pushesRemaining === 1 ? '' : 'es'} left`}
                    className="px-3 py-2.5 glass-card text-gray-400 hover:text-white text-xs rounded-xl transition-all whitespace-nowrap">
                    Push 1hr ›
                  </button>
                )}
              </>
            )}
            <button
              onClick={isLive ? () => setDismissed(true) : cancelToday}
              title={isLive ? 'Dismiss' : 'Not tonight'}
              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-gray-300 transition-colors rounded-lg hover:bg-white/8">
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
