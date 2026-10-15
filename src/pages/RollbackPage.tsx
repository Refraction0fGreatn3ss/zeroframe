/**
 * Safe Rollback Console
 * Instant, atomic reversion for response actions and sensor configuration changes.
 */

import React from 'react';
import { useRollbackStore } from '../stores/rollback-store';
import { SecurityStatusBadge } from '../components/shared/SecurityStatusBadge';
import { RotateCcw } from 'lucide-react';

export const RollbackPage: React.FC = () => {
  const { checkpoints, executeRollback, isRollingBack } = useRollbackStore();

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Safe Rollback Console</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Atomic reversion checkpoints for active response actions and sensor configuration pushes.
          </p>
        </div>
      </div>

      {/* Checkpoints Table */}
      <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#14171c] border-b border-[#20242a] text-zinc-400 text-[11px] font-medium">
              <tr>
                <th className="py-2.5 px-3 w-28">Status</th>
                <th className="py-2.5 px-3">Checkpoint Name & ID</th>
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-3">Reversal Action</th>
                <th className="py-2.5 px-3">Executed By</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181b20] text-zinc-300">
              {checkpoints.map((cp) => (
                <tr key={cp.id} className="hover:bg-[#15181e] transition-colors">
                  <td className="py-2.5 px-3">
                    <SecurityStatusBadge state={cp.status} size="sm" />
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-zinc-100">{cp.name}</div>
                    <div className="font-mono text-[10px] text-zinc-500">{cp.id}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-300">{cp.target}</td>
                  <td className="py-2.5 px-3 text-zinc-400">{cp.reversalAction}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">{cp.executedBy}</td>
                  <td className="py-2.5 px-3 text-right">
                    {cp.status === 'READY' ? (
                      <button
                        onClick={() => executeRollback(cp.id)}
                        disabled={isRollingBack}
                        className="px-2.5 py-1 rounded bg-[#181b20] border border-[#2a2f38] hover:bg-[#20242a] text-zinc-200 text-xs font-medium cursor-pointer transition-colors inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3 h-3 text-amber-400" />
                        <span>{isRollingBack ? 'Reverting...' : 'Rollback'}</span>
                      </button>
                    ) : (
                      <span className="text-zinc-500 font-mono text-[11px]">Reverted</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
