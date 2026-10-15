import { useStore } from '../lib/create-store';
import { apiClient } from '../services/api-client';
import {
  acknowledgeActivity,
  evaluateInactivityState,
  getRemainingInactivityMs,
  resetInactivityTimer,
} from './auth-store/activity-tracking';
import { authStore } from './auth-store/auth-state';
import { listenForAuthSync } from './auth-store/cross-tab-sync';
import { startInactivityMonitor } from './auth-store/inactivity-monitor';
import {
  setAutoShieldOnBackground,
  setInactivityPolicy,
  shieldIfBackgrounded,
  togglePrivacyShield,
} from './auth-store/preference-actions';
import {
  lock,
  login,
  logout,
  refreshActiveSessions,
  revokeRemoteSession,
  stepUpMfa,
  unlock,
  validateSession,
} from './auth-store/session-actions';
import { revokeLocalSession, triggerAutoLogout } from './auth-store/session-termination';
import { applyAuthSyncMessage } from './auth-store/sync-message-handler';

export type { AuthState, AuthStatus } from './auth-store/auth-state';
export { authStore } from './auth-store/auth-state';
export type { InactivityPolicyKey } from './auth-store/inactivity-policy';
export { INACTIVITY_POLICY_MAP, WARNING_THRESHOLD_MS } from './auth-store/inactivity-policy';
export { revokeLocalSession } from './auth-store/session-termination';
export {
  acknowledgeActivity,
  getRemainingInactivityMs,
  lock,
  login,
  logout,
  refreshActiveSessions,
  resetInactivityTimer,
  revokeRemoteSession,
  setAutoShieldOnBackground,
  setInactivityPolicy,
  stepUpMfa,
  togglePrivacyShield,
  triggerAutoLogout,
  unlock,
  validateSession,
};

startInactivityMonitor({
  isSessionActive: () => authStore.getState().isAuthenticated,
  onUserActivity: resetInactivityTimer,
  onEvaluate: evaluateInactivityState,
  onBackgrounded: shieldIfBackgrounded,
});

listenForAuthSync(applyAuthSyncMessage);

// A 401 from any request means the server already expired this session (e.g. server-side inactivity).
apiClient.onUnauthenticated(() => {
  if (authStore.getState().isAuthenticated) revokeLocalSession('SERVER_SESSION_EXPIRED', true);
});

export const authActions = {
  login,
  logout,
  autoLogout: triggerAutoLogout,
  acknowledgeActivity,
  extendSession: acknowledgeActivity,
  resetInactivityTimer,
  setInactivityPolicy,
  togglePrivacyShield,
  setAutoShieldOnBackground,
  getRemainingInactivityMs,
  validateSession,
  unlock,
  lock,
  stepUpMfa,
  refreshActiveSessions,
  revokeRemoteSession,
};

export function useAuthStore() {
  return { ...useStore(authStore), ...authActions };
}
