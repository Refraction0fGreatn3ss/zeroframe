import type { InactivityPolicyKey, LoginCredentials, OperatorIdentity, OperatorSessionRecord } from '../types/session';
import { apiClient } from './api-client';

export type { OperatorIdentity, OperatorSessionRecord } from '../types/session';

export interface SessionValidationResult {
  valid: boolean;
  session: OperatorSessionRecord;
  operator: OperatorIdentity;
}

export interface StepUpResult {
  success: boolean;
  message: string;
  stepUpExpiresAt: string;
}

export interface UnlockResult {
  unlocked: boolean;
  unlockedAt: string;
}

export interface SessionPingResult {
  valid: boolean;
  serverTime: string;
  policy: string;
  inactivityTimeoutMs: number;
  remainingInactivityMs: number;
}

export interface PolicyUpdateResult {
  success: boolean;
  policy: string;
  inactivityTimeoutMs: number;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<OperatorSessionRecord> {
    const res = await apiClient.post<{ session: OperatorSessionRecord }>('/auth/login', credentials, {
      skipAuth: true,
    });
    apiClient.setToken(res.data.session.token);
    return res.data.session;
  },

  async getSession(): Promise<SessionValidationResult> {
    const res = await apiClient.get<SessionValidationResult>('/auth/session');
    return res.data;
  },

  async stepUpMfa(code: string): Promise<StepUpResult> {
    const res = await apiClient.post<StepUpResult>('/auth/step-up', { code });
    return res.data;
  },

  async unlockSession(pin: string): Promise<UnlockResult> {
    const res = await apiClient.post<UnlockResult>('/auth/unlock', { pin });
    return res.data;
  },

  async ping(): Promise<SessionPingResult> {
    const res = await apiClient.post<SessionPingResult>('/auth/ping');
    return res.data;
  },

  async setPolicy(policy: InactivityPolicyKey): Promise<PolicyUpdateResult> {
    const res = await apiClient.post<PolicyUpdateResult>('/auth/policy', { policy });
    return res.data;
  },

  async logout(reason: string = 'OPERATOR_SIGN_OUT'): Promise<void> {
    try {
      await apiClient.post('/auth/logout', { reason });
    } catch {
      // Local revocation proceeds even when the server is unreachable.
    } finally {
      apiClient.setToken(null);
    }
  },

  async listActiveSessions(): Promise<OperatorSessionRecord[]> {
    const res = await apiClient.get<{ sessions: OperatorSessionRecord[] }>('/auth/sessions');
    return res.data.sessions;
  },

  async revokeSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/auth/sessions/${sessionId}`);
  },
};
