import type { FC } from 'react';
import { useAppStore } from '../../../stores/app-store';
import { useDrawerStore } from '../../../stores/context-drawer-store';
import { useDashboardStore } from '../../../stores/dashboard-store';
import { DetectionSegment } from './DetectionSegment';
import { InfrastructureSegment } from './InfrastructureSegment';
import { ResponseSegment } from './ResponseSegment';
import type { TruthCategory } from './truth-bar.types';
import { formatTimeOfDay } from './truth-bar.utils';
import { buildTruthProofContext } from './truth-proof.utils';
import { VisibilitySegment } from './VisibilitySegment';

export interface TruthBarProps {
  className?: string;
}

export const TruthBar: FC<TruthBarProps> = ({ className = '' }) => {
  const { metrics } = useDashboardStore();
  const { killSwitchEngaged, realtimeConnected, lastHeartbeatTimestamp } = useAppStore();
  const { openContext } = useDrawerStore();

  const lastKnownTime = formatTimeOfDay(lastHeartbeatTimestamp || metrics.lastCanaryAuditTime);

  const openProof = (category: TruthCategory) => {
    openContext(buildTruthProofContext(category, metrics, killSwitchEngaged));
  };

  const segmentProps = { metrics, realtimeConnected, lastKnownTime, onOpenProof: openProof };

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 bg-[var(--zf-surface-topbar)] border border-[var(--zf-border-medium)] rounded-md font-sans text-xs select-none shadow-xs ${className}`}
      title="ZeroFrame Authoritative Truth Bar — Click any segment for verified proof and underlying telemetry"
    >
      <InfrastructureSegment {...segmentProps} />
      <VisibilitySegment {...segmentProps} />
      <DetectionSegment {...segmentProps} />
      <ResponseSegment
        killSwitchEngaged={killSwitchEngaged}
        realtimeConnected={realtimeConnected}
        onOpenProof={openProof}
      />
    </div>
  );
};
