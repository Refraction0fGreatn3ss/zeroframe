import type { InactivityPolicyKey } from '../../types/session';

export type { InactivityPolicyKey } from '../../types/session';

const MS_PER_MINUTE = 60 * 1000;
export const MS_PER_SECOND = 1000;

export const INACTIVITY_POLICY_MAP: Record<InactivityPolicyKey, number> = {
  '5m': 5 * MS_PER_MINUTE, // SCIF / maximum defense
  '10m': 10 * MS_PER_MINUTE, // PCI-DSS / healthcare
  '15m': 15 * MS_PER_MINUTE, // NIST SP 800-53 AC-12 baseline
};

export const DEFAULT_INACTIVITY_POLICY: InactivityPolicyKey = '15m';

export const WARNING_THRESHOLD_MS = 60 * MS_PER_SECOND;
export const WARNING_COUNTDOWN_SECONDS = WARNING_THRESHOLD_MS / MS_PER_SECOND;

export function isInactivityPolicy(value: unknown): value is InactivityPolicyKey {
  return value === '5m' || value === '10m' || value === '15m';
}
