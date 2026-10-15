import { createStore, useStore } from '../lib/create-store';
import { notificationService } from '../services/notification-service';
import { realtimeClient } from '../services/realtime-client';
import type { ZeroFlashNotification } from '../types/notifications';
import {
  countUnacknowledgedCritical,
  countUnread,
  filterByCategory,
  type NotificationCategoryFilter,
} from './notification-store/notification-selectors';
import { buildNotificationFromEvent } from './notification-store/realtime-notifications';
import { tenantRegistry } from './tenant-registry';

interface NotificationStoreState {
  notifications: ZeroFlashNotification[];
  selectedCategory: NotificationCategoryFilter;
  isLoading: boolean;
}

const notificationStore = createStore<NotificationStoreState>({
  notifications: [],
  selectedCategory: 'ALL',
  isLoading: false,
});

function updateNotifications(transform: (notifications: ZeroFlashNotification[]) => ZeroFlashNotification[]) {
  notificationStore.setState((state) => ({ notifications: transform(state.notifications) }));
}

async function loadNotifications() {
  notificationStore.setState({ isLoading: true });
  try {
    const notifications = await notificationService.getNotifications();
    notificationStore.setState({ notifications });
  } catch (err) {
    console.warn('[Notification Store] Error loading notifications', err);
  } finally {
    notificationStore.setState({ isLoading: false });
  }
}

loadNotifications();

tenantRegistry.register(
  () => notificationStore.setState({ notifications: [] }),
  () => loadNotifications(),
);

realtimeClient.onMessage((event) => {
  const notification = buildNotificationFromEvent(event);
  if (notification) {
    updateNotifications((notifications) => [notification, ...notifications]);
  }
});

export const notificationActions = {
  markAsRead(id: string) {
    updateNotifications((notifications) =>
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    );
  },

  markAllAsRead() {
    updateNotifications((notifications) => notifications.map((notification) => ({ ...notification, read: true })));
  },

  async acknowledge(id: string) {
    updateNotifications((notifications) =>
      notifications.map((notification) =>
        notification.id === id ? { ...notification, acknowledged: true, read: true } : notification,
      ),
    );
    try {
      await notificationService.acknowledgeNotification(id);
    } catch {
      // Optimistic update stays; the server reconciles on the next load.
    }
  },

  async clearAll() {
    notificationStore.setState({ notifications: [] });
    try {
      await notificationService.clearAllNotifications();
    } catch {
      // Optimistic update stays; the server reconciles on the next load.
    }
  },

  setCategoryFilter(selectedCategory: NotificationCategoryFilter) {
    notificationStore.setState({ selectedCategory });
  },

  refreshNotifications: loadNotifications,
};

export function useNotificationStore() {
  const state = useStore(notificationStore);
  return {
    ...state,
    filteredNotifications: filterByCategory(state.notifications, state.selectedCategory),
    unreadCount: countUnread(state.notifications),
    criticalCount: countUnacknowledgedCritical(state.notifications),
    ...notificationActions,
  };
}
