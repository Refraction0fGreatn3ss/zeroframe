import { minutesFromNow } from '../../lib/relative-time';

export interface RollbackCheckpoint {
  id: string;
  name: string;
  type: 'RESPONSE_ACTION' | 'SENSOR_CONFIG' | 'POLICY_RULE';
  timestamp: string;
  target: string;
  status: 'READY' | 'EXECUTING' | 'ROLLED_BACK' | 'FAILED' | 'VERIFIED_REVERTED';
  reversalAction: string;
  executedBy: string;
}

export interface QuarantineRecord {
  id: string;
  targetIp: string;
  hostname: string;
  mac?: string;
  mechanism?: string;
  enforcedAt?: string;
  isolatedAt?: string;
  leaseExpiresAt?: string;
  permitRef?: string;
  permitId?: string;
  status: string;
  reason?: string;
  provider?: string;
  verifiedOnWire?: boolean;
}

export interface BackendRollback {
  id: string;
  actionType?: string;
  rolledBackAt?: string;
  appliedAt?: string;
  targetIp?: string;
  hostname?: string;
  status?: RollbackCheckpoint['status'];
  reason?: string;
  initiatedBy?: string;
}

export interface BackendQuarantine {
  id: string;
  targetIp: string;
  hostname: string;
  mac?: string;
  provider?: string;
  isolatedAt?: string;
  enforcedAt?: string;
  leaseExpiresAt?: string;
  permitId?: string;
  permitRef?: string;
  status?: string;
}

const DEFAULT_QUARANTINE_LEASE_MINUTES = 30;
const FALLBACK_MAC = '00:50:56:b8:3a:11';
const FALLBACK_MECHANISM = 'IPTABLES_SENSOR_DROP_CHAIN';
const FALLBACK_PERMIT_REF = 'PMT-AUTO-01';

function normalizeRollbackStatus(status: BackendRollback['status']): RollbackCheckpoint['status'] {
  return status === 'VERIFIED_REVERTED' ? 'ROLLED_BACK' : status || 'READY';
}

export function normalizeRollback(raw: BackendRollback): RollbackCheckpoint {
  return {
    id: raw.id,
    name: `Reversal: ${raw.actionType || 'Host Isolation'}`,
    type: 'RESPONSE_ACTION',
    timestamp: raw.rolledBackAt || raw.appliedAt || new Date().toISOString(),
    target: `${raw.targetIp || 'Host'} (${raw.hostname || 'Host'})`,
    status: normalizeRollbackStatus(raw.status),
    reversalAction: raw.reason || 'Restored routing and lifted isolation chain',
    executedBy: raw.initiatedBy || 'sec-operator',
  };
}

export function normalizeQuarantine(raw: BackendQuarantine): QuarantineRecord {
  const isolatedAt = raw.isolatedAt || raw.enforcedAt || new Date().toISOString();
  return {
    id: raw.id,
    targetIp: raw.targetIp,
    hostname: raw.hostname,
    mac: raw.mac || FALLBACK_MAC,
    mechanism: raw.provider || FALLBACK_MECHANISM,
    enforcedAt: isolatedAt,
    isolatedAt,
    leaseExpiresAt: raw.leaseExpiresAt || minutesFromNow(DEFAULT_QUARANTINE_LEASE_MINUTES),
    permitRef: raw.permitId || raw.permitRef || FALLBACK_PERMIT_REF,
    status: raw.status || 'ACTIVE_ENFORCED',
    verifiedOnWire: true,
  };
}
