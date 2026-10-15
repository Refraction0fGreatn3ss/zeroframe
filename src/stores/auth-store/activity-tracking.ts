import { authService } from '../../services/auth-service';
import { authStore } from './auth-state';
import { persistLastActivity } from './auth-storage';
import { postAuthSyncMessage } from './cross-tab-sync';
import { computeRemainingInactivityMs, evaluateInactivity, WARNING_DISMISSED_PATCH } from './inactivity-evaluation';
import { triggerAutoLogout } from './session-termination';

function shareActivity(timestamp: number): void {
  persistLastActivity(timestamp);
  postAuthSyncMessage({ type: 'ACTIVITY_SYNC', timestamp });
}

export function resetInactivityTimer() {
  const now = Date.now();
  shareActivity(now);
  authStore.setState((state) => ({
    lastActivityTimestamp: now,
    ...(state.isWarningOpen ? WARNING_DISMISSED_PATCH : {}),
  }));
}

export async function acknowledgeActivity() {
  const now = Date.now();
  shareActivity(now);
  postAuthSyncMessage({ type: 'WARNING_ACK', timestamp: now });
  authStore.setState({
    lastActivityTimestamp: now,
    ...WARNING_DISMISSED_PATCH,
    isPrivacyShieldActive: false,
  });

  try {
    await authService.ping();
  } catch {
    // The local extension stands; the server session is re-checked on the next request.
  }
}

export function evaluateInactivityState() {
  const state = authStore.getState();
  if (!state.isAuthenticated) return;

  const evaluation = evaluateInactivity(state, Date.now());
  if (evaluation.kind === 'EXPIRED') {
    triggerAutoLogout('INACTIVITY_TIMEOUT');
  } else if (evaluation.kind === 'UPDATE') {
    authStore.setState(evaluation.patch);
  }
}

export function getRemainingInactivityMs(): number {
  return Math.max(0, computeRemainingInactivityMs(authStore.getState(), Date.now()));
}
