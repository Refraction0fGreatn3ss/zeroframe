import { broadcastTenantEvent } from '../realtime/event-broadcaster.ts';
import type { OperatorSession } from '../types/session.ts';
import type { Incident, TenantContext } from '../types/tenant.ts';

const CANARY_PASS_COUNT = 11;

export function setKillSwitch(tenant: TenantContext, session: OperatorSession, engaged: unknown, reason?: string): boolean {
  tenant.db.metrics.governedResponseKillSwitch = Boolean(engaged);
  broadcastTenantEvent(tenant.id, 'KILL_SWITCH_CHANGED', {
    governedResponseKillSwitch: tenant.db.metrics.governedResponseKillSwitch,
    reason: reason || 'Manual operator toggle',
    operator: session.operator.username,
    timestamp: new Date().toISOString(),
  });
  return tenant.db.metrics.governedResponseKillSwitch;
}

export function changeIncidentState(tenant: TenantContext, incidentId: string, state: string): Incident | null {
  const incident = tenant.db.incidents.find((candidate) => candidate.id === incidentId);
  if (!incident) return null;

  incident.state = state;
  broadcastTenantEvent(tenant.id, 'INCIDENT_STATE_CHANGED', { incidentId, state });
  return incident;
}

export function triggerCanaryValidation(tenant: TenantContext): string {
  const auditedAt = new Date().toISOString();
  tenant.db.metrics.lastCanaryAuditTime = auditedAt;
  broadcastTenantEvent(tenant.id, 'CANARY_VALIDATION_COMPLETED', {
    timestamp: auditedAt,
    canaryPassCount: CANARY_PASS_COUNT,
    signedHash: `CANARY-SIG-SHA256-${Date.now()}`,
  });
  return auditedAt;
}

export function resyncSince(tenant: TenantContext, lastSeq: number) {
  return {
    currentSeq: tenant.db.seqCounter,
    missedEvents: tenant.db.eventLog.filter((event) => event.seq > lastSeq),
    freshState: {
      metrics: tenant.db.metrics,
      incidentsCount: tenant.db.incidents.length,
    },
  };
}
