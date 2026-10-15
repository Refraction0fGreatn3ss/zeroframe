import { Search, X } from 'lucide-react';
import type React from 'react';
import type { ActivityCategory, ActivitySeverity } from '../../../types/activity-log';
import type { CategoryCountKey } from './activity-log.data';
import { CATEGORY_CONFIG, CATEGORY_FILTER_ORDER, SEVERITY_FILTER_OPTIONS } from './activity-log.data';

interface ActivityLogFiltersProps {
  counts: Record<CategoryCountKey, number>;
  filterCategory: ActivityCategory | 'ALL';
  filterSeverity: ActivitySeverity | 'ALL';
  searchQuery: string;
  onCategoryChange: (category: ActivityCategory | 'ALL') => void;
  onSeverityChange: (severity: ActivitySeverity | 'ALL') => void;
  onSearchChange: (query: string) => void;
}

export const ActivityLogFilters: React.FC<ActivityLogFiltersProps> = ({
  counts,
  filterCategory,
  filterSeverity,
  searchQuery,
  onCategoryChange,
  onSeverityChange,
  onSearchChange,
}) => (
  <div className="p-2.5 border-b border-[var(--zf-border-subtle)] bg-[var(--zf-surface-card)] flex flex-wrap items-center justify-between gap-2.5">
    <div className="flex items-center gap-1 bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] rounded p-0.5 text-xs font-mono">
      <button
        type="button"
        onClick={() => onCategoryChange('ALL')}
        className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
          filterCategory === 'ALL'
            ? 'bg-[var(--zf-surface-card)] text-[var(--zf-text-primary)] font-semibold shadow-xs border border-[var(--zf-border-subtle)]'
            : 'text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)]'
        }`}
      >
        <span>All Events</span>
        <span className="text-[10px] font-semibold text-[var(--zf-brand-accent)]">({counts.all})</span>
      </button>

      {CATEGORY_FILTER_ORDER.map((category) => {
        const config = CATEGORY_CONFIG[category];
        const Icon = config.icon;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterCategory === category ? config.activeTabClassName : config.inactiveTabClassName
            }`}
          >
            <Icon className={`w-3 h-3 ${config.textClassName}`} />
            <span>{config.filterLabel}</span>
            <span className={`text-[10px] font-bold ${config.textClassName}`}>({counts[config.countKey]})</span>
          </button>
        );
      })}
    </div>

    <div className="flex items-center gap-2 flex-1 sm:flex-initial">
      <select
        value={filterSeverity}
        onChange={(e) => onSeverityChange(e.target.value as ActivitySeverity | 'ALL')}
        className="px-2 py-1 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-secondary)] text-[11px] font-mono focus:outline-hidden focus:border-[var(--zf-brand-accent)] cursor-pointer"
      >
        {SEVERITY_FILTER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="relative flex-1 min-w-[180px]">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[var(--zf-text-muted)]" />
        <input
          type="text"
          placeholder="Search actor, IP, tactic, title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] rounded pl-8 pr-2.5 py-1 text-xs text-[var(--zf-text-primary)] placeholder-[var(--zf-text-muted)] focus:outline-hidden focus:border-[var(--zf-brand-accent)]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1.5 text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)]"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  </div>
);
