import type React from 'react';
import type { AlertFilters } from '../hooks/use-alert-filters';
import { ActionFilterTabs } from './ActionFilterTabs';
import { CorrelationToggle } from './CorrelationToggle';

interface AlertsToolbarProps {
  filters: AlertFilters;
  totalCount: number;
}

export const AlertsToolbar: React.FC<AlertsToolbarProps> = ({ filters, totalCount }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] rounded-lg">
    <ActionFilterTabs activeFilter={filters.actionFilter} totalCount={totalCount} onChange={filters.setActionFilter} />
    <CorrelationToggle enabled={filters.groupCorrelated} onToggle={filters.toggleGroupCorrelated} />
  </div>
);
