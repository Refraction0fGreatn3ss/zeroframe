/**
 * ZeroFrame Notification Service
 * Handles 15 notification categories, deduplication, acknowledgment, clear-all
 */

import { apiClient } from './api-client';
import { ZeroFlashNotification } from '../types/notifications';

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
