import type { Freshness } from '../../lib/freshness';
import type { LoadState } from '../../lib/load-state';
import type { StatusTone } from './StatusChip';

export const FRESHNESS_TONES: Record<Freshness, StatusTone> = {
  FRESH: 'positive',
  AGING: 'warning',
  STALE: 'critical',
  UNKNOWN: 'unknown',
  UNAVAILABLE: 'unknown',
};

export const LOAD_STATE_TONES: Record<LoadState, StatusTone> = {
  IDLE: 'neutral',
  LOADING: 'info',
  READY: 'positive',
  EMPTY: 'neutral',
  STALE: 'warning',
  ERROR: 'critical',
  UNAVAILABLE: 'unknown',
  PERMISSION_DENIED: 'critical',
  NOT_SUPPORTED: 'unknown',
};

const POSITIVE = [
  'HEALTHY',
  'PASS',
  'VALID',
  'VERIFIED',
  'READY',
  'SUPPORTED',
  'NORMAL',
  'OBSERVED',
  'COMPLETE',
  'ACTIVE',
  'FRESH',
  'NOT_AFFECTED',
  'APPROVED_RESOLVER',
  'CONNECTED',
  'ENABLED',
];
const WARNING = [
  'DEGRADED',
  'WARNING',
  'EXPIRING',
  'PRESSURED',
  'PARTIALLY_OBSERVED',
  'STALE',
  'AGING',
  'ROTATION_PENDING',
  'POSSIBLY_PRESENT',
  'VERSION_MATCHED',
  'THEORETICAL',
  'DRAFT',
  'PENDING',
];
const CRITICAL = [
  'FAILED',
  'FAIL',
  'UNSAFE',
  'SECURITY_IMPAIRED',
  'EXPIRED',
  'REVOKED',
  'INVALID',
  'NOT_OBSERVED',
  'VERIFIED_PRESENT',
  'REACHABLE',
  'OBSERVED_CONFIRMED',
  'DENIED',
  'NOT_AUTHORIZED',
  'CRITICAL',
  'UNAPPROVED_RESOLVER',
  'RESOLVER_BYPASS',
];
const UNKNOWN = ['UNKNOWN', 'UNAVAILABLE', 'NOT_APPLICABLE', 'UNSUPPORTED', 'ENCRYPTED_DNS_UNKNOWN'];

/** Maps backend state vocabularies onto chip tones; unrecognised states are never shown as positive. */
export function toneForState(state: string | null | undefined): StatusTone {
  if (!state) return 'unknown';
  const normalized = state.toUpperCase();
  if (POSITIVE.includes(normalized)) return 'positive';
  if (CRITICAL.includes(normalized)) return 'critical';
  if (WARNING.includes(normalized)) return 'warning';
  if (UNKNOWN.includes(normalized)) return 'unknown';
  return 'neutral';
}
