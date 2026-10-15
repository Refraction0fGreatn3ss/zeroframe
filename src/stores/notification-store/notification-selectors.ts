import type { NotificationCategory, ZeroFlashNotification } from '../../types/notifications';

export type NotificationCategoryFilter = NotificationCategory | 'ALL';

export function countUnread(notifications: ZeroFlashNotification[]): number {
  return notifications.filter((notification) => !notification.read).length;
}

export function countUnacknowledgedCritical(notifications: ZeroFlashNotification[]): number {
  return notifications.filter((notification) => notification.severity === 'CRITICAL' && !notification.acknowledged)
    .length;
}

export function filterByCategory(
  notifications: ZeroFlashNotification[],
  category: NotificationCategoryFilter,
): ZeroFlashNotification[] {
  return category === 'ALL'
    ? notifications
    : notifications.filter((notification) => notification.category === category);
}
