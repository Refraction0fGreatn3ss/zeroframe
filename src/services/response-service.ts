import type { QuarantinePayload, RollbackPayload, RollbackResultPayload } from '../types/api-payloads';
import { apiClient } from './api-client';

export interface ExecutionPermitRecord {
  id: string;
  actionType: string;
  targetResource: string;
  reason: string;
  status: 'PENDING_APPROVER_1' | 'PENDING_APPROVER_2' | 'AUTHORIZED' | 'EXECUTING' | 'EXECUTED' | 'REJECTED';
  requestedBy: string;
  requestedAt: string;
  approver1?: string | null;
  approver1Signature?: string | null;
  approver2?: string | null;
  blastRadiusValidated: boolean;
  compensatingControl: string;
  rollbackWindowSeconds: number;
  tenantId: string;
}

export interface PermitRequest {
  actionType: string;
  targetResource: string;
  reason: string;
  compensatingControl?: string;
}

export const responseService = {
  async getPermits(): Promise<ExecutionPermitRecord[]> {
    const res = await apiClient.get<{ permits: ExecutionPermitRecord[] }>('/response/permits');
    return res.data.permits;
  },

  async issuePermit(permit: PermitRequest): Promise<ExecutionPermitRecord> {
    const res = await apiClient.post<{ success: boolean; permit: ExecutionPermitRecord }>('/response/permits', permit);
    return res.data.permit;
  },

  async approvePermit(permitId: string): Promise<ExecutionPermitRecord> {
    const res = await apiClient.post<{ success: boolean; permit: ExecutionPermitRecord }>(
      `/response/permits/${permitId}/approve`,
    );
    return res.data.permit;
  },

  async getQuarantineHosts(): Promise<QuarantinePayload[]> {
    const res = await apiClient.get<{ quarantine: QuarantinePayload[] }>('/response/quarantine');
    return res.data.quarantine;
  },

  async getRollbacks(): Promise<RollbackPayload[]> {
    const res = await apiClient.get<{ rollbacks: RollbackPayload[] }>('/response/rollback');
    return res.data.rollbacks;
  },

  async liftQuarantine(id: string): Promise<RollbackResultPayload> {
    const res = await apiClient.post<RollbackResultPayload>(`/response/quarantine/${id}/lift`);
    return res.data;
  },

  async executeRollback(id: string): Promise<RollbackResultPayload> {
    const res = await apiClient.post<RollbackResultPayload>(`/response/rollback/${id}`);
    return res.data;
  },
};
