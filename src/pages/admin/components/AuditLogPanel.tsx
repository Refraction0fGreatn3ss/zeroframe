import type React from 'react';
import type { DataTableColumn } from '../../../components/page/DataTable';
import { DataTable } from '../../../components/page/DataTable';
import { SecurityStatusBadge } from '../../../components/shared/SecurityStatusBadge';
import { timeAgo } from '../../../lib/utils';
import type { AuditLogEntry } from '../../../types/admin';

const AUDIT_LOG_COLUMNS: readonly DataTableColumn[] = [
  { label: 'Timestamp' },
  { label: 'Operator / Actor' },
  { label: 'Action' },
  { label: 'Target Resource' },
  { label: 'Status' },
  { label: 'Signature Hash', className: 'text-right' },
];

interface AuditLogPanelProps {
  auditLogs: AuditLogEntry[];
}

export const AuditLogPanel: React.FC<AuditLogPanelProps> = ({ auditLogs }) => (
  <DataTable
    columns={AUDIT_LOG_COLUMNS}
    caption={
      <div className="p-3 border-b border-[#20242a] flex items-center justify-between text-xs">
        <span className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">
          Immutable Operator Audit Log
        </span>
        <span className="font-mono text-zinc-500 text-[11px]">SHA-256 tamper-sealed</span>
      </div>
    }
  >
    {auditLogs.map((log) => (
      <tr key={log.id} className="hover:bg-[#15181e] transition-colors">
        <td className="py-2.5 px-3 text-zinc-400 font-mono text-[11px]">{timeAgo(log.timestamp)}</td>
        <td className="py-2.5 px-3">
          <div className="font-medium text-zinc-200">{log.actor}</div>
          <div className="text-[10px] text-zinc-500">{log.actorRole}</div>
        </td>
        <td className="py-2.5 px-3 font-mono font-medium text-zinc-200">{log.action}</td>
        <td className="py-2.5 px-3 text-zinc-300 max-w-sm truncate">{log.targetResource}</td>
        <td className="py-2.5 px-3">
          <SecurityStatusBadge state={log.status} size="sm" />
        </td>
        <td className="py-2.5 px-3 text-right font-mono text-[10px] text-zinc-500">{log.signatureHash}</td>
      </tr>
    ))}
  </DataTable>
);
