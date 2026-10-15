/**
 * ZeroFrame System & Fleet Service
 * Fleet Sensors, Inspection Pipeline, Live Detection Assurance Canaries,
 * Compliance Frameworks, Integrations, Audit Logs, and Licensing.
 */

import { apiClient } from './api-client';
import { DetectionCapability } from '../types';

export const systemService = {
  async getFleetSensors(): Promise<any[]> {
    const res = await apiClient.get<{ sensors: any[] }>('/system/fleet');
    return res.data.sensors;
  },

  async getInspectionPipeline(): Promise<any> {
    const res = await apiClient.get<any>('/system/inspection');
    return res.data;
  },

  async getAssuranceCapabilities(): Promise<DetectionCapability[]> {
    const res = await apiClient.get<{ capabilities: DetectionCapability[] }>('/system/assurance');
    return res.data.capabilities;
  },

  async triggerCanary(): Promise<{ success: boolean; auditedAt: string; message: string }> {
    const res = await apiClient.post<{ success: boolean; auditedAt: string; message: string }>('/system/assurance/trigger-canary');
    return res.data;
  },

  async getCompliance(): Promise<any[]> {
    const res = await apiClient.get<{ frameworks: any[] }>('/system/compliance');
    return res.data.frameworks;
  },

  async getIntegrations(): Promise<any[]> {
    const res = await apiClient.get<{ integrations: any[] }>('/system/integrations');
    return res.data.integrations;
  },

  async getAuditLogs(): Promise<any[]> {
    const res = await apiClient.get<{ logs: any[] }>('/system/audit');
    return res.data.logs;
  },

  async getLicensing(): Promise<any> {
    const res = await apiClient.get<any>('/system/licensing');
    return res.data;
  },
};
