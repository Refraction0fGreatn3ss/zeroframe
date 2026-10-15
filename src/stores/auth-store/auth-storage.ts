import { DEFAULT_INACTIVITY_POLICY, type InactivityPolicyKey, isInactivityPolicy } from './inactivity-policy';

export const AUTH_STORAGE_KEYS = {
  lastActivity: 'zf_session_last_activity',
  forceLogout: 'zf_session_force_logout',
  lockState: 'zf_session_lock_state',
  policy: 'zf_inactivity_policy',
  privacyShield: 'zf_privacy_shield_state',
} as const;

const LEGACY_SESSION_TOKEN_KEY = 'zf_session_token';
const ENTROPY_WIPE_KEY = 'zf_entropy_wipe';
const ENTROPY_WIPE_BYTES = 64;

function writeLocal(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable; cross-tab sync degrades to BroadcastChannel only.
  }
}

export function readStoredPolicy(): InactivityPolicyKey {
  if (typeof window === 'undefined') return DEFAULT_INACTIVITY_POLICY;
  try {
    const storedPolicy = localStorage.getItem(AUTH_STORAGE_KEYS.policy);
    if (isInactivityPolicy(storedPolicy)) {
      return storedPolicy;
    }
  } catch {
    // Storage unavailable; use the default policy.
  }
  return DEFAULT_INACTIVITY_POLICY;
}

export function parseActivityTimestamp(raw: string | null, now: number): number | null {
  if (!raw) return null;
  const timestamp = parseInt(raw, 10);
  return !Number.isNaN(timestamp) && timestamp > 0 && timestamp <= now ? timestamp : null;
}

export function readStoredLastActivity(): number {
  const now = Date.now();
  if (typeof window === 'undefined') return now;
  try {
    return parseActivityTimestamp(localStorage.getItem(AUTH_STORAGE_KEYS.lastActivity), now) ?? now;
  } catch {
    return now;
  }
}

export function persistLastActivity(timestamp: number): void {
  writeLocal(AUTH_STORAGE_KEYS.lastActivity, String(timestamp));
}

export function persistPolicy(policy: InactivityPolicyKey): void {
  writeLocal(AUTH_STORAGE_KEYS.policy, policy);
}

export function persistLockState(isLocked: boolean): void {
  writeLocal(AUTH_STORAGE_KEYS.lockState, String(isLocked));
}

export function publishForceLogout(reason: string): void {
  writeLocal(AUTH_STORAGE_KEYS.forceLogout, `${Date.now()}:${reason}`);
}

function overwriteWithEntropy(): void {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.getRandomValues) return;
  try {
    const entropy = new Uint8Array(ENTROPY_WIPE_BYTES);
    window.crypto.getRandomValues(entropy);
    sessionStorage.setItem(ENTROPY_WIPE_KEY, Array.from(entropy).join(''));
  } catch {
    // Best effort; the storage is cleared next regardless.
  }
}

export function wipeSessionArtifacts(): void {
  overwriteWithEntropy();
  try {
    sessionStorage.clear();
    localStorage.removeItem(LEGACY_SESSION_TOKEN_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEYS.lastActivity);
    localStorage.removeItem(AUTH_STORAGE_KEYS.lockState);
    localStorage.removeItem(AUTH_STORAGE_KEYS.privacyShield);
  } catch {
    // Storage unavailable; in-memory state is still reset by the caller.
  }
}
