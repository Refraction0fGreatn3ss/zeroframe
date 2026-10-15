import { ProvenanceBadge } from '../../components/ui/ProvenanceBadge';
import { StatusChip } from '../../components/ui/StatusChip';
import type { VirtualColumn } from '../../components/ui/VirtualTable';
import type { ProtectedAsset } from '../../types/protected-assets';

const formatActions = (actions: string[]): string => (actions.length > 0 ? actions.join(', ') : '—');

export const PROTECTED_ASSET_COLUMNS: VirtualColumn<ProtectedAsset>[] = [
  {
    id: 'asset',
    header: 'Asset',
    cell: (row) => <span className="font-mono text-[var(--zf-text-primary)]">{row.hostname ?? row.assetId}</span>,
  },
  { id: 'criticality', header: 'Criticality', cell: (row) => <StatusChip label={row.criticality} tone="neutral" /> },
  { id: 'site', header: 'Site', cell: (row) => row.site ?? '—' },
  { id: 'owner', header: 'Owner', cell: (row) => row.owner ?? '—' },
  {
    id: 'protected',
    header: 'Protected',
    cell: (row) => (
      <StatusChip label={row.isProtected ? 'Protected' : 'Not protected'} tone={row.isProtected ? 'info' : 'neutral'} />
    ),
  },
  { id: 'reason', header: 'Reason', cell: (row) => row.reason ?? '—' },
  { id: 'policy', header: 'Policy', cell: (row) => <span className="font-mono">{row.policyId ?? '—'}</span> },
  { id: 'allowed', header: 'Allowed actions', cell: (row) => formatActions(row.allowedActions) },
  { id: 'denied', header: 'Denied actions', cell: (row) => formatActions(row.deniedActions) },
  { id: 'dual', header: 'Dual control', cell: (row) => (row.dualControlRequired ? 'Required' : 'Not required') },
  { id: 'witness', header: 'Witness', cell: (row) => (row.witnessRequired ? 'Required' : 'Not required') },
  { id: 'changed', header: 'Last changed', cell: (row) => row.lastChangedAt ?? '—' },
  { id: 'changedBy', header: 'Changed by', cell: (row) => row.lastChangedBy ?? '—' },
  {
    id: 'provenance',
    header: 'Provenance',
    cell: (row) => <ProvenanceBadge provenance={row.provenance} subject={row.assetId} />,
  },
];
