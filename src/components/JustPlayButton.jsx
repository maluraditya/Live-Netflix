import React, { useState, useMemo } from 'react';
import { CHANNELS } from '../data/channels';
import { useTimeContext } from '../hooks/useTimeContext';
import { useSchedule } from '../hooks/useSchedule';
import { getJustPlayCaption } from '../data/premiers';

// Small inner component so each channel's schedule can be read
function BestChannelPreview({ channel, period }) {
  const { currentItem, progress } = useSchedule(channel);
  const caption = getJustPlayCaption(period, channel.name);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{channel.emoji}</span>
        <div className="min-w-0">
          <p className="text-white text-sm font-bold leading-tight truncate">{channel.name}</p>
          <p className="text-gray-500 text-xs truncate">{currentItem?.title}</p>
        </div>
      </div>

      {/* Live progress */}
      <div className="h-0.5 bg-white/10 rounded-full mb-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-white/40 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-gray-500 text-xs leading-snug">{caption}</p>
    </div>
  );
}

export default function JustPlayButton({ onPlay, preferences }) {
  const [expanded, setExpanded] = useState(false);
  const { recommendedChannelIds, moodLabel, period } = useTimeContext();

  // Pick best channel: time-of-day genre rank minus preference score
  const bestChannel = useMemo(() => {
    const scored = CHANNELS.map((c) => {
      const timeRank = recommendedChannelIds.indexOf(c.id);
      const prefScore = preferences?.[c.id] || 0;
      return { channel: c, score: (timeRank === -1 ? 10 : timeRank) - prefScore * 0.5 };
    });
    return scored.sort((a, b) => a.score - b.score)[0]?.channel || CHANNELS[0];
  }, [recommendedChannelIds, preferences]);

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3">
      {/* Preview card */}
      {expanded && (
        <div className="animate-slide-up bg-gray-900/95 border border-white/10 rounded-2xl p-4 shadow-2xl w-56 backdrop-blur-md">
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-3 font-semibold">
            {moodLabel}
          </p>
          <BestChannelPreview channel={bestChannel} period={period} />
          <div className="mt-3 pt-3 border-t border-white/8">
            <p className="text-gray-600 text-xs">Already live — join mid-stream</p>
          </div>
        </div>
      )}

      {/* Main button */}
      <button
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
        onClick={() => onPlay(bestChannel)}
        className="flex items-center gap-2.5 pl-4 pr-5 py-3.5 bg-white text-black font-black rounded-full shadow-2xl hover:bg-gray-100 transition-all duration-150 hover:scale-105 active:scale-95 text-sm tracking-tight select-none"
        style={{ boxShadow: '0 4px 24px rgba(255,255,255,0.12)' }}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        Just Play
      </button>
    </div>
  );
}
