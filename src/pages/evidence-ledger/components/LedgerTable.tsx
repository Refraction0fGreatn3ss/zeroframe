import { Layers } from 'lucide-react';
import type React from 'react';
import type { EvidenceLedgerBlock } from '../../../services/evidence-service';
import { LedgerBlockRow } from './LedgerBlockRow';

const LEDGER_COLUMNS: readonly { label: string; className: string }[] = [
  { label: 'Block ID', className: 'py-2.5 px-3 w-32' },
  { label: 'SHA-256 Merkle Hash', className: 'py-2.5 px-3' },
  { label: 'Previous Block Hash', className: 'py-2.5 px-3' },
  { label: 'Type & Target', className: 'py-2.5 px-3' },
  { label: 'Sealed At', className: 'py-2.5 px-3' },
  { label: 'Integrity State', className: 'py-2.5 px-3' },
  { label: 'Freshness', className: 'py-2.5 px-3 text-right' },
];

interface LedgerTableProps {
  blocks: EvidenceLedgerBlock[];
  isLoading: boolean;
}

export const LedgerTable: React.FC<LedgerTableProps> = ({ blocks, isLoading }) => (
  <div className="bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] rounded overflow-hidden shadow-xs">
    <div className="p-3 bg-[var(--zf-surface-subtle)] border-b border-[var(--zf-border-subtle)] flex items-center justify-between text-xs font-mono">
      <span className="font-semibold text-[var(--zf-text-primary)] flex items-center gap-2">
        <Layers className="w-3.5 h-3.5 text-[var(--zf-brand-accent)]" />
        <span>SEALED EVIDENCE BLOCKS</span>
      </span>
      <span className="text-[11px] text-[var(--zf-text-muted)]">
        {blocks.length} Blocks Registered · Witness Quorum Active
      </span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-sans">
        <thead className="bg-[var(--zf-surface-subtle)] border-b border-[var(--zf-border-subtle)] text-[var(--zf-text-muted)] text-[11px] font-medium font-mono">
          <tr>
            {LEDGER_COLUMNS.map((column) => (
              <th key={column.label} className={column.className}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--zf-border-subtle)] text-[var(--zf-text-secondary)]">
          {blocks.length === 0 ? (
            <tr>
              <td
                colSpan={LEDGER_COLUMNS.length}
                className="py-8 text-center text-xs text-[var(--zf-text-muted)] font-mono"
              >
                {isLoading
                  ? 'Loading authoritative evidence blocks...'
                  : 'No evidence blocks sealed for this tenant scope.'}
              </td>
            </tr>
          ) : (
            blocks.map((block) => <LedgerBlockRow key={block.id} block={block} />)
          )}
        </tbody>
      </table>
    </div>
  </div>
);
