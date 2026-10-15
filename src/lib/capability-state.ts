import type { BackendCapability, CapabilityManifest } from '../services/capability-service';
import type { LoadState } from './load-state';

export type CapabilityState = 'LOADING' | 'SUPPORTED' | 'UNSUPPORTED' | 'UNAVAILABLE' | 'UNKNOWN' | 'STALE';

const SUPPORTED_STATUSES = new Set(['FRESH', 'AVAILABLE', 'SUPPORTED', 'HEALTHY', 'ENABLED']);
const UNAVAILABLE_STATUSES = new Set(['DEGRADED', 'UNAVAILABLE', 'FAILED', 'DISABLED']);
const UNSUPPORTED_STATUSES = new Set(['UNSUPPORTED', 'NOT_SUPPORTED', 'NOT_LICENSED']);

function stateForCapability(capability: BackendCapability): CapabilityState {
  const status = capability.status.toUpperCase();
  if (SUPPORTED_STATUSES.has(status)) return 'SUPPORTED';
  if (UNAVAILABLE_STATUSES.has(status)) return 'UNAVAILABLE';
  if (UNSUPPORTED_STATUSES.has(status)) return 'UNSUPPORTED';
  if (status === 'STALE') return 'STALE';
  return 'UNKNOWN';
}

/** A failed manifest request never implies UNSUPPORTED: absence of evidence is UNKNOWN. */
export function resolveCapabilityState(
  capabilityId: string,
  manifest: CapabilityManifest | null,
  manifestLoadState: LoadState,
): CapabilityState {
  if (manifestLoadState === 'IDLE' || (manifestLoadState === 'LOADING' && !manifest)) return 'LOADING';
  if (!manifest) return 'UNKNOWN';

  const capability = manifest.capabilities.find((candidate) => candidate.id === capabilityId);
  if (!capability) return manifestLoadState === 'STALE' ? 'STALE' : 'UNSUPPORTED';

  const state = stateForCapability(capability);
  return manifestLoadState === 'STALE' && state === 'SUPPORTED' ? 'STALE' : state;
}

export function isNavigable(state: CapabilityState): boolean {
  return state !== 'UNSUPPORTED';
}
