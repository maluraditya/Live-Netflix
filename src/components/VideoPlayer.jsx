import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSchedule } from '../hooks/useSchedule';

export default function VideoPlayer({ channel, onClose, onWatchTime }) {
  const { currentItem, elapsed, progress, visibleSchedule, upcomingItems, formatTime } = useSchedule(channel);
  const [showControls, setShowControls] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);
  const [volume, setVolume] = useState(50);
  const [muted, setMuted] = useState(false);
  const controlsTimer = useRef(null);
  const watchTimer = useRef(null);
  const watchSeconds = useRef(0);

  // Hide controls after inactivity
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      if (!showSchedule) setShowControls(false);
    }, 3000);
  }, [showSchedule]);

  useEffect(() => {
    resetControlsTimer();
    return () => clearTimeout(controlsTimer.current);
  }, [resetControlsTimer]);

  // Track watch time
  useEffect(() => {
    watchTimer.current = setInterval(() => {
      watchSeconds.current += 5;
      if (onWatchTime) onWatchTime(channel.id, 5);
    }, 5000);
    return () => clearInterval(watchTimer.current);
  }, [channel.id, onWatchTime]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 's') setShowSchedule((v) => !v);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const remainingSeconds = currentItem ? currentItem.duration - elapsed : 0;
  const formatDuration = (s) => {
    const m = Math.floor(Math.abs(s) / 60);
    const sec = Math.floor(Math.abs(s) % 60);
    return `${s < 0 ? '-' : ''}${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onMouseMove={resetControlsTimer}
      onClick={resetControlsTimer}
      style={{ cursor: showControls ? 'default' : 'none' }}
    >
      {/* YouTube Iframe */}
      <div className="absolute inset-0">
        {currentItem && (
          <iframe
            key={currentItem.id}
            src={`https://www.youtube.com/embed/${currentItem.id}?autoplay=1&start=${Math.floor(elapsed)}&mute=${muted ? 1 : 0}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1&enablejsapi=1`}
            title={currentItem.title}
            className="w-full h-full"
            style={{ border: 'none', pointerEvents: 'none' }}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        )}
      </div>

      {/* Player gradient overlay */}
      <div
        className={`absolute inset-0 player-gradient transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 flex flex-col transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-5 pt-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-2xl">{channel.emoji}</span>
                <span className="text-white font-bold text-lg">{channel.name}</span>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-red-600 rounded">
                  <span className="w-1.5 h-1.5 bg-white rounded-full live-dot" />
                  <span className="text-white text-xs font-bold">LIVE</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{channel.category} Channel</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSchedule((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showSchedule ? 'bg-white/20 text-white' : 'bg-black/40 text-gray-300 hover:bg-black/60'
              } backdrop-blur-sm`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule
            </button>
          </div>
        </div>

        {/* Center play area - clicking toggles controls */}
        <div className="flex-1" />

        {/* Bottom controls */}
        <div className="px-6 pb-8">
          {/* Now Playing info */}
          <div className="mb-4">
            {currentItem && (
              <div className="animate-slide-up">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Now Playing</span>
                  <span className="text-xs px-1.5 py-0.5 border border-gray-600 rounded text-gray-400">{currentItem.genre}</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{currentItem.title}</h2>
                {upcomingItems[0] && (
                  <p className="text-gray-400 text-sm mt-1">
                    Up Next: <span className="text-gray-300">{upcomingItems[0].title}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Progress bar (live-style, mostly disabled) */}
          <div className="mb-4">
            <div className="relative h-1 bg-gray-700 rounded-full cursor-default">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
                style={{ width: `${progress}%`, backgroundColor: channel.accentColor }}
              />
              {/* Live head indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-lg transition-all duration-1000"
                style={{ left: `calc(${progress}% - 6px)`, backgroundColor: channel.accentColor }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-gray-500 text-xs">{formatDuration(elapsed)} elapsed</span>
              <div className="flex items-center gap-1 text-xs text-red-400">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full live-dot" />
                <span className="font-medium">LIVE</span>
              </div>
              <span className="text-gray-500 text-xs">-{formatDuration(remainingSeconds)}</span>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mute */}
              <button
                onClick={() => setMuted((v) => !v)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {muted ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-5.657-5.657A8 8 0 014 12a8 8 0 012.343-5.657M12 6l-3 3H5a1 1 0 00-1 1v4a1 1 0 001 1h4l3 3V6z" />
                  </svg>
                )}
              </button>

              {/* Volume slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={muted ? 0 : volume}
                onChange={(e) => {
                  setVolume(+e.target.value);
                  setMuted(false);
                }}
                className="w-24 h-1 appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${channel.accentColor} ${muted ? 0 : volume}%, #4b5563 ${muted ? 0 : volume}%)`,
                  WebkitAppearance: 'none',
                }}
              />
            </div>

            {/* Channel switcher label */}
            <div className="text-center">
              <p className="text-gray-500 text-xs">Press ESC to exit • S for schedule</p>
            </div>

            {/* Fullscreen */}
            <button
              onClick={() => document.documentElement.requestFullscreen?.()}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Sidebar */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-80 bg-black/90 backdrop-blur-md transition-transform duration-300 ${
          showSchedule ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col border-l border-white/10`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div>
            <h3 className="text-white font-bold text-lg">Schedule</h3>
            <p className="text-gray-500 text-xs mt-0.5">{channel.name}</p>
          </div>
          <button
            onClick={() => setShowSchedule(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {visibleSchedule.map((item, i) => (
            <div
              key={`${item.id}-${item.startTime}`}
              className={`flex gap-3 px-5 py-3 transition-colors ${
                item.isCurrent
                  ? 'bg-white/10 border-l-2'
                  : 'hover:bg-white/5 border-l-2 border-transparent'
              }`}
              style={{ borderColor: item.isCurrent ? channel.accentColor : 'transparent' }}
            >
              {/* Time */}
              <div className="flex-shrink-0 w-16 pt-0.5">
                <p className={`text-xs font-mono ${item.isCurrent ? 'text-white font-bold' : 'text-gray-500'}`}>
                  {item.formattedStart}
                </p>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`text-sm font-medium truncate ${item.isCurrent ? 'text-white' : 'text-gray-300'}`}>
                    {item.title}
                  </p>
                  {item.isCurrent && (
                    <span
                      className="flex-shrink-0 px-1.5 py-0.5 text-xs rounded font-bold text-black"
                      style={{ backgroundColor: channel.accentColor }}
                    >
                      NOW
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-xs">{item.genre}</p>

                {/* Progress for current */}
                {item.isCurrent && (
                  <div className="mt-2 h-0.5 bg-gray-700 rounded-full">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%`, backgroundColor: channel.accentColor }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-gray-600 text-xs text-center">
            Schedule auto-advances in real time
          </p>
        </div>
      </div>
    </div>
  );
}
