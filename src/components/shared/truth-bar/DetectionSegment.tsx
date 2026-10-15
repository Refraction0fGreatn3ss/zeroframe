import { Crosshair } from 'lucide-react';
import type { FC } from 'react';
import { TruthSegment, TruthSegmentCaption, TruthSegmentHeadline } from './TruthSegment';
import type { TruthSegmentStatusProps } from './truth-bar.types';
import { getStatusBorderClass, getStatusDotClass, getStatusTextClass } from './truth-bar.utils';

export const DetectionSegment: FC<TruthSegmentStatusProps> = ({
  metrics,
  realtimeConnected,
  lastKnownTime,
  onOpenProof,
}) => {
  const hasNoDegradedDetectors = metrics.detectorsDegraded === 0;
  const isHealthy = realtimeConnected && hasNoDegradedDetectors;
  // The border additionally reflects unavailable detectors; the icon and dot track degradation only.
  const isFullyHealthy = isHealthy && metrics.detectorsUnavailable === 0;

  return (
    <TruthSegment
      label="Detectable"
      icon={Crosshair}
      iconColorClassName={getStatusTextClass(isHealthy)}
      borderClassName={getStatusBorderClass(isFullyHealthy)}
      isStale={!realtimeConnected}
      onClick={() => onOpenProof('DETECTION')}
    >
      <TruthSegmentHeadline dotClassName={getStatusDotClass(isHealthy)}>
        {!realtimeConnected
          ? `Last Known at ${lastKnownTime}`
          : `${metrics.detectorsHealthy} / ${metrics.activeDetectorsTotal} Verified`}
      </TruthSegmentHeadline>
      <TruthSegmentCaption>
        {!realtimeConnected
          ? 'Canary stream paused'
          : hasNoDegradedDetectors
            ? 'Live Canary Assurance: Pass'
            : '1 Detector Degraded (Jitter)'}
      </TruthSegmentCaption>
    </TruthSegment>
  );
};
