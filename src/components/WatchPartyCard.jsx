import React, { useState, useEffect } from 'react';
import { useViewerCount } from '../hooks/useViewerCount';
import { useSchedule } from '../hooks/useSchedule';
import { generateLiveTeaser } from '../data/premiers';

function PartyCountdown({ targetTime, isToday }) {
  const [diff, setDiff] = useState(() => targetTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => setDiff(targetTime - Date.now()), 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  if (!isToday) {
    const daysAway = Math.ceil(diff / 86_400_000);
    return <span className="text-gray-500">in {daysAway} day{daysAway > 1 ? 's' : ''}</span>;
  }

  if (diff <= 0) return <span className="text-red-400 font-semibold">Live now</span>;

  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);

  if (h > 0) return <span className="text-gray-400">in {h}h {m}m</span>;
  if (m > 2) return <span className="text-yellow-400 font-semibold">in {m}m</span>;
  return <span className="text-red-400 font-bold animate-pulse">Starting now</span>;
}

export default function WatchPartyCard({ party, channel, onJoin, isToday }) {
  const viewerCount = useViewerCount(party.maxViewers);
  const { currentItem, elapsed } = useSchedule(channel);

  if (!channel || !party) return null;

  // Party time = today (or the day it falls on) at party.hour
  const partyTime = new Date();
  if (!isToday) {
    // Advance to the correct future day — caller passes the right party already
    partyTime.setDate(partyTime.getDate() + (party.daysOffset || 0));
  }
  partyTime.setHours(party.hour, 0, 0, 0);

  const now = Date.now();
  const isLive = isToday && now >= partyTime.getTime() && now < partyTime.getTime() + 2 * 3_600_000;
  const fillPct = Math.min((viewerCount / party.maxViewers) * 100, 100);

  const teaser = currentItem
    ? generateLiveTeaser(channel, currentItem, elapsed, null)
    : `Live on ${channel.name}`;

  const timeLabel = partyTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex-shrink-0" style={{ width: '300px' }}>
      <div
        className="relative rounded-2xl overflow-hidden border flex flex-col h-full transition-all duration-300"
        style={{
          borderColor: isLive ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)',
          background: '#161616',
          boxShadow: isLive ? '0 0 20px rgba(239,68,68,0.12)' : 'none',
        }}
      >
        {/* Thumbnail */}
        <div className="relative" style={{ height: '145px' }}>
          <img
            src={channel.thumbnail}
            alt={channel.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${channel.color} opacity-50`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />

          {/* Status badge */}
          <div className="absolute top-3 left-3">
            {isLive ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600 rounded-lg shadow-lg">
                <span className="w-1.5 h-1.5 bg-white rounded-full live-dot" />
                <span className="text-white text-xs font-bold tracking-wide">LIVE PARTY</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 rounded-lg backdrop-blur-sm">
                <span className="text-white text-xs font-semibold">{timeLabel}</span>
                {isToday && <span className="text-gray-400 text-xs">tonight</span>}
              </div>
            )}
          </div>

          <div className="absolute top-3 right-3 text-2xl">{channel.emoji}</div>

          {/* Viewer bar at bottom of thumbnail */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white text-xs font-semibold truncate pr-2">{party.label}</span>
              <span className="text-gray-300 text-xs flex-shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                {viewerCount.toLocaleString()}
              </span>
            </div>
            <div className="h-1 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${fillPct}%`,
                  backgroundColor: channel.accentColor,
                  transition: 'width 3s ease-in-out',
                }}
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1">
            {isLive
              ? teaser
              : `${viewerCount.toLocaleString()} people are tuning in ${isToday ? 'tonight' : 'for this'}. ${teaser}`}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onJoin(channel)}
              className="flex-1 py-2.5 font-bold text-sm rounded-xl transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: isLive ? '#ef4444' : channel.accentColor,
                color: isLive ? '#fff' : '#000',
              }}
            >
              {isLive ? '🎉 Join the Party' : 'Reserve Spot'}
            </button>
            <span className="text-xs text-gray-600 flex-shrink-0">
              <PartyCountdown targetTime={partyTime.getTime()} isToday={isToday} />
            </span>
          </div>
        </div>

        {/* Bottom accent */}
        <div className={`h-0.5 bg-gradient-to-r ${channel.color}`} />
      </div>
    </div>
  );
}
