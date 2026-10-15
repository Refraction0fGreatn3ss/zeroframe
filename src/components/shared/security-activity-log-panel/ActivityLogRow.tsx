import { ChevronRight } from 'lucide-react';
import type React from 'react';
import type { SecurityActivityItem } from '../../../types/activity-log';
import { CATEGORY_CONFIG } from './activity-log.data';
import { formatRelativeTime, formatUtcClockTime } from './activity-log.utils';
import { CategoryIcon } from './CategoryIcon';
import { SeverityBadge } from './SeverityBadge';
import { StatusBadge } from './StatusBadge';

interface ActivityLogRowProps {
  log: SecurityActivityItem;
  isSelected: boolean;
  onSelect: (log: SecurityActivityItem) => void;
}

export const ActivityLogRow: React.FC<ActivityLogRowProps> = ({ log, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(log)}
    className={`p-3 transition-all cursor-pointer relative group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
      log.isNew
        ? 'bg-[var(--zf-brand-accent-subtle)] animate-pulse'
        : isSelected
          ? 'bg-[var(--zf-surface-subtle)] border-l-2 border-[var(--zf-brand-accent)]'
          : 'hover:bg-[var(--zf-surface-card-hover)]'
    }`}
  >
    <div className="flex items-start gap-2.5 min-w-0 flex-1">
      <div className="mt-0.5 p-1.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] shrink-0">
        <CategoryIcon category={log.category} />
      </div>

      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
          <span className="font-semibold text-[var(--zf-text-muted)] uppercase">
            {CATEGORY_CONFIG[log.category].label}
          </span>
          <span className="text-[var(--zf-text-muted)]">·</span>
          <SeverityBadge severity={log.severity} />
          <span className="text-[var(--zf-text-muted)]">·</span>
          <span className="text-[var(--zf-text-secondary)] font-medium">{formatRelativeTime(log.timestamp)}</span>
          <span className="text-[var(--zf-text-muted)] hidden md:inline">
            ({formatUtcClockTime(log.timestamp)} UTC)
          </span>
          <span className="text-[var(--zf-text-muted)]">·</span>
          <span className="text-[var(--zf-text-muted)] hover:text-[var(--zf-brand-accent)]">{log.id}</span>
        </div>

        <div className="font-semibold text-xs text-[var(--zf-text-primary)] group-hover:text-[var(--zf-brand-accent)] transition-colors truncate">
          {log.title}
        </div>

        <p className="text-[11px] text-[var(--zf-text-secondary)] leading-relaxed line-clamp-1">{log.description}</p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-[var(--zf-text-muted)] pt-0.5">
          <div className="flex items-center gap-1">
            <span className="text-[var(--zf-text-muted)]">Actor:</span>
            <span className="text-[var(--zf-text-primary)] font-medium truncate max-w-[160px]">{log.actor}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[var(--zf-text-muted)]">IP:</span>
            <span className="text-[var(--zf-text-primary)] font-semibold">{log.sourceIp}</span>
          </div>

          {log.targetResource && (
            <div className="flex items-center gap-1 truncate max-w-[220px]">
              <span className="text-[var(--zf-text-muted)]">Target:</span>
              <span className="text-[var(--zf-text-secondary)] truncate">{log.targetResource}</span>
            </div>
          )}

          {log.mitreTactic && (
            <span className="px-1.5 py-0.2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold">
              {log.mitreTactic.split(' ')[0]}
            </span>
          )}
        </div>
      </div>
    </div>

    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[var(--zf-border-subtle)]">
      <div>
        <StatusBadge status={log.status} />
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(log);
        }}
        className="px-2 py-1 rounded bg-[var(--zf-surface-subtle)] hover:bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] text-[10px] font-mono text-[var(--zf-brand-accent)] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
      >
        <span>Inspect</span>
        <ChevronRight className="w-2.5 h-2.5" />
      </button>
    </div>
  </div>
);
