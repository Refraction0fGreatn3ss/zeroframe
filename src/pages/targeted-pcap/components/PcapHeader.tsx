import type { FC } from 'react';
import { ExportButton } from '../../../components/shared/ExportButton';
import type { PcapJob } from '../targeted-pcap.types';

interface PcapHeaderProps {
  jobs: PcapJob[];
}

export const PcapHeader: FC<PcapHeaderProps> = ({ jobs }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold tracking-tight text-slate-100">
          Targeted PCAP Extraction & Forensic Slicing Lab
        </h1>
        <span className="text-[11px] font-mono text-cyan-400 font-medium">Zero-Copy Wire Slicer Active</span>
      </div>
      <p className="text-xs text-slate-400 mt-0.5">
        Microsecond packet extraction from optical taps and eBPF circular memory buffers with SHA-256 chain-of-custody
        seals.
      </p>
    </div>

    <div className="flex items-center gap-2">
      <ExportButton resourceName="PCAP Capture Manifest" recordCount={jobs.length} data={jobs} />
    </div>
  </div>
);
