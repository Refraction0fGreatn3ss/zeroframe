import { useState } from 'react';
import { ACTION_MESSAGE_DURATION_MS, AIR_GAP_MESSAGES } from '../scada-ot.data';

export const useAirGapControls = () => {
  const [isDiodeIsolated, setIsDiodeIsolated] = useState(false);
  const [isReadOnlyInterlockEngaged, setIsReadOnlyInterlockEngaged] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const flashMessage = (message: string) => {
    setActionSuccessMsg(message);
    setTimeout(() => setActionSuccessMsg(null), ACTION_MESSAGE_DURATION_MS);
  };

  const toggleDiode = () => {
    setIsDiodeIsolated((prev) => !prev);
    flashMessage(!isDiodeIsolated ? AIR_GAP_MESSAGES.DIODE_ISOLATED : AIR_GAP_MESSAGES.DIODE_RESTORED);
  };

  const toggleInterlock = () => {
    setIsReadOnlyInterlockEngaged((prev) => !prev);
    flashMessage(
      !isReadOnlyInterlockEngaged ? AIR_GAP_MESSAGES.INTERLOCK_ENGAGED : AIR_GAP_MESSAGES.INTERLOCK_DISENGAGED,
    );
  };

  return { isDiodeIsolated, isReadOnlyInterlockEngaged, actionSuccessMsg, toggleDiode, toggleInterlock };
};
