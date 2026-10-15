import type React from 'react';
import type { DataTableColumn } from '../../../components/page/DataTable';
import { DataTable } from '../../../components/page/DataTable';
import { SecurityStatusBadge } from '../../../components/shared/SecurityStatusBadge';
import { timeAgo } from '../../../lib/utils';
import type { ComplianceControl } from '../../../types/compliance';

const CONTROL_COLUMNS: readonly DataTableColumn[] = [
  { label: 'Control ID', className: 'w-32' },
  { label: 'Control Name & Description' },
  { label: 'Evidence State', className: 'w-36' },
  { label: 'Artifact Count' },
  { label: 'Last Checked' },
  { label: 'Evidence Reference', className: 'text-right' },
];

interface ControlsTableProps {
  controls: ComplianceControl[];
}

export const ControlsTable: React.FC<ControlsTableProps> = ({ controls }) => (
  <DataTable columns={CONTROL_COLUMNS}>
    {controls.map((control) => (
      <tr key={control.controlId} className="hover:bg-[#15181e] transition-colors">
        <td className="py-2.5 px-3 font-mono font-medium text-zinc-200">{control.controlId}</td>
        <td className="py-2.5 px-3 max-w-md">
          <div className="font-medium text-zinc-100">{control.name}</div>
          <div className="text-[11px] text-zinc-400 mt-0.5">{control.description}</div>
          {control.remediationRecommendation && (
            <div className="text-[11px] text-amber-400/90 mt-1">Notice: {control.remediationRecommendation}</div>
          )}
        </td>
        <td className="py-2.5 px-3">
          <SecurityStatusBadge state={control.evidenceState} size="sm" />
        </td>
        <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-200">{control.evidenceCount} artifacts</td>
        <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-500">
          {control.lastEvidenceTimestamp ? timeAgo(control.lastEvidenceTimestamp) : 'None'}
        </td>
        <td className="py-2.5 px-3 text-right font-mono text-[10px] text-zinc-400">{control.evidenceIds.join(', ')}</td>
      </tr>
    ))}
  </DataTable>
);
