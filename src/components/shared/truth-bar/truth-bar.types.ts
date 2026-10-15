import type { CommandCenterMetrics } from '../../../stores/dashboard-store';

export type TruthCategory = 'INFRASTRUCTURE' | 'VISIBILITY' | 'DETECTION' | 'RESPONSE';

export interface TruthSegmentStatusProps {
  metrics: CommandCenterMetrics;
  realtimeConnected: boolean;
  lastKnownTime: string;
  onOpenProof: (category: TruthCategory) => void;
}
