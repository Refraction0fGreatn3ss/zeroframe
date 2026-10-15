import { apiClient } from './api-client';

export interface KillSwitchUpdate {
  success: boolean;
  governedResponseKillSwitch: boolean;
}

export const killSwitchService = {
  async setEngaged(engaged: boolean, reason: string): Promise<KillSwitchUpdate> {
    const res = await apiClient.post<KillSwitchUpdate>('/dashboard/kill-switch', { engaged, reason });
    return res.data;
  },
};
