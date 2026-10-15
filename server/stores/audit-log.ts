import { AUDIT_TENANT_ID } from '../config.ts';
import type { OperatorSession } from '../types/session.ts';
import { tenantStore } from './tenant-store.ts';

interface AuditEvent {
  idPrefix: string;
  signaturePrefix: string;
  action: string;
  status: string;
  details: string;
}

export function recordSessionAudit(session: OperatorSession, event: AuditEvent): void {
  const tenantDb = tenantStore.find(AUDIT_TENANT_ID);
  if (!tenantDb) return;

  const now = Date.now();
  tenantDb.auditLogs.unshift({
    id: `${event.idPrefix}-${now}`,
    timestamp: new Date(now).toISOString(),
    actor: session.operator.email,
    actorRole: session.operator.role,
    action: event.action,
    targetResource: session.sessionId,
    ipAddress: session.ipAddress,
    status: event.status,
    details: event.details,
    signatureHash: `${event.signaturePrefix}_${now}`,
    tenantId: AUDIT_TENANT_ID,
  });
}
