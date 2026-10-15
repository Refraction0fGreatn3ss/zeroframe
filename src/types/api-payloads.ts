import type { SecurityState } from './index';

export interface InspectionStagePayload {
  stage: string;
  name?: string;
  status?: SecurityState;
  state?: SecurityState;
  dropRatePps?: number;
  packetRate?: number;
  byteRate?: number;
  uninspectedBytes?: number;
  primaryCause?: string;
  notes?: string;
}

export interface InspectionPipelinePayload {
  stages?: InspectionStagePayload[];
  asymmetryWarning?: string;
}

export interface ComplianceFrameworkPayload {
  id: string;
  name: string;
  controlsEvaluated?: number;
  controlsPassing?: number;
  controlsDegraded?: number;
  complianceScore?: number;
  status?: string;
  lastAudit?: string;
}

export interface QuarantinePayload {
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
  reason?: string;
  status?: string;
  tenantId?: string;
}

export type RollbackStatus = 'READY' | 'EXECUTING' | 'ROLLED_BACK' | 'FAILED' | 'VERIFIED_REVERTED';

export interface RollbackPayload {
  id: string;
  actionType?: string;
  targetIp?: string;
  hostname?: string;
  appliedAt?: string;
  rolledBackAt?: string;
  initiatedBy?: string;
  reason?: string;
  status?: RollbackStatus;
  tenantId?: string;
}

export interface RollbackResultPayload {
  success: boolean;
  rollback: RollbackPayload;
}
