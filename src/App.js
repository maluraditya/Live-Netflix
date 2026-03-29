import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import VideoPlayer from './components/VideoPlayer';
import HomePage from './pages/HomePage';
import LiveChannelsPage from './pages/LiveChannelsPage';
import { useWatchHistory } from './hooks/useWatchHistory';
import { CHANNELS } from './data/channels';
import './index.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeChannel, setActiveChannel] = useState(null);
  const { addToHistory, updateWatchTime, getSortedChannels, getRecentlyWatched } = useWatchHistory();

  const sortedChannels = getSortedChannels(CHANNELS);
  const recentlyWatched = getRecentlyWatched();

  const handleChannelClick = useCallback(
    (channel) => {
      if (!channel) {
        // "All channels" — navigate to live page
        setCurrentPage('live');
        return;
      }
      setActiveChannel(channel);
      const currentItem = channel.playlist[0]; // approximate
      addToHistory(channel.id, channel.name, currentItem?.title || '', 0);
    },
    [addToHistory]
  );

  const handleClosePlayer = useCallback(() => {
    setActiveChannel(null);
  }, []);

  const handleWatchTime = useCallback(
    (channelId, seconds) => {
      updateWatchTime(channelId, seconds);
    },
    [updateWatchTime]
  );

  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
    setActiveChannel(null);
  }, []);

  // Close player when pressing escape (backup)
  useEffect(() => {
    if (activeChannel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeChannel]);

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Navbar — hidden when player open */}
      {!activeChannel && (
        <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      )}

      {/* Pages */}
      {!activeChannel && currentPage === 'home' && (
        <HomePage
          onChannelClick={handleChannelClick}
          recentlyWatched={recentlyWatched}
          sortedChannels={sortedChannels}
          onNavigateToLive={() => setCurrentPage('live')}
        />
      )}

      {!activeChannel && currentPage === 'live' && (
        <LiveChannelsPage
          onChannelClick={handleChannelClick}
          sortedChannels={sortedChannels}
        />
      )}

      {/* Full-screen video player */}
      {activeChannel && (
        <VideoPlayer
          channel={activeChannel}
          onClose={handleClosePlayer}
          onWatchTime={handleWatchTime}
        />
      )}
    </div>
  );
}
