import { authService } from '../../services/auth-service';
import { authStore } from './auth-state';
import { persistPolicy } from './auth-storage';
import { postAuthSyncMessage } from './cross-tab-sync';
import { INACTIVITY_POLICY_MAP, type InactivityPolicyKey, isInactivityPolicy } from './inactivity-policy';

export async function setInactivityPolicy(policy: InactivityPolicyKey) {
  if (!isInactivityPolicy(policy)) return;

  authStore.setState({ inactivityPolicy: policy, inactivityTimeoutMs: INACTIVITY_POLICY_MAP[policy] });
  persistPolicy(policy);
  postAuthSyncMessage({ type: 'POLICY_SYNC', policy, timestamp: Date.now() });

  try {
    await authService.setPolicy(policy);
  } catch (err) {
    console.warn('[AuthStore] Failed syncing policy with backend authority:', err);
  }
}

export function togglePrivacyShield(active?: boolean) {
  const isPrivacyShieldActive = typeof active === 'boolean' ? active : !authStore.getState().isPrivacyShieldActive;
  postAuthSyncMessage({ type: 'SHIELD_SYNC', active: isPrivacyShieldActive });
  authStore.setState({ isPrivacyShieldActive });
}

export function setAutoShieldOnBackground(enabled: boolean) {
  authStore.setState({ autoShieldOnBackground: enabled });
}

export function shieldIfBackgrounded() {
  const { autoShieldOnBackground, isAuthenticated } = authStore.getState();
  if (autoShieldOnBackground && isAuthenticated) {
    authStore.setState({ isPrivacyShieldActive: true });
  }
}
