import type { FC, ReactNode } from 'react';
import type { Approver } from '../governed-response-studio.types';

interface ApproverCardProps {
  approver: Approver;
  isSigned: boolean;
  pendingContent: ReactNode;
}

export const ApproverCard: FC<ApproverCardProps> = ({ approver, isSigned, pendingContent }) => (
  <div className="p-3 bg-[#131518] border border-[#20242a] rounded flex items-center justify-between">
    <div>
      <span className="text-zinc-200 font-medium block">{approver.title}</span>
      <span className="text-[11px] text-zinc-500">{approver.role}</span>
    </div>
    {isSigned ? (
      <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">✓ Approved</span>
    ) : (
      pendingContent
    )}
  </div>
);
