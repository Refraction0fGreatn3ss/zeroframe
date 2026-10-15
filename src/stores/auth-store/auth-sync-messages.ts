import { AUTH_STORAGE_KEYS } from './auth-storage';
import { type InactivityPolicyKey, isInactivityPolicy } from './inactivity-policy';

export type AuthSyncMessage =
  | { type: 'ACTIVITY_SYNC'; timestamp: number }
  | { type: 'WARNING_ACK'; timestamp?: number }
  | { type: 'FORCE_LOGOUT'; reason?: string; timestamp?: number }
  | { type: 'POLICY_SYNC'; policy: InactivityPolicyKey; timestamp?: number }
  | { type: 'LOCK_STATE_SYNC'; isLocked: boolean }
  | { type: 'SHIELD_SYNC'; active: boolean };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function parseAuthSyncMessage(data: unknown): AuthSyncMessage | null {
  if (!isRecord(data)) return null;

  switch (data.type) {
    case 'ACTIVITY_SYNC':
      return typeof data.timestamp === 'number' ? { type: 'ACTIVITY_SYNC', timestamp: data.timestamp } : null;
    case 'FORCE_LOGOUT':
      return { type: 'FORCE_LOGOUT', reason: typeof data.reason === 'string' ? data.reason : undefined };
    case 'WARNING_ACK':
      return { type: 'WARNING_ACK' };
    case 'POLICY_SYNC':
      return isInactivityPolicy(data.policy) ? { type: 'POLICY_SYNC', policy: data.policy } : null;
    case 'LOCK_STATE_SYNC':
      return typeof data.isLocked === 'boolean' ? { type: 'LOCK_STATE_SYNC', isLocked: data.isLocked } : null;
    case 'SHIELD_SYNC':
      return typeof data.active === 'boolean' ? { type: 'SHIELD_SYNC', active: data.active } : null;
    default:
      return null;
  }
}

// The localStorage 'storage' event is a fallback bus for browsers without BroadcastChannel.
export function storageChangeToSyncMessage(key: string | null, newValue: string | null): AuthSyncMessage | null {
  if (key === AUTH_STORAGE_KEYS.forceLogout && newValue) {
    return { type: 'FORCE_LOGOUT' };
  }

  if (key === AUTH_STORAGE_KEYS.lastActivity && newValue) {
    const timestamp = parseInt(newValue, 10);
    return Number.isNaN(timestamp) ? null : { type: 'ACTIVITY_SYNC', timestamp };
  }

  if (key === AUTH_STORAGE_KEYS.policy && isInactivityPolicy(newValue)) {
    return { type: 'POLICY_SYNC', policy: newValue };
  }

  if (key === AUTH_STORAGE_KEYS.lockState && newValue !== null) {
    return { type: 'LOCK_STATE_SYNC', isLocked: newValue === 'true' };
  }

  return null;
}
