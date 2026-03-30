import React from 'react';
import HeroBanner from '../components/HeroBanner';
import ContextGreeting from '../components/ContextGreeting';
import PremierCard from '../components/PremierCard';
import GlobalPremiersRow from '../components/GlobalPremiersRow';
import ContentRow from '../components/ContentRow';
import LiveChannelsRow from '../components/LiveChannelsRow';
import RecentlyWatched from '../components/RecentlyWatched';
import { TRENDING, NEW_ARRIVALS } from '../data/channels';

export default function HomePage({
  userName,
  onChannelClick,
  recentlyWatched,
  sortedChannels,
  onNavigateToLive,
  // Premier props
  preferredChannel,
  premierState,
  todaysPremierTime,
  formattedTime,
  pushOneHour,
  cancelToday,
  pushesRemaining,
}) {
  return (
    <div className="bg-brand-dark min-h-screen">
      {/* Hero */}
      <HeroBanner onWatchLive={onNavigateToLive} />

      {/* Content — offset to overlap hero bottom gradient */}
      <div className="-mt-20 relative z-10">

        {/* Personalised greeting */}
        <ContextGreeting userName={userName} />

        {/* Personal Premier card */}
        {preferredChannel && premierState !== 'expired' && (
          <PremierCard
            channel={preferredChannel}
            userName={userName}
            premierState={premierState}
            todaysPremierTime={todaysPremierTime}
            formattedTime={formattedTime}
            pushOneHour={pushOneHour}
            cancelToday={cancelToday}
            pushesRemaining={pushesRemaining}
            onJoin={onChannelClick}
          />
        )}

        {/* Global Watch Parties */}
        <GlobalPremiersRow onChannelClick={onChannelClick} />

        {/* Continue Watching */}
        <RecentlyWatched history={recentlyWatched} onChannelClick={onChannelClick} />

        {/* Live Channels row */}
        <LiveChannelsRow
          onChannelClick={onChannelClick}
          sortedChannels={sortedChannels}
        />

        {/* VOD rows */}
        <ContentRow title="Trending Now" items={TRENDING} />
        <ContentRow title="New Arrivals" items={NEW_ARRIVALS} badge="New" />
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
          <p className="text-gray-700 text-xs mt-1">Something is always playing.</p>
        </footer>
      </div>
    </div>
  );
}
