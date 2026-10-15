import { ShieldCheck } from 'lucide-react';
import type { FC } from 'react';
import { TruthSegment, TruthSegmentCaption, TruthSegmentHeadline } from './TruthSegment';
import type { TruthCategory } from './truth-bar.types';
import { getStatusDotClass, getStatusTextClass, STALE_BORDER_CLASS } from './truth-bar.utils';

interface ResponseSegmentProps {
  killSwitchEngaged: boolean;
  realtimeConnected: boolean;
  onOpenProof: (category: TruthCategory) => void;
}

const getBorderClass = (realtimeConnected: boolean, killSwitchEngaged: boolean): string => {
  if (!realtimeConnected) return STALE_BORDER_CLASS;
  return killSwitchEngaged ? 'border-amber-500/40' : 'border-emerald-500/20';
};

export const ResponseSegment: FC<ResponseSegmentProps> = ({ killSwitchEngaged, realtimeConnected, onOpenProof }) => {
  const isHealthy = realtimeConnected && !killSwitchEngaged;

  return (
    <TruthSegment
      label="Respondable"
      icon={ShieldCheck}
      iconColorClassName={getStatusTextClass(isHealthy)}
      borderClassName={getBorderClass(realtimeConnected, killSwitchEngaged)}
      isStale={!realtimeConnected}
      onClick={() => onOpenProof('RESPONSE')}
    >
      <TruthSegmentHeadline dotClassName={getStatusDotClass(isHealthy)}>
        {!realtimeConnected
          ? `Last Known (${killSwitchEngaged ? 'Blocked' : 'Active'})`
          : killSwitchEngaged
            ? 'Response Blocked'
            : 'Governed Active'}
      </TruthSegmentHeadline>
      <TruthSegmentCaption>
        {!realtimeConnected
          ? 'Stream Disconnected'
          : killSwitchEngaged
            ? 'Safety Kill-Switch Disarmed'
            : 'Dual-Control Permitted'}
      </TruthSegmentCaption>
    </TruthSegment>
  );
};
