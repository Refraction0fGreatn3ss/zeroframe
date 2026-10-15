import type { ActivityCategory, ActivitySeverity, SecurityActivityItem } from '../../types/activity-log';

export interface ActivityLogFilters {
  filterCategory: ActivityCategory | 'ALL';
  filterSeverity: ActivitySeverity | 'ALL';
  searchQuery: string;
}

export interface ActivityLogCounts {
  all: number;
  threatAlerts: number;
  userLogins: number;
  systemEvents: number;
  criticalCount: number;
}

function matchesSearch(log: SecurityActivityItem, searchQuery: string): boolean {
  const query = searchQuery.toLowerCase();
  const searchableFields = [
    log.title,
    log.description,
    log.actor,
    log.sourceIp,
    log.targetResource,
    log.mitreTactic,
    log.id,
  ];
  return searchableFields.some((field) => field?.toLowerCase().includes(query));
}

export function filterActivityLogs(logs: SecurityActivityItem[], filters: ActivityLogFilters): SecurityActivityItem[] {
  return logs.filter((log) => {
    if (filters.filterCategory !== 'ALL' && log.category !== filters.filterCategory) return false;
    if (filters.filterSeverity !== 'ALL' && log.severity !== filters.filterSeverity) return false;
    if (filters.searchQuery.trim() && !matchesSearch(log, filters.searchQuery)) return false;
    return true;
  });
}

export function countActivityLogs(logs: SecurityActivityItem[]): ActivityLogCounts {
  return {
    all: logs.length,
    threatAlerts: logs.filter((log) => log.category === 'THREAT_ALERT').length,
    userLogins: logs.filter((log) => log.category === 'USER_LOGIN').length,
    systemEvents: logs.filter((log) => log.category === 'SYSTEM_EVENT').length,
    criticalCount: logs.filter((log) => log.severity === 'CRITICAL').length,
  };
}
