/**
 * Witness Components & Dual-Control Permitting View
 * Restrained enterprise design: clear approvers, blast radius score, notary status.
 */

import React from 'react';
import { Shield, Key, CheckCircle, Clock } from 'lucide-react';
import { SecurityStatusBadge } from './SecurityStatusBadge';

interface WitnessPermitProps {
  permitId: string;
  action: string;
  target: string;
  blastRadiusScore: number;
  approver1: { name: string; status: 'APPROVED' | 'PENDING' | 'REJECTED'; timestamp?: string };
  approver2: { name: string; status: 'APPROVED' | 'PENDING' | 'REJECTED'; timestamp?: string };
  witnessNotaryStatus: 'VERIFIED' | 'PENDING_QUORUM' | 'REJECTED';
  onApprove?: () => void;
  isApproving?: boolean;
}

export const WitnessPermitCard: React.FC<WitnessPermitProps> = ({
  permitId,
  action,
  target,
  blastRadiusScore,
  approver1,
  approver2,
  witnessNotaryStatus,
  onApprove,
  isApproving,
}) => {
  return (
    <div className="p-4 bg-[#101215] border border-[#20242a] rounded text-[#e6edf3] text-xs font-sans space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[#20242a]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-zinc-400" />
          <span className="font-mono font-bold text-zinc-200">{permitId}</span>
          <span className="text-zinc-500 text-[11px]">Dual-Custody Permit</span>
        </div>
        <SecurityStatusBadge state={witnessNotaryStatus} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase font-semibold">ACTION</span>
          <span className="text-zinc-200 font-medium">{action}</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase font-semibold">TARGET ASSET</span>
          <span className="text-zinc-200">{target}</span>
        </div>
        <div className="col-span-2">
          <span className="text-zinc-500 block text-[10px] uppercase font-semibold">BLAST RADIUS LIMIT</span>
          <span className={blastRadiusScore > 70 ? 'text-rose-400 font-medium' : 'text-zinc-300'}>
            Score {blastRadiusScore} / 100 {blastRadiusScore > 70 ? '(High impact)' : '(Narrow radius)'}
          </span>
        </div>
      </div>

      {/* Dual Approvers */}
      <div className="p-2.5 bg-[#131518] rounded border border-[#20242a] space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Key className="w-3.5 h-3.5 text-zinc-500" />
            <span>Approver 1: {approver1.name}</span>
          </div>
          {approver1.status === 'APPROVED' ? (
            <span className="text-emerald-400 font-medium">Approved</span>
          ) : (
            <span className="text-amber-400 font-medium">Pending</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Key className="w-3.5 h-3.5 text-zinc-500" />
            <span>Approver 2: {approver2.name}</span>
          </div>
          {approver2.status === 'APPROVED' ? (
            <span className="text-emerald-400 font-medium">Approved</span>
          ) : onApprove ? (
            <button
              onClick={onApprove}
              disabled={isApproving}
              className="px-2 py-0.5 rounded bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              {isApproving ? 'Co-signing...' : 'Co-Sign & Authorize'}
            </button>
          ) : (
            <span className="text-amber-400 font-medium">Pending</span>
          )}
        </div>
      </div>
    </div>
  );
};
