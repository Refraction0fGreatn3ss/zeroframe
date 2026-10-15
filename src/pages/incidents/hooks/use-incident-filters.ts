import { useMemo, useState } from 'react';
import type { SecurityIncident } from '../../../types';
import type { SeverityFilter } from '../incidents.types';
import { filterIncidents } from '../incidents.utils';

export const useIncidentFilters = (incidents: SecurityIncident[]) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('ALL');

  const filteredIncidents = useMemo(
    () => filterIncidents(incidents, searchFilter, severityFilter),
    [incidents, searchFilter, severityFilter],
  );

  return { searchFilter, setSearchFilter, severityFilter, setSeverityFilter, filteredIncidents };
};
