export type InactivityPolicyKey = '5m' | '10m' | '15m';

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

export interface LoginCredentials {
  username?: string;
  password?: string;
  ssoProvider?: string;
}
