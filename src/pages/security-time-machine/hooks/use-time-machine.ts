import { useState } from 'react';
import type { HistoricalState } from '../security-time-machine.data';
import {
  buildReconstructedState,
  DEFAULT_SNAPSHOT_TIME,
  INITIAL_HISTORICAL_STATE,
} from '../security-time-machine.data';

const SIMULATED_RECONSTRUCTION_DELAY_MS = 500;

export const useTimeMachine = () => {
  const [selectedTime, setSelectedTime] = useState(DEFAULT_SNAPSHOT_TIME);
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [historicalState, setHistoricalState] = useState<HistoricalState>(INITIAL_HISTORICAL_STATE);

  const reconstruct = () => {
    setIsReconstructing(true);
    setTimeout(() => {
      setHistoricalState(buildReconstructedState(selectedTime));
      setIsReconstructing(false);
    }, SIMULATED_RECONSTRUCTION_DELAY_MS);
  };

  return { selectedTime, setSelectedTime, isReconstructing, historicalState, reconstruct };
};
