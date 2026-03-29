import React, { useState, useEffect } from 'react';

export default function Navbar({ onNavigate, currentPage }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl font-black tracking-tight"
          >
            <span className="text-red-600">Stream</span>
            <span className="text-white">Vault</span>
          </button>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors ${currentPage === 'home' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('live')}
              className={`transition-colors flex items-center gap-1.5 ${currentPage === 'live' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <span className="w-2 h-2 bg-red-500 rounded-full live-dot inline-block" />
              Live Channels
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">Movies</button>
            <button className="text-gray-400 hover:text-white transition-colors">Series</button>
            <button className="text-gray-400 hover:text-white transition-colors">My List</button>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-7V7a3 3 0 10-6 0v3l-5 7h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center text-xs font-bold cursor-pointer">
            U
          </div>
        </div>
      </div>
    </nav>
  );
}
