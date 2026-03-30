import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import NamePrompt, { getUserName } from './components/NamePrompt';
import VideoPlayer from './components/VideoPlayer';
import JustPlayButton from './components/JustPlayButton';
import HomePage from './pages/HomePage';
import LiveChannelsPage from './pages/LiveChannelsPage';
import { useWatchHistory } from './hooks/useWatchHistory';
import { usePremierSchedule } from './hooks/usePremierSchedule';
import { CHANNELS } from './data/channels';
import './index.css';

export default function App() {
  const [currentPage,   setCurrentPage]   = useState('home');
  const [activeChannel, setActiveChannel] = useState(null);
  const [userName,      setUserName]      = useState(() => getUserName());

  const {
    addToHistory, updateWatchTime,
    getSortedChannels, getRecentlyWatched,
    preferences, history,
  } = useWatchHistory();

  const sortedChannels  = getSortedChannels(CHANNELS);
  const recentlyWatched = getRecentlyWatched();

  const {
    premierChannel, editorial,
    premierState, todaysPremierTime, formattedTime,
    pushOneHour, cancelToday, pushesRemaining,
  } = usePremierSchedule(preferences, history);

  const handleChannelClick = useCallback((channel) => {
    if (!channel) { setCurrentPage('live'); return; }
    setActiveChannel(channel);
    addToHistory(channel.id, channel.name, channel.playlist[0]?.title || '', 0);
  }, [addToHistory]);

  const handleClosePlayer = useCallback(() => setActiveChannel(null), []);

  const handleWatchTime = useCallback((channelId, seconds) => {
    updateWatchTime(channelId, seconds);
  }, [updateWatchTime]);

  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
    setActiveChannel(null);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeChannel ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeChannel]);

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <NamePrompt onComplete={setUserName} />

      {!activeChannel && (
        <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      )}

      {!activeChannel && currentPage === 'home' && (
        <HomePage
          userName={userName}
          onChannelClick={handleChannelClick}
          recentlyWatched={recentlyWatched}
          sortedChannels={sortedChannels}
          onNavigateToLive={() => setCurrentPage('live')}
          premierChannel={premierChannel}
          editorial={editorial}
          premierState={premierState}
          todaysPremierTime={todaysPremierTime}
          formattedTime={formattedTime}
          pushOneHour={pushOneHour}
          cancelToday={cancelToday}
          pushesRemaining={pushesRemaining}
        />
      )}

      {!activeChannel && currentPage === 'live' && (
        <LiveChannelsPage
          onChannelClick={handleChannelClick}
          sortedChannels={sortedChannels}
        />
      )}

      {activeChannel && (
        <VideoPlayer
          channel={activeChannel}
          onClose={handleClosePlayer}
          onWatchTime={handleWatchTime}
        />
      )}

      {!activeChannel && (
        <JustPlayButton onPlay={handleChannelClick} preferences={preferences} />
      )}
    </div>
  );
}
