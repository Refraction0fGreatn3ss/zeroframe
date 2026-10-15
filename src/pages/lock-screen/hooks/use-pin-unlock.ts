import type { FormEvent } from 'react';
import { useState } from 'react';
import { getUnlockCooldownSecs } from '../lock-screen.utils';
import { useCooldownTimer } from './use-cooldown-timer';

const ERROR_DISPLAY_MS = 2500;

interface UsePinUnlockOptions {
  unlock: (pin: string) => Promise<boolean>;
  onUnlocked: () => void;
}

export const usePinUnlock = ({ unlock, onUnlocked }: UsePinUnlockOptions) => {
  const [pin, setPin] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const { cooldownSecs, startCooldown } = useCooldownTimer();

  const handleUnlock = async (e: FormEvent) => {
    e.preventDefault();
    if (cooldownSecs > 0) return;

    if (!showInput) {
      setShowInput(true);
      return;
    }

    setIsVerifying(true);
    const success = await unlock(pin);
    setIsVerifying(false);

    if (success) {
      onUnlocked();
      setFailedAttempts(0);
    } else {
      const nextFailures = failedAttempts + 1;
      setFailedAttempts(nextFailures);
      setError(true);
      setTimeout(() => setError(false), ERROR_DISPLAY_MS);

      const cooldown = getUnlockCooldownSecs(nextFailures);
      if (cooldown !== null) {
        startCooldown(cooldown);
      }
    }
  };

  return {
    pin,
    setPin,
    showInput,
    revealInput: () => setShowInput(true),
    error,
    isVerifying,
    failedAttempts,
    cooldownSecs,
    handleUnlock,
  };
};
