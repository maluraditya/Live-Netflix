import React, { useState, useEffect } from 'react';

export const NAME_KEY = 'sv_username';

export function getUserName() {
  return localStorage.getItem(NAME_KEY) || '';
}

export default function NamePrompt({ onComplete }) {
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(NAME_KEY);
    if (stored === null) {
      // Small delay so the page renders first
      const t = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  const submit = () => {
    const val = name.trim();
    localStorage.setItem(NAME_KEY, val);
    setVisible(false);
    onComplete(val);
  };

  const skip = () => {
    localStorage.setItem(NAME_KEY, '');
    setVisible(false);
    onComplete('');
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm animate-slide-up shadow-2xl">
        <div className="text-4xl mb-5">👋</div>
        <h2 className="text-2xl font-black text-white mb-2">Before we start</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          What should we call you? We'll use your name so this feels a little more like it's made for you.
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Your first name"
          className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-white/40 mb-4 text-base transition-colors"
          autoFocus
          maxLength={30}
        />

        <button
          onClick={submit}
          className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-colors mb-3 text-base"
        >
          Let's go →
        </button>
        <button
          onClick={skip}
          className="w-full text-gray-600 text-sm hover:text-gray-400 transition-colors py-1"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
