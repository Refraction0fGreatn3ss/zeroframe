import type { DetectionCapability } from '../types';
import type { AuditLogEntry, EnterpriseIntegration, EnterpriseLicense } from '../types/admin';
import type { ComplianceFrameworkPayload, InspectionPipelinePayload } from '../types/api-payloads';
import type { SensorNode } from '../types/fleet';
import { apiClient } from './api-client';

export const systemService = {
  async getFleetSensors(): Promise<SensorNode[]> {
    const res = await apiClient.get<{ sensors: SensorNode[] }>('/system/fleet');
    return res.data.sensors;
  },

  async getInspectionPipeline(): Promise<InspectionPipelinePayload> {
    const res = await apiClient.get<InspectionPipelinePayload>('/system/inspection');
    return res.data;
  },

  async getAssuranceCapabilities(): Promise<DetectionCapability[]> {
    const res = await apiClient.get<{ capabilities: DetectionCapability[] }>('/system/assurance');
    return res.data.capabilities;
  },

  async triggerCanary(): Promise<{ success: boolean; auditedAt: string; message: string }> {
    const res = await apiClient.post<{ success: boolean; auditedAt: string; message: string }>(
      '/system/assurance/trigger-canary',
    );
    return res.data;
  },

  async getCompliance(): Promise<ComplianceFrameworkPayload[]> {
    const res = await apiClient.get<{ frameworks: ComplianceFrameworkPayload[] }>('/system/compliance');
    return res.data.frameworks;
  },

  async getIntegrations(): Promise<EnterpriseIntegration[]> {
    const res = await apiClient.get<{ integrations: EnterpriseIntegration[] }>('/system/integrations');
    return res.data.integrations;
  },

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    const res = await apiClient.get<{ logs: AuditLogEntry[] }>('/system/audit');
    return res.data.logs;
  },

  async getLicensing(): Promise<EnterpriseLicense> {
    const res = await apiClient.get<EnterpriseLicense>('/system/licensing');
    return res.data;
  },
};
