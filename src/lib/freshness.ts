import type { LoadState } from './load-state';

export type Freshness = 'FRESH' | 'AGING' | 'STALE' | 'UNKNOWN' | 'UNAVAILABLE';

export interface FreshnessPolicy {
  agingAfterMs: number;
  staleAfterMs: number;
}

export const DEFAULT_FRESHNESS_POLICY: FreshnessPolicy = {
  agingAfterMs: 60_000,
  staleAfterMs: 5 * 60_000,
};

const UNAVAILABLE_LOAD_STATES = new Set<LoadState>(['UNAVAILABLE', 'ERROR', 'PERMISSION_DENIED', 'NOT_SUPPORTED']);

export function computeFreshness(
  lastUpdated: string | null,
  policy: FreshnessPolicy = DEFAULT_FRESHNESS_POLICY,
  loadState?: LoadState,
  now: number = Date.now(),
): Freshness {
  if (loadState && UNAVAILABLE_LOAD_STATES.has(loadState)) return 'UNAVAILABLE';
  if (loadState === 'STALE') return 'STALE';
  if (!lastUpdated) return 'UNKNOWN';

  const updatedAt = Date.parse(lastUpdated);
  if (Number.isNaN(updatedAt)) return 'UNKNOWN';

  const age = now - updatedAt;
  if (age >= policy.staleAfterMs) return 'STALE';
  if (age >= policy.agingAfterMs) return 'AGING';
  return 'FRESH';
}
