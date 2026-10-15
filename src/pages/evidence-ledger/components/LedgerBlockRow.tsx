import { CheckCircle2 } from 'lucide-react';
import type React from 'react';
import type { EvidenceLedgerBlock } from '../../../services/evidence-service';
import { formatBlockHash, formatMebibytes, formatPreviousBlockHash, getFreshness } from '../evidence-ledger.utils';

interface LedgerBlockRowProps {
  block: EvidenceLedgerBlock;
}

export const LedgerBlockRow: React.FC<LedgerBlockRowProps> = ({ block }) => {
  const freshness = getFreshness(block.sealedAt);

  return (
    <tr className="hover:bg-[var(--zf-surface-card-hover)] transition-colors">
      <td className="py-3 px-3 font-mono font-medium text-[var(--zf-text-primary)]">{block.id}</td>
      <td
        className="py-3 px-3 font-mono text-[11px] text-[var(--zf-brand-accent)] truncate max-w-xs"
        title={block.hashSha256}
      >
        {formatBlockHash(block.hashSha256)}
      </td>
      <td
        className="py-3 px-3 font-mono text-[11px] text-[var(--zf-text-muted)] truncate max-w-xs"
        title={block.previousBlockSha256}
      >
        {formatPreviousBlockHash(block.previousBlockSha256)}
      </td>
      <td className="py-3 px-3">
        <div className="font-semibold text-xs text-[var(--zf-text-primary)] font-mono">{block.resourceType}</div>
        <div className="text-[10px] text-[var(--zf-text-muted)] font-mono">
          {block.incidentId} · {formatMebibytes(block.byteSize)}
        </div>
      </td>
      <td className="py-3 px-3 font-mono text-[11px] text-[var(--zf-text-secondary)] whitespace-nowrap">
        {block.sealedAt}
      </td>
      <td className="py-3 px-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          <span>VALIDATED (Witness Signed)</span>
        </span>
      </td>
      <td className="py-3 px-3 text-right">
        <span
          className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${freshness.className}`}
        >
          {freshness.label}
        </span>
      </td>
    </tr>
  );
};
