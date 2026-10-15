import { Download, Square } from 'lucide-react';
import type { FC } from 'react';
import type { PcapJob } from '../targeted-pcap.types';

interface PcapJobActionsProps {
  job: PcapJob;
  onStop: (id: string) => void;
  onDownload: (job: PcapJob) => void;
}

export const PcapJobActions: FC<PcapJobActionsProps> = ({ job, onStop, onDownload }) => (
  <div className="flex items-center justify-end gap-1.5">
    {job.state === 'CAPTURING' ? (
      <button
        type="button"
        onClick={() => onStop(job.id)}
        className="py-1 px-2.5 rounded bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
      >
        <Square className="w-2.5 h-2.5 fill-rose-300" />
        <span>Close & Hash</span>
      </button>
    ) : (
      <button
        type="button"
        onClick={() => onDownload(job)}
        className="py-1 px-2.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
      >
        <Download className="w-3 h-3" />
        <span>.pcapng</span>
      </button>
    )}
  </div>
);
