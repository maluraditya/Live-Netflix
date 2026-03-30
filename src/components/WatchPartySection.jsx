import React, { useState, useEffect } from 'react';
import { WATCH_PARTY_SCHEDULE } from '../data/premiers';
import { CHANNELS } from '../data/channels';
import { useViewerCount } from '../hooks/useViewerCount';
import { useSchedule } from '../hooks/useSchedule';

function PartyCountdown({ targetTime }) {
  const [diff, setDiff] = useState(() => targetTime - Date.now());
  useEffect(() => {
    const i = setInterval(() => setDiff(targetTime - Date.now()), 1000);
    return () => clearInterval(i);
  }, [targetTime]);

  if (diff <= 0) return <span className="text-red-400 font-semibold">Live now</span>;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h > 0) return <span className="tabular-nums text-gray-400">{h}h {String(m).padStart(2,'0')}m</span>;
  return <span className="tabular-nums text-yellow-400 font-semibold">{m}m</span>;
}

function FeaturedParty({ party, channel, isLive, partyTime, onJoin }) {
  const [reserved, setReserved] = useState(false);
  const viewers = useViewerCount(party.maxViewers);
  const { currentItem } = useSchedule(channel);
  const fillPct = Math.min((viewers / party.maxViewers) * 100, 100);

  const handleAction = () => {
    if (isLive) {
      onJoin(channel);
    } else {
      setReserved(true);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/8 card-lift"
      style={isLive ? { boxShadow: '0 0 24px rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.4)' } : {}}>

      {/* Background */}
      <div className="absolute inset-0">
        <img src={channel.thumbnail} alt="" className="w-full h-full object-cover scale-105"
          style={{ filter: 'blur(2px)', opacity: 0.3 }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40" />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 md:p-6">
        {/* Left: info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {isLive ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-600 rounded-md">
                <span className="w-1.5 h-1.5 bg-white rounded-full live-dot" />
                <span className="text-white text-xs font-bold">LIVE NOW</span>
              </div>
            ) : (
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-widest">
                Tonight's Watch Party
              </span>
            )}
            <span className="text-gray-700 text-xs">·</span>
            <span className="text-gray-500 text-xs">{channel.emoji} {channel.name}</span>
          </div>

          <h3 className="text-white font-bold text-lg leading-tight mb-1">{party.label}</h3>

          <p className="text-gray-400 text-sm mb-3">
            {currentItem
              ? isLive
                ? `Now playing: "${currentItem.title}"`
                : `"${currentItem.title}" will be live at ${partyTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : party.label}
          </p>

          {/* Viewer bar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <span className="tabular-nums font-medium">{viewers.toLocaleString()}</span>
              <span>watching</span>
            </div>
            <div className="flex-1 max-w-32 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full"
                style={{ width: `${fillPct}%`, backgroundColor: channel.accentColor, transition: 'width 3s ease' }} />
            </div>
          </div>
        </div>

        {/* Right: time + CTA */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-white font-bold tabular-nums">
              {partyTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-gray-600 text-xs mt-0.5">
              <PartyCountdown targetTime={partyTime.getTime()} />
            </p>
          </div>

          {reserved ? (
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-900/40 border border-green-500/30">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400 font-bold text-sm whitespace-nowrap">You're In</span>
            </div>
          ) : (
            <button onClick={handleAction}
              className="px-5 py-2.5 font-bold text-sm rounded-xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{
                backgroundColor: isLive ? '#ef4444' : channel.accentColor,
                color: isLive ? '#fff' : '#000',
              }}>
              {isLive ? '🎉 Join Party' : 'Reserve Spot'}
            </button>
          )}
        </div>
      </div>

      {/* Bottom accent */}
      <div className={`h-px bg-gradient-to-r ${channel.color} opacity-60`} />
    </div>
  );
}

export default function WatchPartySection({ onChannelClick }) {
  const today = new Date().getDay();
  const todayParty = WATCH_PARTY_SCHEDULE[today];
  const channel = CHANNELS.find((c) => c.id === todayParty.channelId);

  const partyTime = new Date();
  partyTime.setHours(todayParty.hour, 0, 0, 0);
  const isLive = Date.now() >= partyTime.getTime() && Date.now() < partyTime.getTime() + 2 * 3_600_000;

  // Upcoming days (next 3, compact chips)
  const upcomingParties = [1, 2, 3].map((offset) => {
    const dayIdx = (today + offset) % 7;
    const p = WATCH_PARTY_SCHEDULE[dayIdx];
    const c = CHANNELS.find((ch) => ch.id === p.channelId);
    const date = new Date();
    date.setDate(date.getDate() + offset);
    date.setHours(p.hour, 0, 0, 0);
    return { party: p, channel: c, date };
  });

  return (
    <div className="px-8 md:px-16 mb-10">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-base">🌍</span>
        <h2 className="text-base font-bold text-white">Global Watch Party</h2>
        {isLive && (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-600 rounded text-white text-xs font-bold">
            <span className="w-1.5 h-1.5 bg-white rounded-full live-dot" />LIVE
          </span>
        )}
      </div>

      {/* Featured today's party */}
      <FeaturedParty
        party={todayParty}
        channel={channel}
        isLive={isLive}
        partyTime={partyTime}
        onJoin={onChannelClick}
      />

      {/* Upcoming compact chips */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="text-gray-700 text-xs uppercase tracking-wider">Coming up:</span>
        {upcomingParties.map(({ party, channel: c, date }) => (
          <div key={party.channelId + date}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card text-xs text-gray-400 whitespace-nowrap">
            <span>{c?.emoji}</span>
            <span className="font-medium text-gray-300">{party.label.split(' ').slice(1).join(' ')}</span>
            <span className="text-gray-600">·</span>
            <span className="tabular-nums">{date.toLocaleDateString([], { weekday: 'short' })} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
