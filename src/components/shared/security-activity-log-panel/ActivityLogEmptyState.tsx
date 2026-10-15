import { Search } from 'lucide-react';
import type React from 'react';

interface ActivityLogEmptyStateProps {
  onResetFilters: () => void;
}

export const ActivityLogEmptyState: React.FC<ActivityLogEmptyStateProps> = ({ onResetFilters }) => (
  <div className="p-8 text-center text-[var(--zf-text-muted)] space-y-2">
    <Search className="w-6 h-6 mx-auto opacity-40 text-[var(--zf-text-muted)]" />
    <div className="text-xs font-semibold text-[var(--zf-text-primary)]">
      No security activity matching current filters
    </div>
    <p className="text-[11px] text-[var(--zf-text-muted)] max-w-sm mx-auto">
      Try adjusting your category filter, severity threshold, or search keyword.
    </p>
    <button
      type="button"
      onClick={onResetFilters}
      className="mt-2 px-3 py-1 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-brand-accent)] text-xs font-mono cursor-pointer"
    >
      Reset Filters
    </button>
  </div>
);
