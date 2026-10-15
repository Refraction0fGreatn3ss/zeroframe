import { AlertTriangle, Shield } from 'lucide-react';
import type React from 'react';
import { SummaryCard } from './SummaryCard';

const HEALTHY_CAPTURE_STATE = 'HEALTHY';

interface ProtectionPostureCardsProps {
  captureState: string;
  observationCoveragePct: number;
  killSwitchEngaged: boolean;
}

export const ProtectionPostureCards: React.FC<ProtectionPostureCardsProps> = ({
  captureState,
  observationCoveragePct,
  killSwitchEngaged,
}) => {
  const isCaptureHealthy = captureState === HEALTHY_CAPTURE_STATE;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <SummaryCard
        label="Network visibility"
        valueClassName={`text-sm font-semibold flex items-center gap-1.5 ${isCaptureHealthy ? 'text-emerald-400' : 'text-amber-400'}`}
        value={
          <>
            <AlertTriangle className="w-4 h-4" />
            <span>
              {observationCoveragePct.toFixed(1)}% Monitored ({captureState})
            </span>
          </>
        }
        description={
          isCaptureHealthy
            ? 'Zero-copy passive packet tap inspection operational with 0 kernel packet drops.'
            : 'Core-Switch-02 mirror port reports 18% unidirectional flows. Return traffic routed across Link B is unmonitored.'
        }
      />

      <SummaryCard
        label="Autonomous Protection"
        valueClassName={`text-sm font-semibold flex items-center gap-1.5 ${killSwitchEngaged ? 'text-amber-400' : 'text-emerald-400'}`}
        value={
          <>
            <Shield className="w-4 h-4" />
            <span>{killSwitchEngaged ? 'Response Blocked (Kill-Switch Active)' : 'Active Protection Mode'}</span>
          </>
        }
        description={
          killSwitchEngaged
            ? 'Safety kill switch physically engaged. Autonomous responses require explicit manual override.'
            : 'Safety kill switch is disengaged. Authorized quarantine actions require dual-operator approval under Tier 3 rules.'
        }
      />
    </div>
  );
};
