import { apiClient } from '../../services/api-client';
import { authService } from '../../services/auth-service';
import type { InactivityPolicyKey } from '../../types/session';
import { authStore } from './auth-state';
import { publishForceLogout, wipeSessionArtifacts } from './auth-storage';
import { postAuthSyncMessage } from './cross-tab-sync';

function buildAutoLogoutMessage(policy: InactivityPolicyKey): string {
  return `Session terminated: You have been automatically logged out pursuant to the ${policy} enterprise inactivity policy. All keys and memory caches were destroyed with zero remanence.`;
}

export function announceForceLogout(reason: string): void {
  postAuthSyncMessage({ type: 'FORCE_LOGOUT', reason, timestamp: Date.now() });
  publishForceLogout(reason);
}

export function revokeLocalSession(reason: string, isAutoLogout: boolean = true): void {
  apiClient.abortAll();
  wipeSessionArtifacts();
  apiClient.setToken(null);

  authStore.setState((state) => ({
    status: 'UNAUTHENTICATED',
    isAuthenticated: false,
    session: null,
    operator: null,
    isLocked: false,
    isLoading: false,
    isWarningOpen: false,
    isPrivacyShieldActive: false,
    isAutoLoggedOut: isAutoLogout,
    autoLogoutReason: reason,
    authError: isAutoLogout ? buildAutoLogoutMessage(state.inactivityPolicy) : null,
  }));
}

let autoLogoutInProgress = false;

export async function triggerAutoLogout(reason: string = 'INACTIVITY_TIMEOUT') {
  if (!authStore.getState().isAuthenticated || autoLogoutInProgress) return;

  autoLogoutInProgress = true;
  authStore.setState({ isLoading: true });
  announceForceLogout(reason);

  try {
    await authService.logout(reason);
  } catch (err) {
    console.warn('[AuthStore] Auto-logout backend error:', err);
  } finally {
    revokeLocalSession(reason, true);
    autoLogoutInProgress = false;
  }
}
