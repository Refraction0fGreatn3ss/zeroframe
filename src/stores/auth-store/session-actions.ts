import { getErrorMessage } from '../../lib/error-message';
import { getErrorStatus } from '../../services/api-error';
import { authService } from '../../services/auth-service';
import type { LoginCredentials } from '../../types/session';
import { resetInactivityTimer } from './activity-tracking';
import { authStore } from './auth-state';
import { persistLockState } from './auth-storage';
import { postAuthSyncMessage } from './cross-tab-sync';
import { announceForceLogout, revokeLocalSession } from './session-termination';

const OPERATOR_SIGN_OUT = 'OPERATOR_SIGN_OUT';
const HTTP_UNAUTHORIZED = 401;

function shareLockState(isLocked: boolean): void {
  postAuthSyncMessage({ type: 'LOCK_STATE_SYNC', isLocked });
  persistLockState(isLocked);
}

export async function validateSession() {
  authStore.setState({ isLoading: true });
  try {
    const { session, operator } = await authService.getSession();
    authStore.setState({
      isAuthenticated: true,
      session,
      operator,
      isStepUpRequired: session.stepUpRequired,
      authError: null,
    });
    resetInactivityTimer();
  } catch (err) {
    if (getErrorStatus(err) === HTTP_UNAUTHORIZED) {
      authStore.setState({ isAuthenticated: false, session: null });
    }
  } finally {
    authStore.setState({ isLoading: false });
  }
}

export async function login(credentials: LoginCredentials): Promise<boolean> {
  authStore.setState({ isLoading: true, authError: null, isAutoLoggedOut: false, autoLogoutReason: null });
  try {
    const session = await authService.login(credentials);
    authStore.setState({
      isAuthenticated: true,
      session,
      operator: session.operator,
      isLocked: false,
      isStepUpRequired: session.stepUpRequired,
    });
    resetInactivityTimer();
    return true;
  } catch (err) {
    authStore.setState({ authError: getErrorMessage(err, 'Authentication failed.') });
    return false;
  } finally {
    authStore.setState({ isLoading: false });
  }
}

export async function logout() {
  authStore.setState({ isLoading: true });
  announceForceLogout(OPERATOR_SIGN_OUT);
  try {
    await authService.logout(OPERATOR_SIGN_OUT);
  } finally {
    revokeLocalSession(OPERATOR_SIGN_OUT, false);
  }
}

export async function unlock(pin: string): Promise<boolean> {
  try {
    const { unlocked } = await authService.unlockSession(pin);
    if (!unlocked) return false;

    authStore.setState({ isLocked: false, isPrivacyShieldActive: false });
    resetInactivityTimer();
    shareLockState(false);
    return true;
  } catch {
    return false;
  }
}

export function lock() {
  authStore.setState({ isLocked: true, isPrivacyShieldActive: false });
  shareLockState(true);
}

export async function stepUpMfa(code: string): Promise<boolean> {
  try {
    const { success } = await authService.stepUpMfa(code);
    if (!success) return false;

    authStore.setState({ isStepUpRequired: false });
    resetInactivityTimer();
    return true;
  } catch {
    return false;
  }
}

export async function refreshActiveSessions() {
  try {
    const activeSessions = await authService.listActiveSessions();
    authStore.setState({ activeSessions });
  } catch {
    // Keep the last known list when the server is unreachable.
  }
}

export async function revokeRemoteSession(sessionId: string) {
  try {
    await authService.revokeSession(sessionId);
    await refreshActiveSessions();
  } catch {
    // Revocation failures leave the list unchanged; the operator can retry.
  }
}
