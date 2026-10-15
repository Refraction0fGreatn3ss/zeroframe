import { Activity, ExternalLink } from 'lucide-react';
import type React from 'react';
import { SecurityActivityLogPanel } from '../../../components/shared/security-activity-log-panel/SecurityActivityLogPanel';
import { ACTIVITY_LOG_MAX_HEIGHT } from '../command-center.data';

interface SecurityActivitySectionProps {
  onOpenActivityLog: () => void;
}

export const SecurityActivitySection: React.FC<SecurityActivitySectionProps> = ({ onOpenActivityLog }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-[var(--zf-brand-accent)]" />
        <h2 className="text-xs font-semibold text-[var(--zf-text-primary)] uppercase tracking-wider">
          Real-Time Security Activity Stream
        </h2>
        <span className="text-[10px] font-mono text-[var(--zf-text-muted)]">
          Unified telemetry: System, Auth, and Threat Alerts
        </span>
      </div>

      <button
        type="button"
        onClick={onOpenActivityLog}
        className="text-[11px] font-mono text-[var(--zf-brand-accent)] hover:underline flex items-center gap-1 cursor-pointer"
      >
        <span>Open Dedicated Operations View</span>
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>

    <SecurityActivityLogPanel maxHeight={ACTIVITY_LOG_MAX_HEIGHT} showHeader={true} />
  </div>
);
