import { Key, Shield } from 'lucide-react';
import type { FC } from 'react';
import { SecurityStatusBadge } from './SecurityStatusBadge';

const HIGH_IMPACT_BLAST_RADIUS = 70;

type ApprovalStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

interface Approver {
  name: string;
  status: ApprovalStatus;
  timestamp?: string;
}

interface WitnessPermitProps {
  permitId: string;
  action: string;
  target: string;
  blastRadiusScore: number;
  approver1: Approver;
  approver2: Approver;
  witnessNotaryStatus: 'VERIFIED' | 'PENDING_QUORUM' | 'REJECTED';
  onApprove?: () => void;
  isApproving?: boolean;
}

const ApprovedLabel: FC = () => <span className="text-emerald-400 font-medium">Approved</span>;
const PendingLabel: FC = () => <span className="text-amber-400 font-medium">Pending</span>;

interface ApproverRowProps {
  slot: number;
  approver: Approver;
  onApprove?: () => void;
  isApproving?: boolean;
}

const ApproverRow: FC<ApproverRowProps> = ({ slot, approver, onApprove, isApproving }) => {
  const renderStatus = () => {
    if (approver.status === 'APPROVED') return <ApprovedLabel />;
    if (onApprove) {
      return (
        <button
          type="button"
          onClick={onApprove}
          disabled={isApproving}
          className="px-2 py-0.5 rounded bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 text-xs font-semibold cursor-pointer transition-colors"
        >
          {isApproving ? 'Co-signing...' : 'Co-Sign & Authorize'}
        </button>
      );
    }
    return <PendingLabel />;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-zinc-300">
        <Key className="w-3.5 h-3.5 text-zinc-500" />
        <span>
          Approver {slot}: {approver.name}
        </span>
      </div>
      {renderStatus()}
    </div>
  );
};

export const WitnessPermitCard: FC<WitnessPermitProps> = ({
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
  const isHighImpact = blastRadiusScore > HIGH_IMPACT_BLAST_RADIUS;

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
          <span className={isHighImpact ? 'text-rose-400 font-medium' : 'text-zinc-300'}>
            Score {blastRadiusScore} / 100 {isHighImpact ? '(High impact)' : '(Narrow radius)'}
          </span>
        </div>
      </div>

      <div className="p-2.5 bg-[#131518] rounded border border-[#20242a] space-y-2 text-xs">
        <ApproverRow slot={1} approver={approver1} />
        <ApproverRow slot={2} approver={approver2} onApprove={onApprove} isApproving={isApproving} />
      </div>
    </div>
  );
};
