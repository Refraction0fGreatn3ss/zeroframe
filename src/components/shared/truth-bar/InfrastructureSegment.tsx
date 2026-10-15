import { Server } from 'lucide-react';
import type { FC } from 'react';
import { TruthSegment, TruthSegmentCaption } from './TruthSegment';
import type { TruthSegmentStatusProps } from './truth-bar.types';
import { STALE_BORDER_CLASS, STALE_TEXT_CLASS } from './truth-bar.utils';

export const InfrastructureSegment: FC<TruthSegmentStatusProps> = ({
  metrics,
  realtimeConnected,
  lastKnownTime,
  onOpenProof,
}) => (
  <TruthSegment
    label="Exists"
    icon={Server}
    iconColorClassName={!realtimeConnected ? STALE_TEXT_CLASS : 'text-[var(--zf-brand-accent)]'}
    borderClassName={!realtimeConnected ? STALE_BORDER_CLASS : 'border-[var(--zf-border-subtle)]'}
    isStale={!realtimeConnected}
    onClick={() => onOpenProof('INFRASTRUCTURE')}
  >
    <div className="font-semibold text-xs text-[var(--zf-text-primary)] truncate">
      {metrics.totalKnownEntities > 0 ? `${metrics.totalKnownEntities.toLocaleString()} Entities` : 'Discovering...'}
    </div>
    <TruthSegmentCaption>
      {!realtimeConnected
        ? `Last known: ${lastKnownTime}`
        : `${metrics.criticalProtectedAssets} Crown Jewels · ${metrics.knownSubnets} Subnets`}
    </TruthSegmentCaption>
  </TruthSegment>
);
