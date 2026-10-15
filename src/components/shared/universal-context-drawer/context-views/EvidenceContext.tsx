import { Download } from 'lucide-react';
import type React from 'react';
import type { ContextViewActions, EvidenceContextData } from '../universal-context-drawer.data';
import { DEFAULT_EVIDENCE_HASH } from '../universal-context-drawer.data';

interface EvidenceContextProps extends Pick<ContextViewActions, 'onNavigate'> {
  data: EvidenceContextData;
}

export const EvidenceContext: React.FC<EvidenceContextProps> = ({ data, onNavigate }) => (
  <div className="space-y-4">
    <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2 font-mono text-[11px]">
      <div className="space-y-0.5">
        <span className="text-[10px] text-[var(--zf-text-muted)] uppercase block">SHA-256 Ledger Hash</span>
        <span className="text-emerald-400 break-all">{data.hash || DEFAULT_EVIDENCE_HASH}</span>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-[var(--zf-border-subtle)]">
        <span className="text-[10px] text-[var(--zf-text-muted)] uppercase">Witness Byzantine Quorum</span>
        <span className="text-emerald-400 font-semibold">3/3 Signed</span>
      </div>
    </div>

    <button
      type="button"
      onClick={() => onNavigate('/evidence/pcap')}
      className="w-full py-2 px-3 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
    >
      <Download className="w-3.5 h-3.5 text-[var(--zf-brand-accent)]" />
      <span>Download Sealed PCAP Evidence</span>
    </button>
  </div>
);
