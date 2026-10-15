import type React from 'react';
import type { QuadrantEntity } from '../hunt.types';
import { DnsEntropyChart } from './DnsEntropyChart';
import { FlowTimeHistogram } from './FlowTimeHistogram';
import { ThreatQuadrant } from './ThreatQuadrant';
import { TopPortsChart } from './TopPortsChart';

interface HuntGraphsSectionProps {
  selectedQuadrantEntityId: string | null;
  onSelectQuadrantEntity: (entity: QuadrantEntity) => void;
  onSelectTimeBucket: (time: string) => void;
  onApplyTunnelingFilter: () => void;
  onSelectPort: (port: number) => void;
}

export const HuntGraphsSection: React.FC<HuntGraphsSectionProps> = ({
  selectedQuadrantEntityId,
  onSelectQuadrantEntity,
  onSelectTimeBucket,
  onApplyTunnelingFilter,
  onSelectPort,
}) => (
  <div className="space-y-3">
    <FlowTimeHistogram onSelectBucket={onSelectTimeBucket} />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <ThreatQuadrant selectedEntityId={selectedQuadrantEntityId} onSelectEntity={onSelectQuadrantEntity} />
      <DnsEntropyChart onApplyTunnelingFilter={onApplyTunnelingFilter} />
      <TopPortsChart onSelectPort={onSelectPort} />
    </div>
  </div>
);
