import type { FormEvent } from 'react';
import { useState } from 'react';
import { STEP_UP_ERROR_MESSAGE } from '../login.data';

export const useStepUpMfa = (stepUpMfa: (code: string) => Promise<boolean>) => {
  const [totpCode, setTotpCode] = useState('');
  const [stepUpError, setStepUpError] = useState<string | null>(null);

  const handleStepUpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStepUpError(null);
    const success = await stepUpMfa(totpCode);
    if (!success) {
      setStepUpError(STEP_UP_ERROR_MESSAGE);
    }
  };

  return { totpCode, setTotpCode, stepUpError, handleStepUpSubmit };
};
