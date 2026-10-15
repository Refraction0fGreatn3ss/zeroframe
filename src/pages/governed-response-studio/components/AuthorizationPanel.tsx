import type { FC } from 'react';
import type { ResponseActionState } from '../../../types';
import { PRIMARY_APPROVER, SECONDARY_APPROVER } from '../governed-response-studio.data';
import { ApproverCard } from './ApproverCard';
import { ExecutionControls } from './ExecutionControls';

interface AuthorizationPanelProps {
  permitId: string | null;
  approver1Signed: boolean;
  approver2Signed: boolean;
  isSubmitting: boolean;
  isExecuting: boolean;
  killSwitchEngaged: boolean;
  executionState: ResponseActionState;
  onSignSecondApprover: () => void;
  onExecute: () => void;
  onRollback: () => void;
}

export const AuthorizationPanel: FC<AuthorizationPanelProps> = ({
  permitId,
  approver1Signed,
  approver2Signed,
  isSubmitting,
  isExecuting,
  killSwitchEngaged,
  executionState,
  onSignSecondApprover,
  onExecute,
  onRollback,
}) => (
  <div className="lg:col-span-5 bg-[#101215] border border-[#20242a] rounded p-4 space-y-4 text-xs font-sans">
    <div className="flex items-center justify-between border-b border-[#20242a] pb-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Authorization & Execution</h3>
      {permitId && (
        <span className="font-mono text-[10px] text-cyan-400 font-bold bg-[#14171c] px-1.5 py-0.5 rounded border border-[#20242a]">
          {permitId}
        </span>
      )}
    </div>

    <div className="space-y-2">
      <ApproverCard
        approver={PRIMARY_APPROVER}
        isSigned={approver1Signed}
        pendingContent={<span className="text-amber-400 text-xs font-medium">Pending Proposal</span>}
      />

      <ApproverCard
        approver={SECONDARY_APPROVER}
        isSigned={approver2Signed}
        pendingContent={
          <button
            type="button"
            onClick={onSignSecondApprover}
            disabled={!approver1Signed || isSubmitting}
            className={`px-2.5 py-1 rounded border text-xs font-medium transition-colors ${
              !approver1Signed
                ? 'bg-[#181b20] border-[#20242a] text-zinc-600 cursor-not-allowed'
                : 'bg-[#1c2026] border-[#2e3440] hover:bg-[#252b35] text-zinc-200 cursor-pointer'
            }`}
          >
            {isSubmitting ? 'Co-signing...' : 'Co-Sign (Approver 2)'}
          </button>
        }
      />
    </div>

    <ExecutionControls
      executionState={executionState}
      approver1Signed={approver1Signed}
      approver2Signed={approver2Signed}
      isExecuting={isExecuting}
      killSwitchEngaged={killSwitchEngaged}
      onExecute={onExecute}
      onRollback={onRollback}
    />
  </div>
);
