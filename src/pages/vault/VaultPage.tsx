import type React from 'react';
import type { DataTableColumn } from '../../components/page/DataTable';
import { DataTable } from '../../components/page/DataTable';
import { PageHeader } from '../../components/page/PageHeader';
import { SecurityStatusBadge } from '../../components/shared/SecurityStatusBadge';

interface VaultKey {
  id: string;
  name: string;
  algorithm: string;
  status: string;
  created: string;
  rotationIntervalDays: number;
  daysUntilRotation: number;
}

const VAULT_KEYS: readonly VaultKey[] = [
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

const VAULT_KEY_COLUMNS: readonly DataTableColumn[] = [
  { label: 'Status', className: 'w-28' },
  { label: 'Key Identifier & Description' },
  { label: 'Cryptographic Algorithm' },
  { label: 'Created' },
  { label: 'Rotation Schedule' },
  { label: 'Action', className: 'text-right' },
];

export const VaultPage: React.FC = () => (
  <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
    <PageHeader
      title="Vault & Master Keystore"
      description="Isolated cryptographic material for evidence sealing, sensor mTLS, and response permit notary."
      actions={<SecurityStatusBadge state="SEALED" size="sm" />}
    />

    <DataTable columns={VAULT_KEY_COLUMNS}>
      {VAULT_KEYS.map((key) => (
        <tr key={key.id} className="hover:bg-[#15181e] transition-colors">
          <td className="py-2.5 px-3">
            <SecurityStatusBadge state="SEALED" size="sm" />
          </td>
          <td className="py-2.5 px-3">
            <div className="font-medium text-zinc-100">{key.name}</div>
            <div className="font-mono text-[10px] text-zinc-500">{key.id}</div>
          </td>
          <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-300">{key.algorithm}</td>
          <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">{key.created}</td>
          <td className="py-2.5 px-3 text-[11px] text-zinc-400">
            Every {key.rotationIntervalDays} days ({key.daysUntilRotation} days remaining)
          </td>
          <td className="py-2.5 px-3 text-right">
            <button
              type="button"
              className="px-2.5 py-1 rounded bg-[#181b20] border border-[#2a2f38] hover:bg-[#20242a] text-zinc-300 text-xs font-medium cursor-pointer transition-colors"
            >
              Rotate
            </button>
          </td>
        </tr>
      ))}
    </DataTable>
  </div>
);
