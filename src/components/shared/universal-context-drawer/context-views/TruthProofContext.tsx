import { ExternalLink, ShieldCheck } from 'lucide-react';
import type React from 'react';
import { SectionLabel } from '../SectionLabel';
import type { ContextViewActions, TruthProofContextData } from '../universal-context-drawer.data';

interface TruthProofContextProps extends Pick<ContextViewActions, 'onNavigate'> {
  data: TruthProofContextData;
}

export const TruthProofContext: React.FC<TruthProofContextProps> = ({ data, onNavigate }) => {
  const { link } = data;

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2">
        <SectionLabel>Authoritative Root Cause (Why)</SectionLabel>
        <p className="text-xs text-[var(--zf-text-secondary)] leading-relaxed">{data.why}</p>
      </div>

      {data.recommendation && (
        <div className="p-3.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider block font-sans">
            Recommended Operational Action
          </span>
          <p className="text-xs leading-relaxed">{data.recommendation}</p>
        </div>
      )}

      <div className="space-y-2">
        <SectionLabel>Cryptographic Verification Proof</SectionLabel>
        <div className="space-y-2">
          {data.proof?.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] flex items-start gap-2.5 text-xs text-[var(--zf-text-secondary)]"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-mono text-[11px]">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {link && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onNavigate(link)}
            className="w-full py-2 px-3 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Open Detailed Inspection Diagnostics</span>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--zf-brand-accent)]" />
          </button>
        </div>
      )}
    </div>
  );
};
