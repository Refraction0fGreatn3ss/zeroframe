export type ActivityCategory = 'SYSTEM_EVENT' | 'USER_LOGIN' | 'THREAT_ALERT';

export type ActivitySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';

export type ActivityStatus = 'SUCCESS' | 'BLOCKED' | 'FLAGGED' | 'INVESTIGATING' | 'WARNING';

export interface SecurityActivityItem {
  id: string;
  timestamp: string;
  category: ActivityCategory;
  severity: ActivitySeverity;
  title: string;
  description: string;
  actor: string;
  actorRole?: string;
  sourceIp: string;
  targetResource?: string;
  location?: string;
  mitreTactic?: string;
  status: ActivityStatus;
  payload?: Record<string, unknown>;
  isNew?: boolean;
}

export interface ActivityFilterOptions {
  category: ActivityCategory | 'ALL';
  severity: ActivitySeverity | 'ALL';
  searchQuery: string;
  status: ActivityStatus | 'ALL';
}
