import { useMemo, useState } from 'react';
import type { SecurityAlert } from '../../../types';
import type { ActionFilter } from '../alerts.types';
import { filterAlertsByAction } from '../alerts.utils';

export interface AlertFilters {
  actionFilter: ActionFilter;
  setActionFilter: (filter: ActionFilter) => void;
  groupCorrelated: boolean;
  toggleGroupCorrelated: () => void;
  filteredAlerts: SecurityAlert[];
}

export const useAlertFilters = (alerts: SecurityAlert[]): AlertFilters => {
  const [actionFilter, setActionFilter] = useState<ActionFilter>('ALL');
  const [groupCorrelated, setGroupCorrelated] = useState(true);

  const filteredAlerts = useMemo(() => filterAlertsByAction(alerts, actionFilter), [alerts, actionFilter]);

  return {
    actionFilter,
    setActionFilter,
    groupCorrelated,
    toggleGroupCorrelated: () => setGroupCorrelated(!groupCorrelated),
    filteredAlerts,
  };
};
