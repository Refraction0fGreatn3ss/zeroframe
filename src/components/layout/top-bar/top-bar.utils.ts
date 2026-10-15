import type { OperatingMode } from '../../../types';
import type { SelectableOperatingMode } from './top-bar.data';
import { COUNTDOWN_CRITICAL_SECONDS, COUNTDOWN_WARNING_SECONDS } from './top-bar.data';

export type CountdownUrgency = 'critical' | 'warning' | 'normal';

const pad2 = (value: number) => String(value).padStart(2, '0');

export function formatUtcTime24(date: Date): string {
  return `${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}:${pad2(date.getUTCSeconds())}`;
}

export function formatLocalTime24(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}

export function toWholeSeconds(ms: number): number {
  return Math.floor(ms / 1000);
}

export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export function getCountdownUrgency(totalSeconds: number): CountdownUrgency {
  if (totalSeconds <= COUNTDOWN_CRITICAL_SECONDS) return 'critical';
  if (totalSeconds <= COUNTDOWN_WARNING_SECONDS) return 'warning';
  return 'normal';
}

export function toSelectableOperatingMode(mode: OperatingMode): SelectableOperatingMode {
  return mode === 'MAINTENANCE_MODE' ? 'MAINTENANCE' : mode;
}

export function getOperatingModeSelectClass(mode: OperatingMode): string {
  switch (mode) {
    case 'ACTIVE_PROTECTION':
      return 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300';
    case 'MONITOR_ONLY':
      return 'bg-blue-950/40 border-blue-700/60 text-blue-300';
    case 'STOPPED':
      return 'bg-rose-950/40 border-rose-700/60 text-rose-300';
    default:
      return 'bg-amber-950/40 border-amber-700/60 text-amber-300';
  }
}
