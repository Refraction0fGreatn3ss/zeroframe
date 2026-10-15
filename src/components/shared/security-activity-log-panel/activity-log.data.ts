import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, CheckCircle2, Clock, Cpu, ShieldAlert, UserCheck, X } from 'lucide-react';
import type { ActivityCategory, ActivitySeverity, ActivityStatus } from '../../../types/activity-log';

export type CategoryCountKey = 'all' | 'threatAlerts' | 'userLogins' | 'systemEvents';

export interface CategoryConfig {
  label: string;
  filterLabel: string;
  icon: LucideIcon;
  textClassName: string;
  countKey: CategoryCountKey;
  activeTabClassName: string;
  inactiveTabClassName: string;
}

export const CATEGORY_CONFIG: Record<ActivityCategory, CategoryConfig> = {
  THREAT_ALERT: {
    label: 'Threat Alert',
    filterLabel: 'Threat Alerts',
    icon: ShieldAlert,
    textClassName: 'text-rose-400',
    countKey: 'threatAlerts',
    activeTabClassName: 'bg-rose-500/15 text-rose-400 font-semibold shadow-xs border border-rose-500/30',
    inactiveTabClassName: 'text-[var(--zf-text-muted)] hover:text-rose-400',
  },
  USER_LOGIN: {
    label: 'User Auth',
    filterLabel: 'User Logins',
    icon: UserCheck,
    textClassName: 'text-sky-400',
    countKey: 'userLogins',
    activeTabClassName: 'bg-sky-500/15 text-sky-400 font-semibold shadow-xs border border-sky-500/30',
    inactiveTabClassName: 'text-[var(--zf-text-muted)] hover:text-sky-400',
  },
  SYSTEM_EVENT: {
    label: 'System Event',
    filterLabel: 'System Events',
    icon: Cpu,
    textClassName: 'text-emerald-400',
    countKey: 'systemEvents',
    activeTabClassName: 'bg-emerald-500/15 text-emerald-400 font-semibold shadow-xs border border-emerald-500/30',
    inactiveTabClassName: 'text-[var(--zf-text-muted)] hover:text-emerald-400',
  },
};

export const CATEGORY_FILTER_ORDER: ActivityCategory[] = ['THREAT_ALERT', 'USER_LOGIN', 'SYSTEM_EVENT'];

export const SEVERITY_BADGE_CLASS: Record<ActivitySeverity, string> = {
  CRITICAL: 'font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400',
  HIGH: 'font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-400',
  MEDIUM: 'font-medium bg-cyan-500/15 border border-cyan-500/30 text-cyan-400',
  INFO: 'font-medium bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-muted)]',
};

export interface StatusConfig {
  icon: LucideIcon;
  className: string;
}

export const STATUS_CONFIG: Record<ActivityStatus, StatusConfig> = {
  SUCCESS: { icon: CheckCircle2, className: 'text-emerald-400 font-mono text-[10px] font-semibold' },
  BLOCKED: { icon: X, className: 'text-rose-400 font-mono text-[10px] font-bold' },
  FLAGGED: { icon: AlertTriangle, className: 'text-amber-400 font-mono text-[10px] font-semibold' },
  INVESTIGATING: { icon: Clock, className: 'text-cyan-400 font-mono text-[10px] font-semibold' },
  WARNING: { icon: AlertTriangle, className: 'text-amber-300 font-mono text-[10px] font-semibold' },
};

export const SEVERITY_FILTER_OPTIONS: { value: ActivitySeverity | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Severities' },
  { value: 'CRITICAL', label: 'Critical Only' },
  { value: 'HIGH', label: 'High Severity' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'INFO', label: 'Info' },
];

const SECONDARY_PIVOT_CLASS =
  'px-2.5 py-1 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-primary)] font-medium text-xs flex items-center gap-1 cursor-pointer hover:border-[var(--zf-border-medium)] transition-colors';

export interface PivotAction {
  label: string;
  path: string;
  className: string;
}

export const CATEGORY_PIVOT_ACTIONS: Record<ActivityCategory, PivotAction> = {
  THREAT_ALERT: {
    label: 'Pivot to Incidents',
    path: '/investigate/incidents',
    className:
      'px-2.5 py-1 rounded bg-[var(--zf-brand-accent)] text-black font-semibold text-xs flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity',
  },
  USER_LOGIN: { label: 'Inspect RBAC Audit', path: '/system/audit', className: SECONDARY_PIVOT_CLASS },
  SYSTEM_EVENT: { label: 'Inspect Sensor Fleet', path: '/system/fleet', className: SECONDARY_PIVOT_CLASS },
};

export const EXPORT_CSV_COLUMNS = ['id', 'timestamp', 'category', 'severity', 'title', 'actor', 'sourceIp', 'status'];
