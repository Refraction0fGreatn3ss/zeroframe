/**
 * Isolation & Quarantine Page
 * Tracks active network isolations, iptables rules, and BGP flowspec routes.
 */

import React from 'react';
import { SecurityStatusBadge } from '../components/shared/SecurityStatusBadge';
import { ExportButton } from '../components/shared/ExportButton';
import { useRollbackStore } from '../stores/rollback-store';

const QUARANTINE_RECORDS = [
  {
    id: 'QRN-001',
    targetIp: '10.140.2.88',
    hostname: 'WKST-CORP-088',
    mac: '00:50:56:b8:3a:11',
    mechanism: 'IPTABLES_SENSOR_DROP_CHAIN',
    enforcedAt: '2026-10-12T10:45:00Z',
    leaseExpiresAt: '2026-10-12T11:15:00Z',
    permitRef: 'PMT-2026-0881',
    status: 'ACTIVE_ENFORCED',
    verifiedOnWire: true,
  },
];

export const QuarantinePage: React.FC = () => {
  const { quarantineHosts, liftQuarantine, isRollingBack } = useRollbackStore();

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Active Network Quarantine & Isolation</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Verified containment drop chains with automatic reversal leases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton
            resourceName="Quarantine Rules"
            recordCount={quarantineHosts.length}
            data={quarantineHosts}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#14171c] border-b border-[#20242a] text-zinc-400 text-[11px] font-medium">
              <tr>
                <th className="py-2.5 px-3 w-28">Status</th>
                <th className="py-2.5 px-3">Quarantine ID</th>
                <th className="py-2.5 px-3">Target Asset</th>
                <th className="py-2.5 px-3">Mechanism</th>
                <th className="py-2.5 px-3">Enforced At</th>
                <th className="py-2.5 px-3">Lease Expires</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181b20] text-zinc-300">
              {quarantineHosts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500 font-mono text-xs">
                    No active network quarantine drop chains for this tenant scope.
                  </td>
                </tr>
              ) : (
                quarantineHosts.map((q) => (
                  <tr key={q.id} className="hover:bg-[#15181e] transition-colors">
                    <td className="py-2.5 px-3">
                      <SecurityStatusBadge state={q.status || 'ACTIVE_ENFORCED'} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-200">{q.id}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-zinc-100">{q.hostname}</div>
                      <div className="font-mono text-[11px] text-zinc-400">{q.targetIp}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-300">{q.mechanism}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">
                      {q.enforcedAt ? new Date(q.enforcedAt).toLocaleTimeString() : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-amber-300">
                      {q.leaseExpiresAt ? new Date(q.leaseExpiresAt).toLocaleTimeString() : '30m lease'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => liftQuarantine(q.id)}
                        disabled={isRollingBack}
                        className="px-2.5 py-1 rounded bg-[#181b20] border border-[#2a2f38] hover:bg-[#20242a] text-zinc-300 text-xs font-medium cursor-pointer transition-colors"
                      >
                        Lift Isolation
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
