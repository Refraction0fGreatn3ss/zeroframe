import { Eye } from 'lucide-react';
import type { FC } from 'react';
import { TruthSegment, TruthSegmentCaption, TruthSegmentHeadline } from './TruthSegment';
import type { TruthSegmentStatusProps } from './truth-bar.types';
import { getStatusBorderClass, getStatusDotClass, getStatusTextClass, toPercent } from './truth-bar.utils';

const getHeadline = ({ metrics, realtimeConnected, lastKnownTime }: TruthSegmentStatusProps): string => {
  if (!realtimeConnected) return `Last Known at ${lastKnownTime}`;
  if (metrics.observationCoveragePct > 0) return `${metrics.observationCoveragePct.toFixed(1)}% Coverage`;
  return 'Analyzing';
};

const getCaption = ({ metrics, realtimeConnected }: TruthSegmentStatusProps): string => {
  if (!realtimeConnected) return 'Realtime link severed';
  if (metrics.captureState === 'HEALTHY') return 'Bidirectional TAP Nominal';
  return `${toPercent(metrics.asymmetricTrafficRatio, 0)}% Asymmetric Flows`;
};

export const VisibilitySegment: FC<TruthSegmentStatusProps> = (props) => {
  const { metrics, realtimeConnected, onOpenProof } = props;
  const isHealthy = realtimeConnected && metrics.captureState === 'HEALTHY';

  return (
    <TruthSegment
      label="Visible"
      icon={Eye}
      iconColorClassName={getStatusTextClass(isHealthy)}
      borderClassName={getStatusBorderClass(isHealthy)}
      isStale={!realtimeConnected}
      onClick={() => onOpenProof('VISIBILITY')}
    >
      <TruthSegmentHeadline dotClassName={getStatusDotClass(isHealthy)}>{getHeadline(props)}</TruthSegmentHeadline>
      <TruthSegmentCaption>{getCaption(props)}</TruthSegmentCaption>
    </TruthSegment>
  );
};
