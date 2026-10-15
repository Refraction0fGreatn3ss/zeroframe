import { useEffect, useState } from 'react';

const COUNTDOWN_TICK_MS = 1000;

export const useInactivityCountdown = (getRemainingInactivityMs: () => number) => {
  const [remainingMs, setRemainingMs] = useState(getRemainingInactivityMs());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingMs(getRemainingInactivityMs());
    }, COUNTDOWN_TICK_MS);
    return () => clearInterval(timer);
  }, [getRemainingInactivityMs]);

  return remainingMs;
};
