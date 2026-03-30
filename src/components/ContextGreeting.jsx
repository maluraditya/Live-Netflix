import React from 'react';
import { useTimeContext } from '../hooks/useTimeContext';

export default function ContextGreeting({ userName }) {
  const { greeting, subtitle, moodLabel } = useTimeContext();
  const displayName = userName ? `, ${userName}` : '';

  return (
    <div className="px-8 md:px-16 pt-10 pb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-1.5">
            {greeting}{displayName}.
          </h1>
          <p className="text-gray-400 text-base">{subtitle}</p>
        </div>
        <span className="flex-shrink-0 mt-1 px-3 py-1.5 bg-white/8 border border-white/10 rounded-full text-sm text-gray-300 font-medium whitespace-nowrap">
          {moodLabel}
        </span>
      </div>
    </div>
  );
}
