import type { FC } from 'react';
import type { InspectionStageDetail } from '../../../types/inspection';
import { PipelineStageRow } from './PipelineStageRow';

interface PipelineStagesPanelProps {
  stages: InspectionStageDetail[];
  expandedStage: string | null;
  onToggleStage: (stage: string) => void;
}

export const PipelineStagesPanel: FC<PipelineStagesPanelProps> = ({ stages, expandedStage, onToggleStage }) => (
  <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden shadow-xs">
    <div className="p-3 border-b border-[#20242a] flex items-center justify-between bg-[#14171c]">
      <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
        Observation Pipeline Diagnostics (7 Layers)
      </span>
      <span className="text-xs font-mono text-zinc-400">Kernel driver: zeroframe_afxdp_core</span>
    </div>

    <div className="divide-y divide-[#181b20]">
      {stages.map((stg) => (
        <PipelineStageRow
          key={stg.stage}
          stage={stg}
          isExpanded={expandedStage === stg.stage}
          onToggle={onToggleStage}
        />
      ))}
    </div>
  </div>
);
