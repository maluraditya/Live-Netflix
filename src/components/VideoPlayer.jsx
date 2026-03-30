import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import { loadYouTubeAPI } from '../utils/youtubeApi';

export default function VideoPlayer({ channel, onClose, onWatchTime }) {
  const { currentItem, elapsed, progress, visibleSchedule, upcomingItems } = useSchedule(channel);
  const [showControls, setShowControls] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);
  const [joining, setJoining]           = useState(true);
  const [muted, setMuted]               = useState(false);

  const playerRef        = useRef(null);
  const elapsedRef       = useRef(elapsed);
  const currentVideoRef  = useRef(null);
  const controlsTimer    = useRef(null);
  const watchTimer       = useRef(null);
  const playerDivId      = useRef(`yt-${channel.id}-${Date.now()}`).current;

  // Keep elapsed accessible without re-creating the init effect
  useEffect(() => { elapsedRef.current = elapsed; }, [elapsed]);

  // Create YT.Player once on mount
  useEffect(() => {
    let destroyed = false;

    loadYouTubeAPI(() => {
      if (destroyed) return;

      playerRef.current = new window.YT.Player(playerDivId, {
        width:   '100%',
        height:  '100%',
        videoId: currentItem?.videoId,
        playerVars: {
          autoplay:        1,
          controls:        0,
          disablekb:       1,
          fs:              0,
          iv_load_policy:  3,
          modestbranding:  1,
          playsinline:     1,
          rel:             0,
          start:           Math.floor(elapsedRef.current),
          origin:          window.location.origin,
        },
        events: {
          onReady(e) {
            // Force the created iframe to fill its container
            const iframe = e.target.getIframe();
            if (iframe) {
              iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;';
            }
            e.target.seekTo(elapsedRef.current, true);
            e.target.playVideo();
            setTimeout(() => { if (!destroyed) setJoining(false); }, 1200);
          },
          onStateChange(e) {
            // Keep video playing — YouTube sometimes pauses after seek
            if (e.data === window.YT.PlayerState.PAUSED) {
              e.target.playVideo();
            }
          },
        },
      });

      currentVideoRef.current = currentItem?.videoId;
    });

    return () => {
      destroyed = true;
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }
    };
  }, []); // intentionally empty — player must be created only once

  // Switch video without remounting the player
  useEffect(() => {
    if (!currentItem) return;
    if (currentItem.videoId === currentVideoRef.current) return;
    if (!playerRef.current || typeof playerRef.current.loadVideoById !== 'function') return;

    setJoining(true);
    playerRef.current.loadVideoById({
      videoId:      currentItem.videoId,
      startSeconds: Math.floor(elapsedRef.current),
    });
    currentVideoRef.current = currentItem.videoId;
    setTimeout(() => setJoining(false), 1200);
  }, [currentItem]); // videoId change triggers load — elapsedRef is a ref, stable by design

  // Mute / unmute without remounting
  useEffect(() => {
    if (!playerRef.current || typeof playerRef.current.mute !== 'function') return;
    if (muted) playerRef.current.mute();
    else playerRef.current.unMute();
  }, [muted]);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 3500);
  }, []);

  useEffect(() => {
    resetControlsTimer();
    return () => clearTimeout(controlsTimer.current);
  }, [resetControlsTimer]);

  useEffect(() => {
    watchTimer.current = setInterval(() => {
      if (onWatchTime) onWatchTime(channel.id, 5);
    }, 5000);
    return () => clearInterval(watchTimer.current);
  }, [channel.id, onWatchTime]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 's' || e.key === 'S') setShowSchedule((v) => !v);
      if (e.key === 'm' || e.key === 'M') setMuted((v) => !v);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const fmt = (s) => {
    const abs = Math.abs(s);
    return `${Math.floor(abs / 60)}:${String(Math.floor(abs % 60)).padStart(2, '0')}`;
  };
  const remainingSeconds = currentItem ? Math.max(0, currentItem.duration - elapsed) : 0;

  if (!currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      onMouseMove={resetControlsTimer}
      onClick={resetControlsTimer}
      style={{ cursor: showControls ? 'default' : 'none' }}
    >
      {/* YouTube player — fills screen, iframe sized explicitly via constructor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div id={playerDivId} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Black strips covering YouTube logo (bottom-right) and any top chrome */}
      <div className="absolute pointer-events-none" style={{ bottom: 0, left: 0, right: 0, height: '44px', background: '#000', zIndex: 2 }} />
      <div className="absolute pointer-events-none" style={{ top: 0, left: 0, right: 0, height: '8px',  background: '#000', zIndex: 2 }} />

      {/* Joining overlay */}
      {joining && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-20 animate-fade-in">
          <div className="mb-6 text-5xl">{channel.emoji}</div>
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
          <p className="text-white font-semibold text-lg">{channel.name}</p>
          <p className="text-gray-500 text-sm mt-1">Joining stream…</p>
        </div>
      )}

      {/* Top controls */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)', paddingBottom: '48px', zIndex: 10 }}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <button onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm border border-white/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{channel.emoji}</span>
                <span className="text-white font-bold text-base">{channel.name}</span>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-red-600 rounded-md">
                  <span className="w-1.5 h-1.5 bg-white rounded-full live-dot" />
                  <span className="text-white text-xs font-bold">LIVE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mute toggle */}
            <button
              onClick={(e) => { e.stopPropagation(); setMuted((v) => !v); }}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-white/15 flex items-center justify-center transition-colors backdrop-blur-sm border border-white/10"
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? (
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              )}
            </button>

            {/* Schedule toggle */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowSchedule((v) => !v); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all backdrop-blur-sm border ${
                showSchedule
                  ? 'bg-white/15 border-white/20 text-white'
                  : 'bg-black/30 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Bottom now-playing strip */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)', paddingTop: '60px', zIndex: 10 }}
      >
        <div className="px-5 pb-8">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Now Playing</span>
              <span className="text-xs px-1.5 py-0.5 border border-white/15 rounded text-gray-500">{currentItem.genre}</span>
            </div>
            <p className="text-white font-bold text-xl leading-tight">{currentItem.title}</p>
            {upcomingItems[0] && (
              <p className="text-gray-500 text-sm mt-0.5">
                Up next: <span className="text-gray-400">{upcomingItems[0].title}</span>
              </p>
            )}
          </div>

          <div className="mb-2">
            <div className="relative h-0.5 bg-white/15 rounded-full">
              <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
                style={{ width: `${progress}%`, backgroundColor: channel.accentColor }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white shadow-md transition-all duration-1000"
                style={{ left: `calc(${progress}% - 5px)`, backgroundColor: channel.accentColor }} />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-gray-600 text-xs tabular-nums">{fmt(elapsed)}</span>
              <div className="flex items-center gap-1 text-xs text-red-400">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full live-dot" />
                <span className="font-semibold">LIVE</span>
              </div>
              <span className="text-gray-600 text-xs tabular-nums">-{fmt(remainingSeconds)}</span>
            </div>
          </div>

          <p className="text-gray-700 text-xs text-center">ESC to exit · S for schedule · M to mute</p>
        </div>
      </div>

      {/* Schedule sidebar */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-72 md:w-80 z-20 transition-transform duration-300 ease-out ${
          showSchedule ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/8">
          <div>
            <h3 className="text-white font-bold">Schedule</h3>
            <p className="text-gray-600 text-xs mt-0.5">{channel.name}</p>
          </div>
          <button onClick={() => setShowSchedule(false)}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white rounded-lg hover:bg-white/8 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {visibleSchedule.map((item) => (
            <div key={`${item.videoId}-${item.startTime}`}
              className="flex gap-3 px-5 py-3.5 border-l-2 transition-colors"
              style={{
                borderColor: item.isCurrent ? channel.accentColor : 'transparent',
                backgroundColor: item.isCurrent ? 'rgba(255,255,255,0.05)' : 'transparent',
              }}>
              <div className="w-14 flex-shrink-0 pt-0.5">
                <p className={`text-xs font-mono ${item.isCurrent ? 'text-white font-bold' : 'text-gray-600'}`}>
                  {item.formattedStart}
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`text-sm truncate ${item.isCurrent ? 'text-white font-semibold' : 'text-gray-400'}`}>
                    {item.title}
                  </p>
                  {item.isCurrent && (
                    <span className="flex-shrink-0 px-1.5 py-0.5 text-xs rounded font-bold text-black"
                      style={{ backgroundColor: channel.accentColor }}>NOW</span>
                  )}
                </div>
                <p className="text-gray-700 text-xs">{item.genre}</p>
                {item.isCurrent && (
                  <div className="mt-1.5 h-0.5 bg-white/10 rounded-full">
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%`, backgroundColor: channel.accentColor }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
