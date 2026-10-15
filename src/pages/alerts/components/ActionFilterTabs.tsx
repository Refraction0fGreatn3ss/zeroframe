import type React from 'react';
import { ACTION_FILTER_TABS } from '../alerts.data';
import type { ActionFilter } from '../alerts.types';

interface ActionFilterTabsProps {
  activeFilter: ActionFilter;
  totalCount: number;
  onChange: (filter: ActionFilter) => void;
}

export const ActionFilterTabs: React.FC<ActionFilterTabsProps> = ({ activeFilter, totalCount, onChange }) => (
  <div className="flex items-center rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] p-0.5 text-xs font-sans">
    {ACTION_FILTER_TABS.map((tab) => (
      <button
        type="button"
        key={tab.filter}
        onClick={() => onChange(tab.filter)}
        className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium ${
          activeFilter === tab.filter ? tab.activeClassName : tab.inactiveClassName
        }`}
      >
        {tab.showTotalCount ? `${tab.label} (${totalCount})` : tab.label}
      </button>
    ))}
  </div>
);
