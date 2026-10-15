import type { ViewMode } from '../../../stores/app-store';
import type { InactivityPolicyKey } from '../../../stores/auth-store';

export type ClockMode = 'UTC' | 'LOCAL' | 'DUAL';

export type SelectableOperatingMode = 'ACTIVE_PROTECTION' | 'MONITOR_ONLY' | 'MAINTENANCE' | 'STOPPED';

export const TICK_INTERVAL_MS = 1000;

export const COUNTDOWN_CRITICAL_SECONDS = 60;
export const COUNTDOWN_WARNING_SECONDS = 180;

export const CLOCK_MODE_CYCLE: Record<ClockMode, ClockMode> = {
  UTC: 'LOCAL',
  LOCAL: 'DUAL',
  DUAL: 'UTC',
};

export interface OperatingModeOption {
  value: SelectableOperatingMode;
  label: string;
  optionClassName: string;
}

export const OPERATING_MODE_OPTIONS: OperatingModeOption[] = [
  { value: 'ACTIVE_PROTECTION', label: 'Active Protection', optionClassName: 'bg-[#0e1614] text-emerald-300' },
  { value: 'MONITOR_ONLY', label: 'Monitor Only', optionClassName: 'bg-[#0b1320] text-blue-300' },
  { value: 'MAINTENANCE', label: 'Maintenance', optionClassName: 'bg-[#1a140a] text-amber-300' },
  { value: 'STOPPED', label: 'Stopped', optionClassName: 'bg-[#1f0b0d] text-rose-300' },
];

export interface InactivityPolicyOption {
  value: InactivityPolicyKey;
  label: string;
}

export const INACTIVITY_POLICY_OPTIONS: InactivityPolicyOption[] = [
  { value: '5m', label: '5m SCIF' },
  { value: '10m', label: '10m FIN' },
  { value: '15m', label: '15m NIST' },
];

export interface ViewModeOption {
  value: ViewMode;
  label: string;
}

export const VIEW_MODE_OPTIONS: ViewModeOption[] = [
  { value: 'SIMPLE_SOC', label: 'Simple SOC' },
  { value: 'ANALYST_SOC', label: 'Analyst SOC' },
];
