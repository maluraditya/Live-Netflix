import React, { useRef, useState } from 'react';

function ContentCard({ item, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer card-hover"
      style={{ width: '200px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative rounded-md overflow-hidden bg-gray-800">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full object-cover"
          style={{ height: '113px' }}
          loading="lazy"
        />
        {/* Hover overlay */}
        {hovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center animate-fade-in">
            <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
        {/* Rank badge for trending */}
        {index !== undefined && index < 3 && (
          <div className="absolute top-1 left-1 w-6 h-6 bg-red-600 rounded text-xs font-black flex items-center justify-center">
            {index + 1}
          </div>
        )}
      </div>
      <div className="mt-1.5 px-0.5">
        <p className="text-sm font-medium text-white truncate">{item.title}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
          <span className="text-green-400">★ {item.rating}</span>
          <span>{item.year}</span>
          <span className="px-1 border border-gray-600 rounded text-xs">{item.genre}</span>
        </div>
      </div>
    </div>
  );
}

export default function ContentRow({ title, items, badge }) {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 600, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-10">
      {/* Row header */}
      <div className="flex items-center gap-3 mb-4 px-8 md:px-16">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {badge && (
          <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded uppercase tracking-wide">
            {badge}
          </span>
        )}
        <button className="text-red-500 text-sm font-medium hover:text-red-400 ml-auto flex items-center gap-1">
          See all
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Scroll container */}
      <div className="relative group">
        {/* Left arrow */}
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
          style={{ marginTop: '-20px' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Cards */}
        <div
          ref={rowRef}
          className="scroll-row px-8 md:px-16"
        >
          {items.map((item, i) => (
            <ContentCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
          style={{ marginTop: '-20px' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-brand-dark to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-brand-dark to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
