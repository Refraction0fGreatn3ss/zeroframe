const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const TWO_DIGIT_THRESHOLD = 10;

/** Brute-force backoff tiers, checked from the strictest down. */
const UNLOCK_BACKOFF_TIERS: { minFailures: number; cooldownSecs: number }[] = [
  { minFailures: 5, cooldownSecs: 30 },
  { minFailures: 3, cooldownSecs: 10 },
];

export const formatCountdown = (remainingMs: number): string => {
  const remainingSecsTotal = Math.floor(remainingMs / MS_PER_SECOND);
  const remMinutes = Math.floor(remainingSecsTotal / SECONDS_PER_MINUTE);
  const remSeconds = remainingSecsTotal % SECONDS_PER_MINUTE;
  return `${remMinutes}:${remSeconds < TWO_DIGIT_THRESHOLD ? '0' : ''}${remSeconds}`;
};

/** Returns the cooldown in seconds for the given failure count, or null if no backoff applies. */
export const getUnlockCooldownSecs = (failedAttempts: number): number | null => {
  const tier = UNLOCK_BACKOFF_TIERS.find(({ minFailures }) => failedAttempts >= minFailures);
  return tier ? tier.cooldownSecs : null;
};
