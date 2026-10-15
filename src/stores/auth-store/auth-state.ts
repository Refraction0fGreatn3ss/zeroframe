import { createStore } from '../../lib/create-store';
import type { LoadIssue } from '../../lib/load-state';
import type { OperatorIdentity, OperatorSessionRecord } from '../../types/session';
import { readStoredLastActivity, readStoredPolicy } from './auth-storage';
import {
  INACTIVITY_POLICY_MAP,
  type InactivityPolicyKey,
  WARNING_COUNTDOWN_SECONDS,
  WARNING_THRESHOLD_MS,
} from './inactivity-policy';

export type AuthStatus = 'INITIALIZING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

export interface AuthState {
  status: AuthStatus;
  bootIssue: LoadIssue | null;
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
    status: 'INITIALIZING',
    bootIssue: null,
    isAuthenticated: false,
    isLoading: false,
    session: null,
    operator: null,
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
