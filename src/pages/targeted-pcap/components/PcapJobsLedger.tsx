import type { FC } from 'react';
import type { PcapJob } from '../targeted-pcap.types';
import { PcapJobRow } from './PcapJobRow';

interface PcapJobsLedgerProps {
  jobs: PcapJob[];
  copiedHash: string | null;
  onCopyHash: (hash: string) => void;
  onStop: (id: string) => void;
  onDownload: (job: PcapJob) => void;
}

export const PcapJobsLedger: FC<PcapJobsLedgerProps> = ({ jobs, copiedHash, onCopyHash, onStop, onDownload }) => (
  <div className="bg-[#0b101d] border border-slate-800 rounded overflow-hidden flex flex-col">
    <div className="p-3 bg-[#0e1526] border-b border-slate-800 text-xs text-slate-300 flex items-center justify-between font-mono">
      <div className="flex items-center gap-2">
        <span className="text-slate-100 font-semibold">Captured Wire Slices</span>
        <span className="text-slate-500">·</span>
        <span className="text-cyan-400">{jobs.length} Evidence Records</span>
      </div>
      <span className="text-[10px] text-slate-500">Immutable Storage Vault</span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-mono">
        <thead className="bg-[#080c14] border-b border-slate-800 text-slate-400 text-[10px] uppercase font-semibold">
          <tr>
            <th className="py-2.5 px-3">Job ID & Name</th>
            <th className="py-2.5 px-3">BPF Filter Syntax</th>
            <th className="py-2.5 px-3">Status</th>
            <th className="py-2.5 px-3">Sensor Node</th>
            <th className="py-2.5 px-3 text-right">Packets / Size</th>
            <th className="py-2.5 px-3">SHA-256 Forensic Stamp</th>
            <th className="py-2.5 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80 text-slate-300 text-[11px]">
          {jobs.map((job) => (
            <PcapJobRow
              key={job.id}
              job={job}
              copiedHash={copiedHash}
              onCopyHash={onCopyHash}
              onStop={onStop}
              onDownload={onDownload}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
