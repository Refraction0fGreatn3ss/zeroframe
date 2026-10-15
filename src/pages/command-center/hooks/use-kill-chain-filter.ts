import { useMemo, useState } from 'react';
import type { SecurityIncident } from '../../../types';
import { filterIncidentsByKillChainStage } from '../command-center.utils';

export const useKillChainFilter = (incidents: SecurityIncident[]) => {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const filteredIncidents = useMemo(
    () => filterIncidentsByKillChainStage(incidents, selectedStage),
    [incidents, selectedStage],
  );

  const toggleStage = (stage: string) => {
    setSelectedStage((prev) => (prev === stage ? null : stage));
  };

  const clearStage = () => setSelectedStage(null);

  return { selectedStage, toggleStage, clearStage, filteredIncidents };
};
