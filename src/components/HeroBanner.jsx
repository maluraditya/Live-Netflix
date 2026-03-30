import React, { useState } from 'react';
import { HERO_CONTENT } from '../data/channels';

export default function HeroBanner({ onWatchLive }) {
  const [muted, setMuted] = useState(true);

  const embedSrc = `https://www.youtube.com/embed/${HERO_CONTENT.videoId}?autoplay=1&mute=1&loop=1&playlist=${HERO_CONTENT.videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`;

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '88vh', minHeight: '560px' }}>
      {/* YouTube background */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src={embedSrc}
          title="Hero Preview"
          className="absolute w-full h-full pointer-events-none"
          style={{
            border: 'none',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) scale(1.25)',
            minWidth: '100%', minHeight: '100%',
          }}
          allow="autoplay; encrypted-media"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 hero-gradient" />
      {/* Extra bottom fade for smooth content transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40"
        style={{ background: 'linear-gradient(to top, #141414, transparent)' }} />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-28 max-w-2xl">
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-lg uppercase tracking-widest">
              Featured
            </span>
            <span className="text-gray-400 text-sm">{HERO_CONTENT.tagline}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-none tracking-tight text-cinematic">
            {HERO_CONTENT.title}
          </h1>

          <div className="flex items-center gap-3 mb-4 text-sm text-gray-300 flex-wrap">
            <span className="text-green-400 font-semibold">★ {HERO_CONTENT.rating}</span>
            <span className="text-gray-700">·</span>
            <span>{HERO_CONTENT.year}</span>
            <span className="text-gray-700">·</span>
            {HERO_CONTENT.genre.map((g) => (
              <span key={g} className="px-2 py-0.5 border border-white/15 rounded-md text-xs text-gray-300">{g}</span>
            ))}
          </div>

          <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-lg">
            {HERO_CONTENT.description}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <button className="flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-bold text-base hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Play
            </button>
            <button onClick={onWatchLive}
              className="flex items-center gap-2 glass-card text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
              <span className="w-2 h-2 bg-red-500 rounded-full live-dot" />
              Watch Live
            </button>
            <button onClick={() => setMuted((v) => !v)}
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-all"
              title={muted ? 'Unmute' : 'Mute'}>
              {muted ? (
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
