import type React from 'react';
import type { OperationalStatus } from '../simple-soc-dashboard.utils';
import { OperationalStatusIcon } from './OperationalStatusIcon';

interface OperationalStatusCardProps {
  status: OperationalStatus;
  incidentCount: number;
  lastHeartbeatTimestamp: string;
}

const getStatusDescription = (status: OperationalStatus, incidentCount: number): string => {
  if (status === 'STALE') {
    return 'The real-time streaming link to the telemetry engine is currently offline or reconnecting. Telemetry is displaying last known state rather than live updates. Do not assume clean security posture until connection re-establishes.';
  }
  if (status === 'UNDER_ATTACK') {
    return `ZeroFlash is currently tracking ${incidentCount} active security incidents across the network. 1 high-priority incident requires containment approval.`;
  }
  return 'No unauthorized access, data exfiltration, or ransomware activities have been observed in the last 24 hours.';
};

export const OperationalStatusCard: React.FC<OperationalStatusCardProps> = ({
  status,
  incidentCount,
  lastHeartbeatTimestamp,
}) => (
  <div className="p-5 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] space-y-2 shadow-xs">
    <span className="text-xs font-semibold text-[var(--zf-text-muted)] uppercase tracking-wider block">
      Current operational status
    </span>

    <div className="flex items-start gap-3 pt-1">
      <OperationalStatusIcon status={status} />
      <div>
        <div className="text-base font-semibold text-[var(--zf-text-primary)] flex items-center gap-2">
          {status === 'STALE' ? (
            <>
              <span>Real-Time Telemetry Link Disconnected</span>
              <span className="text-xs font-mono text-amber-400 font-normal px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                STALE (Last known {new Date(lastHeartbeatTimestamp).toLocaleTimeString()})
              </span>
            </>
          ) : status === 'UNDER_ATTACK' ? (
            'Active security threats detected requiring attention'
          ) : (
            'All monitored systems are operating normally'
          )}
        </div>
        <p className="text-xs text-[var(--zf-text-secondary)] mt-1 leading-relaxed">
          {getStatusDescription(status, incidentCount)}
        </p>
      </div>
    </div>
  </div>
);
