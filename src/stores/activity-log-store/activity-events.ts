import type { ActivityEventTemplate } from '../../data/activity-log.data';
import type { SecurityActivityItem } from '../../types/activity-log';

export const MAX_RETAINED_LOGS = 200;
const ACTIVITY_ID_MIN = 1000;
const ACTIVITY_ID_RANGE = 9000;

function createActivityId(): string {
  return `ACT-2026-${Math.floor(ACTIVITY_ID_MIN + Math.random() * ACTIVITY_ID_RANGE)}`;
}

export function createActivityEvent(template: ActivityEventTemplate): SecurityActivityItem {
  return {
    ...template,
    id: createActivityId(),
    timestamp: new Date().toISOString(),
    isNew: true,
  };
}

export function prependActivity(logs: SecurityActivityItem[], item: SecurityActivityItem): SecurityActivityItem[] {
  return [item, ...logs.slice(0, MAX_RETAINED_LOGS - 1)];
}

export function clearNewFlag(logs: SecurityActivityItem[], id: string): SecurityActivityItem[] {
  return logs.map((log) => (log.id === id ? { ...log, isNew: false } : log));
}
