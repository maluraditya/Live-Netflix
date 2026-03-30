import { useState, useEffect } from 'react';

/**
 * Simulates a realistic viewer count that peaks around 8:30 PM local time.
 * Fluctuates slightly every few seconds to feel alive.
 */
export function useViewerCount(baseCount = 800) {
  const [count, setCount] = useState(baseCount);

  useEffect(() => {
    const compute = () => {
      const now = new Date();
      const t = now.getHours() + now.getMinutes() / 60;

      // Bell curve centred at 20.5 (8:30 PM), spread = 3.5 hours
      const peak = 20.5;
      const spread = 3.5;
      const curve = Math.exp(-Math.pow(t - peak, 2) / (2 * spread * spread));

      const noise = (Math.random() - 0.5) * 0.06;
      const multiplier = Math.max(0.08, 0.08 + curve * 0.92 + noise);

      setCount(Math.round(baseCount * multiplier + Math.random() * 25));
    };

    compute();
    const interval = setInterval(compute, 7000);
    return () => clearInterval(interval);
  }, [baseCount]);

  return count;
}
