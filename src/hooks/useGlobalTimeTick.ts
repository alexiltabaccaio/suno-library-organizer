import { useState, useEffect } from 'react';

const subscribers = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;

const tick = () => {
  subscribers.forEach(cb => cb());
};

/**
 * A highly performant global timer hook.
 * Instead of creating a new setInterval for every component,
 * this hook registers the component to a single, shared interval.
 * 
 * @param enabled Whether this component should subscribe to the tick
 * @param intervalMs The tick interval in milliseconds (default: 30000ms / 30s)
 */
export const useGlobalTimeTick = (enabled: boolean = true, intervalMs: number = 30000) => {
  const [, setTickState] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const callback = () => setTickState(t => t + 1);
    subscribers.add(callback);

    if (!intervalId) {
      intervalId = setInterval(tick, intervalMs);
    }

    return () => {
      subscribers.delete(callback);
      if (subscribers.size === 0 && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, [enabled, intervalMs]);
};
