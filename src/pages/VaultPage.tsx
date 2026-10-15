/**
 * Vault & Cryptographic Keystore Page
 * Clean table layout for master keys, SPIFFE identities, and cert rotation.
 */

import React from 'react';
import { SecurityStatusBadge } from '../components/shared/SecurityStatusBadge';
import { Key, Lock, RefreshCw } from 'lucide-react';

const KEYS = [
  {
    id: 'KEY-MASTER-AES256-GCM',
    name: 'Evidence Ledger Master Encryption Key',
    algorithm: 'AES-256-GCM',
    status: 'ACTIVE_SEALED',
    created: '2026-01-01',
    rotationIntervalDays: 90,
    daysUntilRotation: 42,
  },
  {
    id: 'KEY-ED25519-WITNESS-ROOT',
    name: 'Witness Permit Notary Asymmetric Signing Key',
    algorithm: 'Ed25519 (256-bit)',
    status: 'ACTIVE_SEALED',
    created: '2026-01-01',
    rotationIntervalDays: 365,
    daysUntilRotation: 182,
  },
  {
    id: 'KEY-SENSOR-MTLS-CA',
    name: 'Sensor mTLS Certificate Authority Intermediate',
    algorithm: 'ECDSA P-384',
    status: 'ACTIVE_SEALED',
    created: '2026-01-01',
    rotationIntervalDays: 730,
    daysUntilRotation: 480,
  },
];

export const VaultPage: React.FC = () => {
  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Vault & Master Keystore</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Isolated cryptographic material for evidence sealing, sensor mTLS, and response permit notary.
          </p>
        </div>

        <SecurityStatusBadge state="SEALED" size="sm" />
      </div>

      {/* Keys Table */}
      <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#14171c] border-b border-[#20242a] text-zinc-400 text-[11px] font-medium">
              <tr>
                <th className="py-2.5 px-3 w-28">Status</th>
                <th className="py-2.5 px-3">Key Identifier & Description</th>
                <th className="py-2.5 px-3">Cryptographic Algorithm</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3">Rotation Schedule</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181b20] text-zinc-300">
              {KEYS.map((k) => (
                <tr key={k.id} className="hover:bg-[#15181e] transition-colors">
                  <td className="py-2.5 px-3">
                    <SecurityStatusBadge state="SEALED" size="sm" />
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-zinc-100">{k.name}</div>
                    <div className="font-mono text-[10px] text-zinc-500">{k.id}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-300">
                    {k.algorithm}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">
                    {k.created}
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-zinc-400">
                    Every {k.rotationIntervalDays} days ({k.daysUntilRotation} days remaining)
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button className="px-2.5 py-1 rounded bg-[#181b20] border border-[#2a2f38] hover:bg-[#20242a] text-zinc-300 text-xs font-medium cursor-pointer transition-colors">
                      Rotate
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
