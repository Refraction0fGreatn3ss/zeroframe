import { authStore } from './auth-state';
import type { AuthSyncMessage } from './auth-sync-messages';
import { WARNING_DISMISSED_PATCH } from './inactivity-evaluation';
import { INACTIVITY_POLICY_MAP } from './inactivity-policy';
import { revokeLocalSession } from './session-termination';

export function applyAuthSyncMessage(message: AuthSyncMessage) {
  switch (message.type) {
    case 'ACTIVITY_SYNC':
      authStore.setState((state) => ({
        lastActivityTimestamp: Math.max(state.lastActivityTimestamp, message.timestamp),
        ...(state.isWarningOpen ? WARNING_DISMISSED_PATCH : {}),
      }));
      return;
    case 'FORCE_LOGOUT':
      revokeLocalSession(message.reason || 'INACTIVITY_TIMEOUT', true);
      return;
    case 'WARNING_ACK':
      authStore.setState({ ...WARNING_DISMISSED_PATCH, isPrivacyShieldActive: false });
      return;
    case 'POLICY_SYNC':
      authStore.setState({
        inactivityPolicy: message.policy,
        inactivityTimeoutMs: INACTIVITY_POLICY_MAP[message.policy],
      });
      return;
    case 'LOCK_STATE_SYNC':
      authStore.setState({ isLocked: message.isLocked });
      return;
    case 'SHIELD_SYNC':
      authStore.setState({ isPrivacyShieldActive: message.active });
      return;
  }
}
