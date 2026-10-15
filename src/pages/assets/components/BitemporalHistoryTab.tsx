import { Clock } from 'lucide-react';
import type { FC } from 'react';
import type { LivingEntity } from '../../../types';
import { getBitemporalHistory } from '../assets.utils';
import { BitemporalRecordCard } from './BitemporalRecordCard';

interface BitemporalHistoryTabProps {
  entity: LivingEntity;
}

export const BitemporalHistoryTab: FC<BitemporalHistoryTabProps> = ({ entity }) => (
  <div className="space-y-4 pt-4 text-xs">
    <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded text-[11px] text-cyan-200 space-y-1">
      <div className="font-semibold flex items-center gap-1.5 text-cyan-300">
        <Clock className="w-3.5 h-3.5" />
        <span>Bitemporal Ledger Reconciliation</span>
      </div>
      <p className="text-zinc-400 leading-relaxed font-sans">
        Every asset attribute transition preserves two temporal dimensions:{' '}
        <strong className="text-slate-200">Valid Time</strong> (when the event occurred on the wire) and{' '}
        <strong className="text-slate-200">Transaction Time</strong> (when it was committed into the immutable
        cryptographic audit ledger).
      </p>
    </div>

    <div className="space-y-3">
      {getBitemporalHistory(entity).map((record) => (
        <BitemporalRecordCard key={record.id} record={record} />
      ))}
    </div>
  </div>
);
