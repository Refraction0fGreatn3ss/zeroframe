import type React from 'react';
import { SecurityActivityLogPanel } from '../../components/shared/security-activity-log-panel/SecurityActivityLogPanel';
import { useActivityLogStore } from '../../stores/activity-log-store';
import { ActivityKpiStrip } from './components/ActivityKpiStrip';
import { ActivityLogHeader } from './components/ActivityLogHeader';
import type { SimulationKind } from './security-activity-log.data';
import { SIMULATED_EVENTS } from './security-activity-log.data';

const LOG_PANEL_MAX_HEIGHT = '620px';

export const SecurityActivityLogPage: React.FC = () => {
  const { logs, counts, setCategoryFilter, addManualEvent } = useActivityLogStore();

  const simulateEvent = (kind: SimulationKind) => {
    addManualEvent(SIMULATED_EVENTS[kind]);
  };

  return (
    <div className="p-4 sm:p-5 space-y-4 text-[var(--zf-text-primary)] max-w-[1720px] mx-auto font-sans select-none">
      <ActivityLogHeader logs={logs} onSimulate={simulateEvent} />

      <ActivityKpiStrip counts={counts} onSelectCategory={setCategoryFilter} />

      <SecurityActivityLogPanel maxHeight={LOG_PANEL_MAX_HEIGHT} showHeader={true} />
    </div>
  );
};
