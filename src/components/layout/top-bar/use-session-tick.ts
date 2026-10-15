import { useEffect, useState } from 'react';
import { TICK_INTERVAL_MS } from './top-bar.data';

export function useSessionTick(getRemainingInactivityMs: () => number) {
  const [remainingMs, setRemainingMs] = useState(getRemainingInactivityMs());
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const update = () => {
      setNow(new Date());
      setRemainingMs(getRemainingInactivityMs());
    };
    update();
    const interval = setInterval(update, TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [getRemainingInactivityMs]);

  return { now, remainingMs };
}
