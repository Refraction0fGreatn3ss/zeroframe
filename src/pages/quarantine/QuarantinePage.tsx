import type React from 'react';
import type { DataTableColumn } from '../../components/page/DataTable';
import { DataTable } from '../../components/page/DataTable';
import { HeaderActions } from '../../components/page/HeaderActions';
import { PageHeader } from '../../components/page/PageHeader';
import { TableEmptyRow } from '../../components/page/TableEmptyRow';
import { ExportButton } from '../../components/shared/ExportButton';
import { SecurityStatusBadge } from '../../components/shared/SecurityStatusBadge';
import { useRollbackStore } from '../../stores/rollback-store';

const DEFAULT_QUARANTINE_STATUS = 'ACTIVE_ENFORCED';
const DEFAULT_LEASE_LABEL = '30m lease';

const QUARANTINE_COLUMNS: readonly DataTableColumn[] = [
  { label: 'Status', className: 'w-28' },
  { label: 'Quarantine ID' },
  { label: 'Target Asset' },
  { label: 'Mechanism' },
  { label: 'Enforced At' },
  { label: 'Lease Expires' },
  { label: 'Action', className: 'text-right' },
];

const formatTime = (isoTimestamp: string | undefined, fallback: string): string =>
  isoTimestamp ? new Date(isoTimestamp).toLocaleTimeString() : fallback;

export const QuarantinePage: React.FC = () => {
  const { quarantineHosts, liftQuarantine, isRollingBack } = useRollbackStore();

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      <PageHeader
        title="Active Network Quarantine & Isolation"
        description="Verified containment drop chains with automatic reversal leases."
        actions={
          <HeaderActions>
            <ExportButton resourceName="Quarantine Rules" recordCount={quarantineHosts.length} data={quarantineHosts} />
          </HeaderActions>
        }
      />

      <DataTable columns={QUARANTINE_COLUMNS}>
        {quarantineHosts.length === 0 ? (
          <TableEmptyRow colSpan={QUARANTINE_COLUMNS.length}>
            No active network quarantine drop chains for this tenant scope.
          </TableEmptyRow>
        ) : (
          quarantineHosts.map((host) => (
            <tr key={host.id} className="hover:bg-[#15181e] transition-colors">
              <td className="py-2.5 px-3">
                <SecurityStatusBadge state={host.status || DEFAULT_QUARANTINE_STATUS} size="sm" />
              </td>
              <td className="py-2.5 px-3 font-mono text-zinc-200">{host.id}</td>
              <td className="py-2.5 px-3">
                <div className="font-medium text-zinc-100">{host.hostname}</div>
                <div className="font-mono text-[11px] text-zinc-400">{host.targetIp}</div>
              </td>
              <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-300">{host.mechanism}</td>
              <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">{formatTime(host.enforcedAt, '—')}</td>
              <td className="py-2.5 px-3 font-mono text-[11px] text-amber-300">
                {formatTime(host.leaseExpiresAt, DEFAULT_LEASE_LABEL)}
              </td>
              <td className="py-2.5 px-3 text-right">
                <button
                  type="button"
                  onClick={() => liftQuarantine(host.id)}
                  disabled={isRollingBack}
                  className="px-2.5 py-1 rounded bg-[#181b20] border border-[#2a2f38] hover:bg-[#20242a] text-zinc-300 text-xs font-medium cursor-pointer transition-colors"
                >
                  Lift Isolation
                </button>
              </td>
            </tr>
          ))
        )}
      </DataTable>
    </div>
  );
};
