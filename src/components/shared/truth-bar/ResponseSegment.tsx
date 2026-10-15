import { ShieldCheck } from 'lucide-react';
import type { FC } from 'react';
import type { KillSwitchState } from '../../../stores/kill-switch-store';
import { TruthSegment, TruthSegmentCaption, TruthSegmentHeadline } from './TruthSegment';
import type { TruthCategory } from './truth-bar.types';
import { getStatusDotClass, getStatusTextClass, STALE_BORDER_CLASS } from './truth-bar.utils';

interface ResponseSegmentProps {
  killSwitch: KillSwitchState;
  realtimeConnected: boolean;
  onOpenProof: (category: TruthCategory) => void;
}

const KILL_SWITCH_LABELS: Record<KillSwitchState, { headline: string; caption: string; border: string }> = {
  ENGAGED: { headline: 'Response Blocked', caption: 'Safety Kill-Switch Engaged', border: 'border-amber-500/40' },
  DISENGAGED: { headline: 'Governed Active', caption: 'Dual-Control Permitted', border: 'border-emerald-500/20' },
  UNKNOWN: { headline: 'Response Unknown', caption: 'Kill-Switch Unconfirmed', border: STALE_BORDER_CLASS },
};

export const ResponseSegment: FC<ResponseSegmentProps> = ({ killSwitch, realtimeConnected, onOpenProof }) => {
  const isHealthy = realtimeConnected && killSwitch === 'DISENGAGED';
  const labels = KILL_SWITCH_LABELS[killSwitch];

  return (
    <TruthSegment
      label="Respondable"
      icon={ShieldCheck}
      iconColorClassName={getStatusTextClass(isHealthy)}
      borderClassName={realtimeConnected ? labels.border : STALE_BORDER_CLASS}
      isStale={!realtimeConnected}
      onClick={() => onOpenProof('RESPONSE')}
    >
      <TruthSegmentHeadline dotClassName={getStatusDotClass(isHealthy)}>
        {realtimeConnected ? labels.headline : `Last Known (${labels.headline})`}
      </TruthSegmentHeadline>
      <TruthSegmentCaption>{realtimeConnected ? labels.caption : 'Stream Disconnected'}</TruthSegmentCaption>
    </TruthSegment>
  );
};
