import React from 'react';
import HeroBanner from '../components/HeroBanner';
import ContentRow from '../components/ContentRow';
import LiveChannelsRow from '../components/LiveChannelsRow';
import RecentlyWatched from '../components/RecentlyWatched';
import { TRENDING, NEW_ARRIVALS } from '../data/channels';

export default function HomePage({ onChannelClick, recentlyWatched, sortedChannels, onNavigateToLive }) {
  return (
    <div className="bg-brand-dark min-h-screen">
      {/* Hero */}
      <HeroBanner onWatchLive={onNavigateToLive} />

      {/* Content rows — offset to overlap hero bottom */}
      <div className="-mt-24 relative z-10">
        {/* Recently Watched */}
        <RecentlyWatched history={recentlyWatched} onChannelClick={onChannelClick} />

        {/* Live Channels */}
        <LiveChannelsRow
          onChannelClick={onChannelClick}
          sortedChannels={sortedChannels}
        />

        {/* Trending */}
        <ContentRow title="Trending Now" items={TRENDING} />

        {/* New */}
        <ContentRow title="New Arrivals" items={NEW_ARRIVALS} badge="New" />

        {/* More rows */}
        <ContentRow
          title="Top Rated"
          items={[...TRENDING].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))}
        />

        {/* Footer */}
        <footer className="text-center py-12 px-8 border-t border-gray-800 mt-8">
          <p className="text-2xl font-black mb-2">
            <span className="text-red-600">Stream</span>
            <span className="text-white">Vault</span>
          </p>
          <p className="text-gray-600 text-sm">© 2025 StreamVault. All rights reserved.</p>
          <p className="text-gray-700 text-xs mt-2">Live Channels Platform — Something is always playing.</p>
        </footer>
      </div>
    </div>
  );
}
