import type React from 'react';
import type { DataTableColumn } from '../../components/page/DataTable';
import { DataTable } from '../../components/page/DataTable';
import { HeaderActions } from '../../components/page/HeaderActions';
import { PageHeader } from '../../components/page/PageHeader';
import { ExportButton } from '../../components/shared/ExportButton';
import { SecurityStatusBadge } from '../../components/shared/SecurityStatusBadge';
import { timeAgo } from '../../lib/utils';
import { useAdminStore } from '../../stores/admin-store';

const INTEGRATION_COLUMNS: readonly DataTableColumn[] = [
  { label: 'Status', className: 'w-28' },
  { label: 'Integration Name & Vendor' },
  { label: 'Category' },
  { label: 'Corroborated Assets' },
  { label: 'API Latency' },
  { label: 'Last Sync' },
  { label: 'Action', className: 'text-right' },
];

const formatCorroboratedAssets = (count: number): string => (count > 0 ? `${count.toLocaleString()} endpoints` : '—');

export const IntegrationsPage: React.FC = () => {
  const { integrations, testIntegrationSync } = useAdminStore();

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      <PageHeader
        title="Enterprise Integrations & Corroboration"
        description="Endpoint XDR, Identity, and SIEM connectors with separate configured and verified health states."
        actions={
          <HeaderActions>
            <ExportButton resourceName="Integrations" recordCount={integrations.length} data={integrations} />
          </HeaderActions>
        }
      />

      <DataTable columns={INTEGRATION_COLUMNS}>
        {integrations.map((integration) => (
          <tr key={integration.id} className="hover:bg-[#15181e] transition-colors">
            <td className="py-2.5 px-3">
              <SecurityStatusBadge state={integration.status} size="sm" />
            </td>
            <td className="py-2.5 px-3">
              <div className="font-medium text-zinc-100">{integration.name}</div>
              <div className="text-[11px] text-zinc-500">{integration.vendor}</div>
            </td>
            <td className="py-2.5 px-3 text-zinc-400">{integration.category}</td>
            <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-200">
              {formatCorroboratedAssets(integration.entitiesCorroborated)}
            </td>
            <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">{integration.apiCallLatencyMs} ms</td>
            <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-500">
              {timeAgo(integration.lastSyncTimestamp)}
            </td>
            <td className="py-2.5 px-3 text-right">
              <button
                type="button"
                onClick={() => testIntegrationSync(integration.id)}
                className="px-2.5 py-1 rounded bg-[#181b20] border border-[#2a2f38] hover:bg-[#20242a] text-zinc-300 text-xs font-medium cursor-pointer transition-colors"
              >
                Test Sync
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};
