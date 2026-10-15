import { useEffect, useState } from 'react';

const COOLDOWN_TICK_MS = 1000;

export const useCooldownTimer = () => {
  const [cooldownSecs, setCooldownSecs] = useState(0);

  useEffect(() => {
    if (cooldownSecs <= 0) return;
    const interval = setInterval(() => {
      setCooldownSecs((prev) => Math.max(0, prev - 1));
    }, COOLDOWN_TICK_MS);
    return () => clearInterval(interval);
  }, [cooldownSecs]);

  return { cooldownSecs, startCooldown: setCooldownSecs };
};
