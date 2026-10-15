import type { GovernorState } from './inspection-integrity.types';

const CRITICAL_PRESSURE_THRESHOLD = 80;
const ELEVATED_PRESSURE_THRESHOLD = 50;
const PERCENT = 100;

export const getGovernorStateClassName = (state: GovernorState): string => {
  switch (state) {
    case 'NORMAL':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'PRESSURED':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    case 'DEGRADED':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    default:
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  }
};

export const getPressureBarClassName = (value: number): string => {
  if (value > CRITICAL_PRESSURE_THRESHOLD) return 'bg-rose-500';
  if (value > ELEVATED_PRESSURE_THRESHOLD) return 'bg-amber-400';
  return 'bg-cyan-400';
};

export const formatRatioAsPercent = (ratio: number): string => (ratio * PERCENT).toFixed(1);
