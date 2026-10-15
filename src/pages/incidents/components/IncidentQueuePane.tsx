import type React from 'react';
import type { SecurityIncident } from '../../../types';
import type { SeverityFilter } from '../incidents.types';
import { IncidentQueueFilters } from './IncidentQueueFilters';
import { IncidentQueueItem } from './IncidentQueueItem';

interface IncidentQueuePaneProps {
  incidents: SecurityIncident[];
  selectedIncidentId: string;
  onSelectIncident: (id: string) => void;
  searchFilter: string;
  onSearchChange: (value: string) => void;
  severityFilter: SeverityFilter;
  onSeverityChange: (severity: SeverityFilter) => void;
}

export const IncidentQueuePane: React.FC<IncidentQueuePaneProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  searchFilter,
  onSearchChange,
  severityFilter,
  onSeverityChange,
}) => (
  <div className="lg:col-span-4 bg-[#090d16] border border-slate-800/90 rounded flex flex-col overflow-hidden">
    <IncidentQueueFilters
      searchFilter={searchFilter}
      onSearchChange={onSearchChange}
      severityFilter={severityFilter}
      onSeverityChange={onSeverityChange}
    />

    <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
      {incidents.map((inc) => (
        <IncidentQueueItem
          key={inc.id}
          incident={inc}
          isSelected={inc.id === selectedIncidentId}
          onSelect={onSelectIncident}
        />
      ))}
    </div>
  </div>
);
