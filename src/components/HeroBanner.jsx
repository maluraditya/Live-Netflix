import React, { useState, useRef } from 'react';
import { HERO_CONTENT } from '../data/channels';

export default function HeroBanner({ onWatchLive }) {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  return (
    <div className="relative w-full" style={{ height: '85vh', minHeight: '500px' }}>
      {/* Background video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          src={HERO_CONTENT.videoUrl}
          poster={HERO_CONTENT.poster}
          autoPlay
          muted={muted}
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-8 pb-24 md:px-16 max-w-2xl animate-fade-in">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded uppercase tracking-wide">
            Featured
          </span>
          <span className="text-gray-400 text-sm">{HERO_CONTENT.tagline}</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-none tracking-tight">
          {HERO_CONTENT.title}
        </h1>

        {/* Metadata */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-300 flex-wrap">
          <span className="text-green-400 font-semibold">★ {HERO_CONTENT.rating}</span>
          <span>•</span>
          <span>{HERO_CONTENT.year}</span>
          <span>•</span>
          {HERO_CONTENT.genre.map((g) => (
            <span key={g} className="px-2 py-0.5 border border-gray-600 rounded text-xs">
              {g}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-lg">
          {HERO_CONTENT.description}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          <button className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-bold text-base hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </button>
          <button
            onClick={onWatchLive}
            className="flex items-center gap-2 bg-gray-700/80 text-white px-8 py-3 rounded-lg font-bold text-base hover:bg-gray-600/80 transition-colors backdrop-blur-sm"
          >
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full live-dot" />
            Watch Live
          </button>
          {/* Mute/unmute hero video */}
          <button
            onClick={() => setMuted((v) => !v)}
            className="w-11 h-11 rounded-full border border-gray-500 flex items-center justify-center hover:border-white transition-colors"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3-9.243A3 3 0 009 12a3 3 0 000 2.829M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
