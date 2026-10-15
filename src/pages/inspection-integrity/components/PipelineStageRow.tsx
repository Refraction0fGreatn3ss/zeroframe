import { AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import type { FC } from 'react';
import { SecurityStatusBadge } from '../../../components/shared/SecurityStatusBadge';
import { formatBitsPerSec, formatNumber } from '../../../lib/utils';
import type { InspectionStageDetail } from '../../../types/inspection';

interface PipelineStageRowProps {
  stage: InspectionStageDetail;
  isExpanded: boolean;
  onToggle: (stage: string) => void;
}

export const PipelineStageRow: FC<PipelineStageRowProps> = ({ stage: stg, isExpanded, onToggle }) => (
  <div className="transition-colors hover:bg-[#15181e]">
    <div
      onClick={() => onToggle(stg.stage)}
      className="p-3 flex items-center justify-between cursor-pointer select-none text-xs"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-zinc-500 w-6 text-center">{stg.stage.charAt(0)}</span>
        <div>
          <span className="font-semibold text-zinc-100">{stg.stage} Layer</span>
          <span className="text-zinc-400 text-[11px] ml-2 font-mono">
            {formatNumber(stg.packetRate)} pps · {formatBitsPerSec(stg.byteRate)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SecurityStatusBadge state={stg.state} size="sm" />
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        )}
      </div>
    </div>

    {isExpanded && (
      <div className="px-5 pb-3 pt-1 bg-[#0b0e13] text-xs font-sans space-y-2 border-t border-[#181b20]">
        <p className="text-zinc-300 leading-relaxed text-xs">{stg.notes}</p>

        {stg.primaryCause && (
          <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Diagnostic cause: {stg.primaryCause}</span>
          </div>
        )}
      </div>
    )}
  </div>
);
