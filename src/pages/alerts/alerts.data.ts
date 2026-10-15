import type { ActionFilterTab } from './alerts.types';

export const ACTION_FILTER_TABS: ActionFilterTab[] = [
  {
    filter: 'ALL',
    label: 'All Signals',
    showTotalCount: true,
    activeClassName:
      'bg-[var(--zf-nav-active-bg)] text-[var(--zf-text-primary)] border border-[var(--zf-brand-accent)]',
    inactiveClassName: 'text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)]',
  },
  {
    filter: 'NEEDS_ACTION',
    label: 'Needs Action',
    showTotalCount: false,
    activeClassName: 'bg-[var(--zf-nav-active-bg)] text-rose-400 border border-rose-500/40',
    inactiveClassName: 'text-[var(--zf-text-muted)] hover:text-rose-400',
  },
  {
    filter: 'INVESTIGATION',
    label: 'Needs Investigation',
    showTotalCount: false,
    activeClassName: 'bg-[var(--zf-nav-active-bg)] text-amber-300 border border-amber-500/40',
    inactiveClassName: 'text-[var(--zf-text-muted)] hover:text-amber-300',
  },
  {
    filter: 'MONITORING',
    label: 'Monitoring',
    showTotalCount: false,
    activeClassName: 'bg-[var(--zf-nav-active-bg)] text-sky-400 border border-sky-500/40',
    inactiveClassName: 'text-[var(--zf-text-muted)] hover:text-sky-400',
  },
];
