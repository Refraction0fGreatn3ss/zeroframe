/**
 * ZeroFrame Authentication & Operator Session Service
 * 
 * Provides:
 * - Credentials & SSO Login
 * - Current Session & Operator Validation
 * - Step-Up MFA Challenge Elevation
 * - Idle Lock / Pin Unlock
 * - Active Sessions Discovery & Remote Revocation
 * - Logout
 */

import { apiClient, ApiResponse } from './api-client';

export interface OperatorIdentity {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: string;
  clearanceLevel: string;
  avatarUrl?: string;
}

export interface OperatorSessionRecord {
  sessionId: string;
  token: string;
  operator: OperatorIdentity;
  permissions: string[];
  mfaVerified: boolean;
  stepUpRequired: boolean;
  stepUpExpiresAt?: string;
  createdAt: string;
  expiresAt: string;
  lastActiveAt: string;
  ipAddress: string;
  userAgent: string;
  deviceLabel: string;
  isCurrent?: boolean;
}

export const authService = {
  async login(credentials: { username?: string; password?: string; ssoProvider?: string }): Promise<OperatorSessionRecord> {
    const res = await apiClient.post<{ session: OperatorSessionRecord }>('/auth/login', credentials, { skipAuth: true });
    apiClient.setToken(res.data.session.token);
    return res.data.session;
  },

  async getSession(): Promise<{ valid: boolean; session: OperatorSessionRecord; operator: OperatorIdentity }> {
    const res = await apiClient.get<{ valid: boolean; session: OperatorSessionRecord; operator: OperatorIdentity }>('/auth/session');
    return res.data;
  },

  async stepUpMfa(code: string): Promise<{ success: boolean; message: string; stepUpExpiresAt: string }> {
    const res = await apiClient.post<{ success: boolean; message: string; stepUpExpiresAt: string }>('/auth/step-up', { code });
    return res.data;
  },

  async unlockSession(pin: string): Promise<{ unlocked: boolean; unlockedAt: string }> {
    const res = await apiClient.post<{ unlocked: boolean; unlockedAt: string }>('/auth/unlock', { pin });
    return res.data;
  },

  async ping(): Promise<{ valid: boolean; serverTime: string; policy: string; inactivityTimeoutMs: number; remainingInactivityMs: number }> {
    const res = await apiClient.post<{ valid: boolean; serverTime: string; policy: string; inactivityTimeoutMs: number; remainingInactivityMs: number }>('/auth/ping');
    return res.data;
  },

  async setPolicy(policy: '5m' | '10m' | '15m'): Promise<{ success: boolean; policy: string; inactivityTimeoutMs: number }> {
    const res = await apiClient.post<{ success: boolean; policy: string; inactivityTimeoutMs: number }>('/auth/policy', { policy });
    return res.data;
  },

  async logout(reason: string = 'OPERATOR_SIGN_OUT'): Promise<void> {
    try {
      await apiClient.post('/auth/logout', { reason });
    } catch {
      // ignore
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
