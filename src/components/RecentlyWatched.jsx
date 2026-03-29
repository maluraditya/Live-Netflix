import React from 'react';
import { CHANNELS } from '../data/channels';
import { useSchedule } from '../hooks/useSchedule';

function RecentCard({ entry, onClick }) {
  const channel = CHANNELS.find((c) => c.id === entry.channelId);
  const { progress } = useSchedule(channel);

  if (!channel) return null;

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer card-hover"
      style={{ width: '200px' }}
      onClick={() => onClick(channel)}
    >
      <div className="relative rounded-md overflow-hidden bg-gray-800" style={{ height: '113px' }}>
        <img
          src={channel.thumbnail}
          alt={channel.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${channel.color} opacity-30`} />
        <div className="absolute inset-0 bg-black/40 flex items-end p-2">
          <div className="w-full">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full live-dot" />
              <span className="text-white text-xs font-bold">LIVE</span>
            </div>
            <div className="h-0.5 bg-gray-600 rounded-full">
              <div
                className="h-full rounded-full"
                style={{ width: `${progress}%`, backgroundColor: channel.accentColor }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1.5 px-0.5">
        <p className="text-sm font-medium text-white truncate">{channel.name}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

export default function RecentlyWatched({ history, onChannelClick }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4 px-8 md:px-16">
        <h2 className="text-lg font-bold text-white">Continue Watching</h2>
      </div>
      <div className="scroll-row px-8 md:px-16">
        {history.map((entry) => (
          <RecentCard
            key={`${entry.channelId}-${entry.timestamp}`}
            entry={entry}
            onClick={onChannelClick}
          />
        ))}
      </div>
    </div>
  );
}
