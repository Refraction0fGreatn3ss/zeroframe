import type { FC } from 'react';
import { ExportButton } from '../../../components/shared/ExportButton';
import type { InspectionStageDetail } from '../../../types/inspection';

interface InspectionHeaderProps {
  stages: InspectionStageDetail[];
}

export const InspectionHeader: FC<InspectionHeaderProps> = ({ stages }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold text-zinc-100 tracking-tight">Inspection Integrity & Diagnostics</h1>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium">
          Zero-Copy Wire Kernel
        </span>
      </div>
      <p className="text-xs text-zinc-400 mt-0.5">
        Engineering observation diagnostics tracking wire capture, L2–L4 reassembly, blind spot exposure, and telemetry
        resource backpressure.
      </p>
    </div>

    <div className="flex items-center gap-2">
      <ExportButton resourceName="Inspection Diagnostics" recordCount={stages.length} data={stages} />
    </div>
  </div>
);
