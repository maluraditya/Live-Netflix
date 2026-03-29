import React, { useState } from 'react';
import LiveChannelCard from '../components/LiveChannelCard';
import { CHANNELS } from '../data/channels';

const CATEGORIES = ['All', 'Comedy', 'Romance', 'Action', 'Thriller', 'Documentary', 'Sci-Fi'];

export default function LiveChannelsPage({ onChannelClick, sortedChannels }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const channels = sortedChannels || CHANNELS;

  const filtered = activeCategory === 'All'
    ? channels
    : channels.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-brand-dark pt-20 pb-16">
      {/* Header */}
      <div className="px-8 md:px-16 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-3 h-3 bg-red-500 rounded-full live-dot" />
          <h1 className="text-3xl font-black text-white">Live Channels</h1>
          <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded uppercase tracking-wide">
            Live Now
          </span>
        </div>
        <p className="text-gray-500 text-base max-w-xl">
          No searching. No deciding. Just click a channel and something is already playing — like TV, but smarter.
        </p>
      </div>

      {/* Category filter */}
      <div className="px-8 md:px-16 mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Channels grid */}
      <div className="px-8 md:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((channel) => (
            <LiveChannelCard
              key={channel.id}
              channel={channel}
              onClick={onChannelClick}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No channels in this category.</p>
          </div>
        )}
      </div>

      {/* Info banner */}
      <div className="mx-8 md:mx-16 mt-16 p-6 rounded-xl bg-gradient-to-r from-red-900/40 to-gray-900 border border-red-900/30">
        <div className="flex items-start gap-4">
          <div className="text-3xl">📡</div>
          <div>
            <h3 className="text-white font-bold text-lg mb-1">How Live Channels Work</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              Each channel runs a continuous 24/7 schedule synchronized to real time. When you tune in,
              you join mid-stream — just like traditional TV. The schedule progresses in real time, so
              refreshing won't restart what's playing. Your watch preferences personalize channel ordering over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
