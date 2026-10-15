import type { FC } from 'react';
import type { CryptoInspectionMetrics, EncapsulationIntegrity, InspectionStageDetail } from '../../../types/inspection';
import { CryptoDissectionPanel } from './CryptoDissectionPanel';
import { EncapsulationPanel } from './EncapsulationPanel';
import { PipelineStagesPanel } from './PipelineStagesPanel';

interface PipelineViewProps {
  stages: InspectionStageDetail[];
  encapsulation: EncapsulationIntegrity;
  crypto: CryptoInspectionMetrics;
  expandedStage: string | null;
  onToggleStage: (stage: string) => void;
}

export const PipelineView: FC<PipelineViewProps> = ({
  stages,
  encapsulation,
  crypto,
  expandedStage,
  onToggleStage,
}) => (
  <div className="space-y-4">
    <PipelineStagesPanel stages={stages} expandedStage={expandedStage} onToggleStage={onToggleStage} />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
      <EncapsulationPanel encapsulation={encapsulation} />
      <CryptoDissectionPanel crypto={crypto} />
    </div>
  </div>
);
