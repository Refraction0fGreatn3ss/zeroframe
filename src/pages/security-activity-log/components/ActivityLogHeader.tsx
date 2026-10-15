import { Activity } from 'lucide-react';
import type React from 'react';
import { ExportButton } from '../../../components/shared/ExportButton';
import type { SecurityActivityItem } from '../../../types/activity-log';
import type { SimulationKind } from '../security-activity-log.data';
import { EventSimulationControls } from './EventSimulationControls';

interface ActivityLogHeaderProps {
  logs: SecurityActivityItem[];
  onSimulate: (kind: SimulationKind) => void;
}

export const ActivityLogHeader: React.FC<ActivityLogHeaderProps> = ({ logs, onSimulate }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--zf-border-subtle)]">
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold tracking-tight text-[var(--zf-text-primary)] flex items-center gap-2">
          <Activity className="w-4 h-4 text-[var(--zf-brand-accent)]" />
          <span>Real-Time Security Activity Log</span>
        </h1>
        <span className="text-[var(--zf-text-muted)]">·</span>
        <span className="text-xs font-mono text-[var(--zf-brand-accent)] font-medium">
          Live Ingestion & Unified Audit Trail
        </span>
      </div>
      <p className="text-xs text-[var(--zf-text-muted)] mt-0.5">
        Synchronized telemetry tracking system events, user logins, and threat alerts across network, endpoint, and
        physical taps.
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <EventSimulationControls onSimulate={onSimulate} />

      <ExportButton resourceName="Security_Activity_Log" recordCount={logs.length} data={logs} />
    </div>
  </div>
);
