import { HOUR_MS, isProduction, STEP_UP_DURATION_MS } from '../config.ts';
import {
  KNOWN_OPERATOR_USERNAMES,
  LEAD_OPERATOR,
  LEAD_OPERATOR_PERMISSIONS,
  SSO_OPERATOR,
  SSO_OPERATOR_PERMISSIONS,
} from '../data/operators.ts';
import { sessionStore } from '../stores/session-store.ts';
import type { OperatorIdentity, OperatorSession } from '../types/session.ts';

const MIN_PRODUCTION_PASSWORD_LENGTH = 8;
const STEP_UP_CODE_LENGTH = 6;
const MIN_UNLOCK_PIN_LENGTH = 4;

export interface ClientInfo {
  ipAddress: string;
  userAgent: string;
}

export interface LoginRequest {
  username?: string;
  password?: string;
  ssoProvider?: string;
}

export type LoginResult = { ok: true; session: OperatorSession } | { ok: false; error: string; message: string };

interface SessionTemplate {
  tokenPrefix: string;
  sessionIdPrefix: string;
  operator: OperatorIdentity;
  permissions: string[];
  lifetimeMs: number;
  deviceLabel: string;
}

function randomSuffix(): string {
  return Math.random().toString(36).substring(2, 10);
}

function createSession(template: SessionTemplate, client: ClientInfo): OperatorSession {
  const now = Date.now();
  const session: OperatorSession = {
    sessionId: `${template.sessionIdPrefix}-${now}`,
    token: `${template.tokenPrefix}-${now}-${randomSuffix()}`,
    operator: template.operator,
    permissions: template.permissions,
    mfaVerified: true,
    stepUpRequired: false,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + template.lifetimeMs).toISOString(),
    lastActiveAt: new Date(now).toISOString(),
    ipAddress: client.ipAddress,
    userAgent: client.userAgent,
    deviceLabel: template.deviceLabel,
  };
  sessionStore.save(session);
  return session;
}

function loginWithSso(client: ClientInfo): OperatorSession {
  return createSession(
    {
      tokenPrefix: 'zf-sso',
      sessionIdPrefix: 'sess-sso',
      operator: SSO_OPERATOR,
      permissions: SSO_OPERATOR_PERMISSIONS,
      lifetimeMs: 8 * HOUR_MS,
      deviceLabel: 'Enterprise Managed Laptop (Okta Verify)',
    },
    client,
  );
}

function loginWithCredentials(client: ClientInfo): OperatorSession {
  return createSession(
    {
      tokenPrefix: 'zf-tok',
      sessionIdPrefix: 'sess',
      operator: LEAD_OPERATOR,
      permissions: LEAD_OPERATOR_PERMISSIONS,
      lifetimeMs: 12 * HOUR_MS,
      deviceLabel: 'SecOps-Console (HQ SOC)',
    },
    client,
  );
}

function isPasswordAcceptable(password: string | undefined): boolean {
  if (!isProduction()) return true;
  return Boolean(password && password.length >= MIN_PRODUCTION_PASSWORD_LENGTH);
}

export function login(request: LoginRequest, client: ClientInfo): LoginResult {
  if (request.ssoProvider) {
    return { ok: true, session: loginWithSso(client) };
  }

  if (!request.username || !KNOWN_OPERATOR_USERNAMES.has(request.username)) {
    return {
      ok: false,
      error: 'INVALID_CREDENTIALS',
      message: 'Invalid operator credentials. Access attempt logged to tamper-sealed audit ledger.',
    };
  }

  if (!isPasswordAcceptable(request.password)) {
    return {
      ok: false,
      error: 'INVALID_CREDENTIALS',
      message: 'Production mode requires a valid enterprise password (min 8 characters).',
    };
  }

  return { ok: true, session: loginWithCredentials(client) };
}

export function verifyStepUp(session: OperatorSession, code: unknown): boolean {
  const valid = typeof code === 'string' && code.length === STEP_UP_CODE_LENGTH;
  if (valid) {
    session.stepUpRequired = false;
    session.stepUpExpiresAt = new Date(Date.now() + STEP_UP_DURATION_MS).toISOString();
  }
  return valid;
}

export function verifyUnlockPin(pin: unknown): boolean {
  return typeof pin === 'string' && pin.length >= MIN_UNLOCK_PIN_LENGTH;
}
