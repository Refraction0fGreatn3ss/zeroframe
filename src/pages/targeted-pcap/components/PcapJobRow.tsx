import type { FC } from 'react';
import type { PcapJob } from '../targeted-pcap.types';
import { formatMegabytes } from '../targeted-pcap.utils';
import { ForensicHashCell } from './ForensicHashCell';
import { PcapJobActions } from './PcapJobActions';
import { PcapJobStatus } from './PcapJobStatus';

interface PcapJobRowProps {
  job: PcapJob;
  copiedHash: string | null;
  onCopyHash: (hash: string) => void;
  onStop: (id: string) => void;
  onDownload: (job: PcapJob) => void;
}

export const PcapJobRow: FC<PcapJobRowProps> = ({ job, copiedHash, onCopyHash, onStop, onDownload }) => (
  <tr className="hover:bg-slate-800/30 transition-colors">
    <td className="py-3 px-3 whitespace-nowrap">
      <div className="font-semibold text-slate-200">{job.name}</div>
      <div className="text-[10px] text-slate-500">
        {job.id} · {job.startedAt}
      </div>
    </td>

    <td className="py-3 px-3 whitespace-nowrap">
      <span className="px-2 py-0.5 rounded bg-[#080c14] border border-slate-800 text-cyan-300 text-[11px]">
        {job.targetBpf}
      </span>
    </td>

    <td className="py-3 px-3 whitespace-nowrap">
      <PcapJobStatus state={job.state} />
    </td>

    <td className="py-3 px-3 whitespace-nowrap text-slate-400 text-[10px]">
      <div>{job.sensorNode}</div>
      <div className="text-slate-600">{job.interfaceId}</div>
    </td>

    <td className="py-3 px-3 text-right whitespace-nowrap tabular-nums">
      <div className="text-slate-200 font-semibold">{job.packetCount.toLocaleString()} pkts</div>
      <div className="text-slate-500 text-[10px]">{formatMegabytes(job.fileSizeBytes)}</div>
    </td>

    <td className="py-3 px-3 whitespace-nowrap text-[10px] max-w-[180px]">
      <ForensicHashCell sha256={job.sha256} isCopied={copiedHash === job.sha256} onCopy={onCopyHash} />
    </td>

    <td className="py-3 px-3 text-right whitespace-nowrap">
      <PcapJobActions job={job} onStop={onStop} onDownload={onDownload} />
    </td>
  </tr>
);
