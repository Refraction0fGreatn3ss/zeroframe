import type { ZeroFlashNotification } from '../types/notifications';
import { apiClient } from './api-client';

export const notificationService = {
  async getNotifications(): Promise<ZeroFlashNotification[]> {
    const res = await apiClient.get<{ notifications: ZeroFlashNotification[] }>('/notifications');
    return res.data.notifications;
  },

  async acknowledgeNotification(id: string): Promise<void> {
    await apiClient.post(`/notifications/${id}/acknowledge`);
  },

  async clearAllNotifications(): Promise<void> {
    await apiClient.post('/notifications/clear-all');
  },
};
