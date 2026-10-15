import type { LivingEntity, SecurityAlert, SecurityIncident } from '../types';
import { apiClient } from './api-client';

export const investigationService = {
  async getIncidents(): Promise<SecurityIncident[]> {
    const res = await apiClient.get<{ incidents: SecurityIncident[] }>('/investigation/incidents');
    return res.data.incidents;
  },

  async getAlerts(): Promise<SecurityAlert[]> {
    const res = await apiClient.get<{ alerts: SecurityAlert[] }>('/investigation/alerts');
    return res.data.alerts;
  },

  async getEntities(): Promise<LivingEntity[]> {
    const res = await apiClient.get<{ entities: LivingEntity[] }>('/investigation/entities');
    return res.data.entities;
  },

  async updateIncidentState(id: string, state: SecurityIncident['state']): Promise<SecurityIncident> {
    const res = await apiClient.post<{ success: boolean; incident: SecurityIncident }>(
      `/investigation/incidents/${id}/state`,
      { state },
    );
    return res.data.incident;
  },
};
