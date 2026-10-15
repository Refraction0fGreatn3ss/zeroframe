import { Play, RotateCcw } from 'lucide-react';
import type { FC } from 'react';
import { SecurityStatusBadge } from '../../../components/shared/SecurityStatusBadge';
import type { ResponseActionState } from '../../../types';
import { getExecuteButtonClassName, getExecuteButtonLabel } from '../governed-response-studio.utils';

interface ExecutionControlsProps {
  executionState: ResponseActionState;
  approver1Signed: boolean;
  approver2Signed: boolean;
  isExecuting: boolean;
  killSwitchEngaged: boolean;
  onExecute: () => void;
  onRollback: () => void;
}

export const ExecutionControls: FC<ExecutionControlsProps> = ({
  executionState,
  approver1Signed,
  approver2Signed,
  isExecuting,
  killSwitchEngaged,
  onExecute,
  onRollback,
}) => (
  <div className="pt-2 border-t border-[#20242a] space-y-3">
    <div className="flex items-center justify-between text-xs">
      <span className="text-zinc-400">Execution Status:</span>
      <SecurityStatusBadge state={executionState} size="sm" />
    </div>

    <button
      type="button"
      onClick={onExecute}
      disabled={
        !approver1Signed || !approver2Signed || isExecuting || killSwitchEngaged || executionState === 'VERIFIED'
      }
      className={`w-full py-2.5 rounded text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${getExecuteButtonClassName(executionState, approver2Signed, killSwitchEngaged)}`}
    >
      <Play className="w-3.5 h-3.5" />
      <span>{getExecuteButtonLabel(isExecuting, executionState)}</span>
    </button>

    {executionState === 'VERIFIED' && (
      <button
        type="button"
        onClick={onRollback}
        className="w-full py-2 rounded bg-[#181b20] border border-[#2a2f38] hover:bg-[#20242a] text-zinc-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
        <span>Rollback Action Immediately</span>
      </button>
    )}
  </div>
);
