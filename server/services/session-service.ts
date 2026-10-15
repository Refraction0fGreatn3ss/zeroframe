import { DEFAULT_INACTIVITY_POLICY, DEFAULT_INACTIVITY_TIMEOUT_MS, INACTIVITY_POLICY_MS } from '../config.ts';
import { clientRegistry } from '../realtime/client-registry.ts';
import { recordSessionAudit } from '../stores/audit-log.ts';
import { sessionStore } from '../stores/session-store.ts';
import type { OperatorSession } from '../types/session.ts';

const UNAUTHORIZED_CLOSE_CODE = 4401;
const NORMAL_CLOSE_CODE = 1000;

export function inactivityTimeoutOf(session: OperatorSession): number {
  return session.inactivityTimeoutMs || DEFAULT_INACTIVITY_TIMEOUT_MS;
}

export function inactivityMinutesOf(session: OperatorSession): number {
  return Math.round(inactivityTimeoutOf(session) / 60000);
}

export function remainingInactivityMs(session: OperatorSession, now = Date.now()): number {
  return Math.max(0, inactivityTimeoutOf(session) - (now - new Date(session.lastActiveAt).getTime()));
}

export function isSessionIdle(session: OperatorSession, now = Date.now()): boolean {
  return now - new Date(session.lastActiveAt).getTime() > inactivityTimeoutOf(session);
}

export function touchSession(session: OperatorSession): void {
  session.lastActiveAt = new Date().toISOString();
}

export function expireIdleSession(session: OperatorSession): void {
  const minutes = inactivityMinutesOf(session);
  sessionStore.deleteByToken(session.token);

  recordSessionAudit(session, {
    idPrefix: 'AUD-TIMEOUT',
    signaturePrefix: 'sig_audit_timeout',
    action: 'SESSION_KEY_PURGE_INACTIVITY',
    status: 'PURGED_REVOKED',
    details: `Authoritative server-side key purge: ${minutes}-minute inactivity threshold exceeded with zero data remanence.`,
  });

  clientRegistry.disconnectSession(session.sessionId, {
    code: UNAUTHORIZED_CLOSE_CODE,
    reason: 'Inactivity threshold exceeded',
    notice: { type: 'SESSION_EXPIRED', reason: `Inactivity threshold (${minutes} minutes) exceeded` },
  });
}

export function applyInactivityPolicy(session: OperatorSession, policy: string | undefined) {
  const policyKey = policy || DEFAULT_INACTIVITY_POLICY;
  const timeoutMs = (policy && INACTIVITY_POLICY_MS[policy]) || DEFAULT_INACTIVITY_TIMEOUT_MS;
  session.inactivityTimeoutMs = timeoutMs;
  session.policyKey = policyKey;

  recordSessionAudit(session, {
    idPrefix: 'AUD-POL',
    signaturePrefix: 'sig_pol',
    action: 'INACTIVITY_POLICY_CONFIGURED',
    status: 'ACTIVE',
    details: `Operator reconfigured inactivity compliance policy to ${policyKey} (${timeoutMs / 60000} min strict limit).`,
  });

  return { policy: policyKey, inactivityTimeoutMs: timeoutMs };
}

export function signOut(session: OperatorSession, reason: string): void {
  const isInactivity = reason === 'INACTIVITY_TIMEOUT';
  sessionStore.deleteByToken(session.token);

  recordSessionAudit(session, {
    idPrefix: 'AUD-LOGOUT',
    signaturePrefix: 'sig_logout',
    action: isInactivity ? 'SESSION_AUTO_TERMINATED_INACTIVITY' : 'SESSION_REVOKED_LOGOUT',
    status: 'TERMINATED',
    details: isInactivity
      ? 'Session terminated: 15 minutes of inactivity compliance enforcement.'
      : `Operator executed clean sign out: ${reason}`,
  });

  clientRegistry.disconnectSession(session.sessionId, {
    code: NORMAL_CLOSE_CODE,
    reason: `Operator session closed: ${reason}`,
  });
}

export function revokeSession(sessionId: string): boolean {
  const revoked = sessionStore.deleteBySessionId(sessionId);
  if (revoked) {
    clientRegistry.disconnectSession(sessionId, {
      code: UNAUTHORIZED_CLOSE_CODE,
      reason: 'Session revoked',
      notice: { type: 'SESSION_REVOKED', reason: 'Session remotely terminated by administrator' },
    });
  }
  return revoked;
}

export function listSessionSummaries(currentSessionId: string) {
  return sessionStore.list().map((session) => ({
    sessionId: session.sessionId,
    operator: session.operator,
    createdAt: session.createdAt,
    lastActiveAt: session.lastActiveAt,
    ipAddress: session.ipAddress,
    userAgent: session.userAgent,
    deviceLabel: session.deviceLabel,
    isCurrent: session.sessionId === currentSessionId,
  }));
}
