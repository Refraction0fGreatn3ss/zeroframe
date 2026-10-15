import { ChevronRight } from 'lucide-react';
import type { FC } from 'react';
import type { BitemporalHistoryRecord } from '../../../types';
import { getProvenanceBadgeClassName } from '../assets.utils';

interface BitemporalRecordCardProps {
  record: BitemporalHistoryRecord;
}

export const BitemporalRecordCard: FC<BitemporalRecordCardProps> = ({ record }) => (
  <div className="p-3 bg-[#11141a] rounded border border-[#20242a] space-y-2 font-mono text-[11px]">
    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
      <div className="flex items-center gap-2">
        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">{record.field}</span>
        <span className="text-zinc-500 text-[10px]">{record.id}</span>
      </div>
      <span className={`text-[10px] px-1.5 py-0.2 rounded border ${getProvenanceBadgeClassName(record.provenance)}`}>
        {record.provenance}
      </span>
    </div>

    <div className="flex items-center gap-2 text-xs font-sans">
      <span className="text-zinc-500 font-mono line-through">{record.oldValue}</span>
      <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
      <span className="text-emerald-300 font-mono font-semibold">{record.newValue}</span>
    </div>

    <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 pt-1 border-t border-slate-800/60">
      <div>
        <span className="text-zinc-500 block">Valid Time (Physical Reality):</span>
        <span className="text-zinc-300">{new Date(record.validTime).toLocaleString()}</span>
      </div>
      <div>
        <span className="text-zinc-500 block">Transaction Time (Ledger Commit):</span>
        <span className="text-zinc-300">{new Date(record.transactionTime).toLocaleString()}</span>
      </div>
    </div>

    <div className="text-[10px] text-zinc-500">
      Recorded by: <span className="text-zinc-300">{record.recordedBy}</span>
    </div>
  </div>
);
