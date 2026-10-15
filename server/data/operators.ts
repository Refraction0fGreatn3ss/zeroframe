import { HOUR_MS } from '../config.ts';
import type { OperatorIdentity, OperatorSession } from '../types/session.ts';

export const LEAD_OPERATOR: OperatorIdentity = {
  id: 'op-8841',
  username: 'sec-operator',
  displayName: 'Sarah Chen, CISSP',
  email: 's.chen@zeroframe.enterprise',
  role: 'Tier 3 Lead Incident Commander',
  clearanceLevel: 'TOP_SECRET / RESTRICTED_OT',
};

export const LEAD_OPERATOR_PERMISSIONS = [
  'READ_TELEMETRY',
  'EXECUTE_CONTAINMENT',
  'APPROVE_PERMIT',
  'MANAGE_SENSORS',
  'EXPORT_PCAP',
  'ADMIN_AUDIT',
  'STEP_UP_AUTHORIZED',
];

export const SSO_OPERATOR: OperatorIdentity = {
  id: 'op-sso-901',
  username: 'sso.operator',
  displayName: 'Alex Morgan (Okta SSO)',
  email: 'a.morgan@zeroframe.enterprise',
  role: 'Tier 2 Senior Investigator',
  clearanceLevel: 'SECRET / SOC_ANALYST',
};

export const SSO_OPERATOR_PERMISSIONS = ['READ_TELEMETRY', 'EXECUTE_CONTAINMENT', 'EXPORT_PCAP'];

export const KNOWN_OPERATOR_USERNAMES = new Set(['sec-operator', 'admin', 's.chen']);

export const DEV_SEED_TOKEN = 'zf-session-tok-prod-8841-lead';

export function createDevSeedSession(): OperatorSession {
  const now = Date.now();
  return {
    sessionId: 'sess-8841-alpha',
    token: DEV_SEED_TOKEN,
    operator: LEAD_OPERATOR,
    permissions: LEAD_OPERATOR_PERMISSIONS,
    mfaVerified: true,
    stepUpRequired: false,
    createdAt: new Date(now - 3 * HOUR_MS).toISOString(),
    expiresAt: new Date(now + 12 * HOUR_MS).toISOString(),
    lastActiveAt: new Date(now).toISOString(),
    ipAddress: '10.200.1.42',
    userAgent: 'ZeroFrame Workstation SecOS/14.2',
    deviceLabel: 'SecOps-Console-01 (HQ SOC Floor)',
  };
}
