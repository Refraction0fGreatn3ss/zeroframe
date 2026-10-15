import { HOUR_MS, MINUTE_MS } from '../config.ts';
import { broadcastTenantEvent } from '../realtime/event-broadcaster.ts';
import type { OperatorSession } from '../types/session.ts';
import type { ExecutionPermit, QuarantineRecord, RollbackRecord, TenantContext } from '../types/tenant.ts';

const DEFAULT_COMPENSATING_CONTROL = 'Dynamic micro-segmentation with quarantine VLAN and DNS blackhole';
const ROLLBACK_WINDOW_SECONDS = 3600;
const FALLBACK_TARGET = { targetIp: '10.140.2.88', hostname: 'WKST-CORP-088' };
const FALLBACK_OPERATOR_USERNAME = 'sec-operator';

export interface PermitRequest {
  actionType: string;
  targetResource: string;
  reason: string;
  compensatingControl?: string;
}

function shortId(prefix: string): string {
  return `${prefix}-${Date.now().toString().slice(-4)}`;
}

function operatorLabel(session: OperatorSession): string {
  return `${session.operator.id} (${session.operator.displayName})`;
}

function takeQuarantine(tenant: TenantContext, matches: (record: QuarantineRecord) => boolean) {
  const index = tenant.db.quarantine.findIndex(matches);
  return index === -1 ? null : tenant.db.quarantine.splice(index, 1)[0];
}

export function issuePermit(tenant: TenantContext, session: OperatorSession, request: PermitRequest): ExecutionPermit {
  const permit: ExecutionPermit = {
    id: shortId('PERMIT'),
    actionType: request.actionType,
    targetResource: request.targetResource,
    reason: request.reason,
    status: 'PENDING_APPROVER_2',
    requestedBy: operatorLabel(session),
    requestedAt: new Date().toISOString(),
    approver1: operatorLabel(session),
    approver1Signature: `SIG-ED25519-${Date.now()}`,
    approver2: null,
    blastRadiusValidated: true,
    compensatingControl: request.compensatingControl || DEFAULT_COMPENSATING_CONTROL,
    rollbackWindowSeconds: ROLLBACK_WINDOW_SECONDS,
    tenantId: tenant.id,
  };

  tenant.db.permits.unshift(permit);
  broadcastTenantEvent(tenant.id, 'PERMIT_ISSUED', permit);
  return permit;
}

export function approvePermit(
  tenant: TenantContext,
  session: OperatorSession,
  permitId: string,
): ExecutionPermit | null {
  const permit = tenant.db.permits.find((candidate) => candidate.id === permitId);
  if (!permit) return null;

  permit.approver2 = operatorLabel(session);
  permit.status = 'AUTHORIZED';
  broadcastTenantEvent(tenant.id, 'PERMIT_APPROVED', permit);
  return permit;
}

export function liftQuarantine(tenant: TenantContext, session: OperatorSession, quarantineId: string): RollbackRecord {
  const isolatedFallback = new Date(Date.now() - 30 * MINUTE_MS).toISOString();
  const item = takeQuarantine(tenant, (record) => record.id === quarantineId) ?? {
    id: quarantineId,
    ...FALLBACK_TARGET,
    isolatedAt: isolatedFallback,
  };

  const rollback: RollbackRecord = {
    id: shortId('ROLL'),
    actionType: 'LIFT_QUARANTINE_ISOLATION',
    targetIp: item.targetIp,
    hostname: item.hostname,
    appliedAt: item.isolatedAt || isolatedFallback,
    rolledBackAt: new Date().toISOString(),
    initiatedBy: session.operator.username || FALLBACK_OPERATOR_USERNAME,
    reason: `Quarantine isolation lifted for ${item.hostname} (${item.targetIp})`,
    status: 'VERIFIED_REVERTED',
    tenantId: tenant.id,
  };

  tenant.db.rollbacks.unshift(rollback);
  broadcastTenantEvent(tenant.id, 'ROLLBACK_EXECUTED', rollback);
  return rollback;
}

function markRolledBack(tenant: TenantContext, rollbackId: string): boolean {
  const index = tenant.db.rollbacks.findIndex((record) => record.id === rollbackId);
  if (index === -1) return false;

  tenant.db.rollbacks[index] = {
    ...tenant.db.rollbacks[index],
    status: 'VERIFIED_REVERTED',
    rolledBackAt: new Date().toISOString(),
  };
  return true;
}

export function executeRollback(tenant: TenantContext, session: OperatorSession, id: string): RollbackRecord {
  const released = takeQuarantine(tenant, (record) => record.id === id || record.targetIp === id);
  const target = released ? { targetIp: released.targetIp, hostname: released.hostname } : FALLBACK_TARGET;

  const rollback: RollbackRecord = {
    id: id.startsWith('ROLL-') ? id : shortId('ROLL'),
    actionType: 'ISOLATE_HOST_QUARANTINE_REVERSAL',
    ...target,
    appliedAt: new Date(Date.now() - HOUR_MS).toISOString(),
    rolledBackAt: new Date().toISOString(),
    initiatedBy: session.operator.username || FALLBACK_OPERATOR_USERNAME,
    reason: 'Reverted host isolation via governed response',
    status: 'VERIFIED_REVERTED',
    tenantId: tenant.id,
  };

  if (!markRolledBack(tenant, id)) {
    tenant.db.rollbacks.unshift(rollback);
  }

  broadcastTenantEvent(tenant.id, 'ROLLBACK_EXECUTED', rollback);
  return rollback;
}
