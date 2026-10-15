import type React from 'react';

interface ActivityLogFooterProps {
  visibleCount: number;
  totalCount: number;
  criticalCount: number;
}

export const ActivityLogFooter: React.FC<ActivityLogFooterProps> = ({ visibleCount, totalCount, criticalCount }) => (
  <div className="p-2 border-t border-[var(--zf-border-subtle)] bg-[var(--zf-surface-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--zf-text-muted)]">
    <div className="flex items-center gap-3">
      <span>
        Displaying <strong className="text-[var(--zf-text-primary)]">{visibleCount}</strong> of{' '}
        <strong className="text-[var(--zf-text-primary)]">{totalCount}</strong> buffered events
      </span>
      <span className="text-[var(--zf-text-muted)] hidden sm:inline">·</span>
      <span className="hidden sm:inline text-rose-400 font-semibold">{criticalCount} Critical</span>
    </div>

    <div className="flex items-center gap-2">
      <span className="text-[10px] text-[var(--zf-text-muted)]">
        Click any entry to inspect raw cryptographic payload
      </span>
    </div>
  </div>
);
