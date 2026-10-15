import { DEFAULT_OPERATOR } from '../../data/default-operator.data';
import { createStore } from '../../lib/create-store';
import type { OperatorIdentity, OperatorSessionRecord } from '../../types/session';
import { readStoredLastActivity, readStoredPolicy } from './auth-storage';
import {
  INACTIVITY_POLICY_MAP,
  type InactivityPolicyKey,
  WARNING_COUNTDOWN_SECONDS,
  WARNING_THRESHOLD_MS,
} from './inactivity-policy';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  session: OperatorSessionRecord | null;
  operator: OperatorIdentity | null;
  isLocked: boolean;
  isStepUpRequired: boolean;
  activeSessions: OperatorSessionRecord[];
  authError: string | null;
  lastActivityTimestamp: number;
  isAutoLoggedOut: boolean;
  autoLogoutReason: string | null;
  isWarningOpen: boolean;
  warningRemainingSeconds: number;
  inactivityPolicy: InactivityPolicyKey;
  inactivityTimeoutMs: number;
  warningThresholdMs: number;
  isPrivacyShieldActive: boolean;
  autoShieldOnBackground: boolean;
}

function createInitialAuthState(): AuthState {
  const inactivityPolicy = readStoredPolicy();
  return {
    // Optimistically authenticated; App validates the session against the server on mount.
    isAuthenticated: true,
    isLoading: false,
    session: null,
    operator: DEFAULT_OPERATOR,
    isLocked: false,
    isStepUpRequired: false,
    activeSessions: [],
    authError: null,
    lastActivityTimestamp: readStoredLastActivity(),
    isAutoLoggedOut: false,
    autoLogoutReason: null,
    isWarningOpen: false,
    warningRemainingSeconds: WARNING_COUNTDOWN_SECONDS,
    inactivityPolicy,
    inactivityTimeoutMs: INACTIVITY_POLICY_MAP[inactivityPolicy],
    warningThresholdMs: WARNING_THRESHOLD_MS,
    isPrivacyShieldActive: false,
    autoShieldOnBackground: true,
  };
}

export const authStore = createStore<AuthState>(createInitialAuthState());
