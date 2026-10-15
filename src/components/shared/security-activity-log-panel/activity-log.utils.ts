import type { SecurityActivityItem } from '../../../types/activity-log';
import { EXPORT_CSV_COLUMNS } from './activity-log.data';

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const JUST_NOW_THRESHOLD_SECONDS = 5;

export type ExportFormat = 'json' | 'csv';

export function formatRelativeTime(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < JUST_NOW_THRESHOLD_SECONDS) return 'just now';
  if (diffSec < SECONDS_PER_MINUTE) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / SECONDS_PER_MINUTE);
  if (diffMin < MINUTES_PER_HOUR) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / MINUTES_PER_HOUR);
  return `${diffHr}h ago`;
}

/** HH:MM:SS portion of the ISO timestamp, always in UTC. */
export function formatUtcClockTime(timestamp: string): string {
  return new Date(timestamp).toISOString().slice(11, 19);
}

export function buildActivityLogCsv(logs: SecurityActivityItem[]): string {
  const rows = logs.map((l) => [
    l.id,
    l.timestamp,
    l.category,
    l.severity,
    `"${l.title.replace(/"/g, '""')}"`,
    l.actor,
    l.sourceIp,
    l.status,
  ]);
  return [EXPORT_CSV_COLUMNS.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportActivityLogs(logs: SecurityActivityItem[], format: ExportFormat) {
  const filename = `Security_Activity_Log_${new Date().toISOString().slice(0, 10)}.${format}`;
  if (format === 'json') {
    downloadBlob(new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' }), filename);
  } else {
    downloadBlob(new Blob([buildActivityLogCsv(logs)], { type: 'text/csv' }), filename);
  }
}
