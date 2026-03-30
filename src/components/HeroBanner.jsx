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
              title={muted ? 'Info' : 'Info'}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
