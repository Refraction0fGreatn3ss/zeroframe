import { Terminal } from 'lucide-react';
import type React from 'react';
import { ExportButton } from '../../../components/shared/ExportButton';
import type { SecurityIncident } from '../../../types';
import type { TimeRange } from '../command-center.types';
import { getTelemetryStatusLabel } from '../command-center.utils';
import { TimeRangeSelector } from './TimeRangeSelector';

interface CommandCenterHeaderProps {
  incidents: SecurityIncident[];
  realtimeConnected: boolean;
  lastHeartbeatTimestamp: string;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  onOpenHunter: () => void;
}

export const CommandCenterHeader: React.FC<CommandCenterHeaderProps> = ({
  incidents,
  realtimeConnected,
  lastHeartbeatTimestamp,
  timeRange,
  onTimeRangeChange,
  onOpenHunter,
}) => (
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold tracking-tight text-slate-100">NDR / XDR Command Center</h1>
        <span className="text-slate-500">·</span>
        <span className={`text-xs font-mono font-medium ${!realtimeConnected ? 'text-amber-400' : 'text-cyan-400'}`}>
          {getTelemetryStatusLabel(realtimeConnected, lastHeartbeatTimestamp)}
        </span>
      </div>
      <p className="text-xs text-slate-400 mt-0.5">
        Synchronized packet flow observation, MITRE ATT&CK progression, and rapid incident isolation.
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <TimeRangeSelector value={timeRange} onChange={onTimeRangeChange} />

      <button
        type="button"
        onClick={onOpenHunter}
        className="px-3 py-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
      >
        <Terminal className="w-3.5 h-3.5" />
        <span>Open Wire Hunter</span>
      </button>

      <ExportButton resourceName="Command_Center_Metrics" recordCount={incidents.length} data={incidents} />
    </div>
  </div>
);
