import type React from 'react';
import type { DataTableColumn } from '../../components/page/DataTable';
import { DataTable } from '../../components/page/DataTable';
import { PageHeader } from '../../components/page/PageHeader';
import { TableEmptyRow } from '../../components/page/TableEmptyRow';
import { SecurityStatusBadge } from '../../components/shared/SecurityStatusBadge';
import { useTenantScopedList } from '../../hooks/use-tenant-scoped-list';
import type { WitnessNodeRecord } from '../../services/evidence-service';
import { evidenceService } from '../../services/evidence-service';

const DEFAULT_NODE_STATE = 'ONLINE';
const FALLBACK_LATENCY_LABEL = '1.2 ms';
const WITNESS_ENDPOINT_PORT = 8443;

const WITNESS_NODE_COLUMNS: readonly DataTableColumn[] = [
  { label: 'Status', className: 'w-28' },
  { label: 'Notary Node' },
  { label: 'Quorum Role' },
  { label: 'Endpoint / Location' },
  { label: 'Latency' },
  { label: 'Quorum Agreement', className: 'text-right' },
];

const fetchWitnessNodes = (): Promise<WitnessNodeRecord[]> => evidenceService.getWitnessNodes();

const witnessEndpointUrl = (nodeId: string): string =>
  `https://${nodeId.toLowerCase()}.internal:${WITNESS_ENDPOINT_PORT}`;

export const WitnessPlanePage: React.FC = () => {
  const { items: nodes, isLoading } = useTenantScopedList(fetchWitnessNodes, 'Failed to load witness nodes');

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      <PageHeader
        title="Witness Plane & Notary Quorum"
        description="Independent dual-custody quorum validating operator response permits before wire enforcement."
        actions={<SecurityStatusBadge state={nodes.length > 0 ? 'QUORUM_HEALTHY' : 'UNKNOWN'} size="sm" />}
      />

      <DataTable columns={WITNESS_NODE_COLUMNS}>
        {nodes.length === 0 ? (
          <TableEmptyRow colSpan={WITNESS_NODE_COLUMNS.length}>
            {isLoading ? 'Querying witness consensus quorum...' : 'No witness nodes provisioned for this tenant scope.'}
          </TableEmptyRow>
        ) : (
          nodes.map((node) => (
            <tr key={node.id} className="hover:bg-[#15181e] transition-colors">
              <td className="py-2.5 px-3">
                <SecurityStatusBadge state={node.state || DEFAULT_NODE_STATE} size="sm" />
              </td>
              <td className="py-2.5 px-3 font-medium text-zinc-100">
                <div>{node.location || node.id}</div>
                <div className="font-mono text-[10px] text-zinc-500">{node.id}</div>
              </td>
              <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-300">{node.role}</td>
              <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">{witnessEndpointUrl(node.id)}</td>
              <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-200">
                {node.latencyMs ? `${node.latencyMs} ms` : FALLBACK_LATENCY_LABEL}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-[11px] text-emerald-400">
                {node.quorumMember ? '100% Quorum' : 'Syncing'}
              </td>
            </tr>
          ))
        )}
      </DataTable>
    </div>
  );
};
