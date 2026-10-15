import type { CommandCenterMetrics } from '../stores/dashboard-store';
import { apiClient } from './api-client';

export interface SecurityChartsData {
  hourlyTrend: Array<{
    hour: string;
    events: number;
    baseline: number;
    canaryPassRate: number;
    packetRateKpps: number;
  }>;
  threatDistribution: Array<{
    label: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  severityBreakdown: Array<{
    severity: string;
    count: number;
    color: string;
  }>;
  assetCriticality: Array<{
    tier: string;
    count: number;
    percentage: number;
  }>;
}

export const dashboardService = {
  async getMetrics(): Promise<CommandCenterMetrics> {
    const res = await apiClient.get<CommandCenterMetrics>('/dashboard/metrics');
    return res.data;
  },

  async getCharts(): Promise<SecurityChartsData> {
    const res = await apiClient.get<SecurityChartsData>('/dashboard/charts');
    return res.data;
  },
};
