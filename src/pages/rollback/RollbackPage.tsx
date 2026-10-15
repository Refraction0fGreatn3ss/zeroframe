import { RotateCcw } from 'lucide-react';
import type React from 'react';
import type { DataTableColumn } from '../../components/page/DataTable';
import { DataTable } from '../../components/page/DataTable';
import { PageHeader } from '../../components/page/PageHeader';
import { SecurityStatusBadge } from '../../components/shared/SecurityStatusBadge';
import { useRollbackStore } from '../../stores/rollback-store';

const CHECKPOINT_COLUMNS: readonly DataTableColumn[] = [
  { label: 'Status', className: 'w-28' },
  { label: 'Checkpoint Name & ID' },
  { label: 'Target' },
  { label: 'Reversal Action' },
  { label: 'Executed By' },
  { label: 'Action', className: 'text-right' },
];

export const RollbackPage: React.FC = () => {
  const { checkpoints, executeRollback, isRollingBack } = useRollbackStore();

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      <PageHeader
        title="Safe Rollback Console"
        description="Atomic reversion checkpoints for active response actions and sensor configuration pushes."
      />

      <DataTable columns={CHECKPOINT_COLUMNS}>
        {checkpoints.map((checkpoint) => (
          <tr key={checkpoint.id} className="hover:bg-[#15181e] transition-colors">
            <td className="py-2.5 px-3">
              <SecurityStatusBadge state={checkpoint.status} size="sm" />
            </td>
            <td className="py-2.5 px-3">
              <div className="font-medium text-zinc-100">{checkpoint.name}</div>
              <div className="font-mono text-[10px] text-zinc-500">{checkpoint.id}</div>
            </td>
            <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-300">{checkpoint.target}</td>
            <td className="py-2.5 px-3 text-zinc-400">{checkpoint.reversalAction}</td>
            <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">{checkpoint.executedBy}</td>
            <td className="py-2.5 px-3 text-right">
              {checkpoint.status === 'READY' ? (
                <button
                  type="button"
                  onClick={() => executeRollback(checkpoint.id)}
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
      </DataTable>
    </div>
  );
};
