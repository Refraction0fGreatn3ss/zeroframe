/**
 * Enterprise Integrations & Corroboration Page
 * High-density table with verified states: Healthy, Degraded, Configured, Not Configured.
 */

import React from 'react';
import { useAdminStore } from '../stores/admin-store';
import { SecurityStatusBadge } from '../components/shared/SecurityStatusBadge';
import { ExportButton } from '../components/shared/ExportButton';
import { timeAgo } from '../lib/utils';
import { RefreshCw } from 'lucide-react';

export const IntegrationsPage: React.FC = () => {
  const { integrations, testIntegrationSync } = useAdminStore();

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Enterprise Integrations & Corroboration</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Endpoint XDR, Identity, and SIEM connectors with separate configured and verified health states.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton resourceName="Integrations" recordCount={integrations.length} data={integrations} />
        </div>
      </div>

      {/* Integrations Table */}
      <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#14171c] border-b border-[#20242a] text-zinc-400 text-[11px] font-medium">
              <tr>
                <th className="py-2.5 px-3 w-28">Status</th>
                <th className="py-2.5 px-3">Integration Name & Vendor</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Corroborated Assets</th>
                <th className="py-2.5 px-3">API Latency</th>
                <th className="py-2.5 px-3">Last Sync</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181b20] text-zinc-300">
              {integrations.map((intg) => (
                <tr key={intg.id} className="hover:bg-[#15181e] transition-colors">
                  <td className="py-2.5 px-3">
                    <SecurityStatusBadge state={intg.status} size="sm" />
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-zinc-100">{intg.name}</div>
                    <div className="text-[11px] text-zinc-500">{intg.vendor}</div>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400">{intg.category}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-200">
                    {intg.entitiesCorroborated > 0 ? `${intg.entitiesCorroborated.toLocaleString()} endpoints` : '—'}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">
                    {intg.apiCallLatencyMs} ms
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-500">
                    {timeAgo(intg.lastSyncTimestamp)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => testIntegrationSync(intg.id)}
                      className="px-2.5 py-1 rounded bg-[#181b20] border border-[#2a2f38] hover:bg-[#20242a] text-zinc-300 text-xs font-medium cursor-pointer transition-colors"
                    >
                      Test Sync
                    </button>
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
