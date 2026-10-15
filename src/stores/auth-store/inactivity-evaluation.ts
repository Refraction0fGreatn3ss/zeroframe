import type { AuthState } from './auth-state';
import { MS_PER_SECOND, WARNING_COUNTDOWN_SECONDS } from './inactivity-policy';

type InactivityInputs = Pick<
  AuthState,
  | 'lastActivityTimestamp'
  | 'inactivityTimeoutMs'
  | 'warningThresholdMs'
  | 'isWarningOpen'
  | 'warningRemainingSeconds'
  | 'isPrivacyShieldActive'
>;

export type InactivityEvaluation =
  | { kind: 'EXPIRED' }
  | { kind: 'UPDATE'; patch: Partial<AuthState> }
  | { kind: 'UNCHANGED' };

export const WARNING_DISMISSED_PATCH = {
  isWarningOpen: false,
  warningRemainingSeconds: WARNING_COUNTDOWN_SECONDS,
} satisfies Partial<AuthState>;

const UNCHANGED: InactivityEvaluation = { kind: 'UNCHANGED' };

export function computeRemainingInactivityMs(
  state: Pick<AuthState, 'lastActivityTimestamp' | 'inactivityTimeoutMs'>,
  now: number,
): number {
  return state.inactivityTimeoutMs - (now - state.lastActivityTimestamp);
}

function buildWarningPatch(state: InactivityInputs, remainingMs: number): Partial<AuthState> {
  const remainingSeconds = Math.max(1, Math.ceil(remainingMs / MS_PER_SECOND));
  const patch: Partial<AuthState> = {};
  if (!state.isWarningOpen) patch.isWarningOpen = true;
  if (state.warningRemainingSeconds !== remainingSeconds) patch.warningRemainingSeconds = remainingSeconds;
  // The privacy shield engages automatically once the session enters the warning window.
  if (!state.isPrivacyShieldActive) patch.isPrivacyShieldActive = true;
  return patch;
}

export function evaluateInactivity(state: InactivityInputs, now: number): InactivityEvaluation {
  const remainingMs = computeRemainingInactivityMs(state, now);

  if (remainingMs <= 0) {
    return { kind: 'EXPIRED' };
  }

  if (remainingMs > state.warningThresholdMs) {
    return state.isWarningOpen ? { kind: 'UPDATE', patch: WARNING_DISMISSED_PATCH } : UNCHANGED;
  }

  const patch = buildWarningPatch(state, remainingMs);
  return Object.keys(patch).length > 0 ? { kind: 'UPDATE', patch } : UNCHANGED;
}
