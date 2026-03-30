import React from 'react';
import HeroBanner from '../components/HeroBanner';
import ContextGreeting from '../components/ContextGreeting';
import PremierCard from '../components/PremierCard';
import WatchPartySection from '../components/WatchPartySection';
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
  // Premier
  premierChannel,
  editorial,
  premierState,
  todaysPremierTime,
  formattedTime,
  pushOneHour,
  cancelToday,
  pushesRemaining,
}) {
  return (
    <div className="bg-[#141414] min-h-screen">
      {/* Hero */}
      <HeroBanner onWatchLive={onNavigateToLive} />

      {/* Content — overlaps hero bottom */}
      <div className="-mt-24 relative z-10 space-y-2">

        {/* Greeting */}
        <ContextGreeting userName={userName} />

        {/* Personal Premier — the hero card */}
        {premierChannel && premierState !== 'expired' && (
          <PremierCard
            channel={premierChannel}
            editorial={editorial}
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

        {/* Global Watch Party — compact single section */}
        <WatchPartySection onChannelClick={onChannelClick} />

        {/* Continue Watching */}
        <RecentlyWatched history={recentlyWatched} onChannelClick={onChannelClick} />

        {/* Live Channels */}
        <LiveChannelsRow onChannelClick={onChannelClick} sortedChannels={sortedChannels} />

        {/* VOD rows */}
        <ContentRow title="Trending Now" items={TRENDING} />
        <ContentRow title="New Arrivals" items={NEW_ARRIVALS} badge="New" />

        {/* Footer */}
        <footer className="text-center py-16 px-8 border-t border-white/5 mt-6">
          <p className="text-2xl font-black mb-2">
            <span className="text-red-600">Stream</span><span className="text-white">Vault</span>
          </p>
          <p className="text-gray-700 text-sm">© 2025 StreamVault · Something is always playing.</p>
        </footer>
      </div>
    </div>
  );
}
