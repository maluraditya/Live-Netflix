import React, { useState, useEffect } from 'react';
import { HERO_CONTENT } from '../data/channels';

export default function HeroBanner({ onWatchLive }) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowVideo(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full" style={{ height: '85vh', minHeight: '500px' }}>
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        {showVideo ? (
          <iframe
            src={`https://www.youtube.com/embed/${HERO_CONTENT.videoId}?autoplay=1&mute=1&loop=1&playlist=${HERO_CONTENT.videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            title="Hero Preview"
            className="w-full h-full scale-150 pointer-events-none"
            style={{ border: 'none' }}
            allow="autoplay; encrypted-media"
          />
        ) : (
          <img
            src={`https://picsum.photos/seed/hero/1920/1080`}
            alt="Hero"
            className="w-full h-full object-cover"
          />
        )}
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
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-300">
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
        <div className="flex items-center gap-4">
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
          <button className="w-11 h-11 rounded-full border border-gray-500 flex items-center justify-center hover:border-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
