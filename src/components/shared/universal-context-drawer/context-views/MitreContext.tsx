import { Search, Terminal } from 'lucide-react';
import type React from 'react';
import { ContextFieldRow } from '../ContextFieldRow';
import { ContextLinkButton } from '../ContextLinkButton';
import { SectionLabel } from '../SectionLabel';
import type { ContextViewActions, MitreContextData } from '../universal-context-drawer.data';
import {
  DEFAULT_LINKED_DETECTORS,
  DEFAULT_MITRE_HEURISTICS,
  DEFAULT_REQUIRED_TELEMETRY,
  DEFAULT_TACTIC_STAGE,
  DEFAULT_TECHNIQUE_ID,
  MITRE_SIGNATURE_TAGS,
} from '../universal-context-drawer.data';

interface MitreContextProps extends ContextViewActions {
  id: string;
  data?: MitreContextData | null;
}

export const MitreContext: React.FC<MitreContextProps> = ({ id, data, onNavigate, onOpenContext }) => (
  <div className="space-y-4">
    <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2">
      <ContextFieldRow label="Technique ID">
        <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
          {data?.techniqueId || id || DEFAULT_TECHNIQUE_ID}
        </span>
      </ContextFieldRow>
      <ContextFieldRow label="Tactic Stage">
        <span className="font-mono text-xs text-[var(--zf-text-primary)]">
          {data?.tacticStage || data?.tactic || DEFAULT_TACTIC_STAGE}
        </span>
      </ContextFieldRow>
      <ContextFieldRow label="Detection Confidence">
        <span className="text-emerald-400 text-xs font-semibold">99.8% (Deterministic Wire Match)</span>
      </ContextFieldRow>
    </div>

    <div className="p-3 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] space-y-2">
      <SectionLabel>Detection Heuristics & Wire Signatures</SectionLabel>
      <p className="text-xs text-[var(--zf-text-secondary)] leading-relaxed">
        {data?.heuristics || DEFAULT_MITRE_HEURISTICS}
      </p>
      <div className="pt-1 flex flex-wrap gap-1.5 font-mono text-[10px]">
        {MITRE_SIGNATURE_TAGS.map((tag) => (
          <span key={tag} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {tag}
          </span>
        ))}
      </div>
    </div>

    <div className="space-y-1.5">
      <SectionLabel>Linked Active Detectors</SectionLabel>
      <div className="space-y-1.5">
        {(data?.linkedDetectors || DEFAULT_LINKED_DETECTORS).map((detId) => (
          <ContextLinkButton
            key={detId}
            className="font-mono text-xs"
            onClick={() =>
              onOpenContext({
                type: 'DETECTOR',
                id: detId,
                title: `Detector ${detId}`,
                subtitle: 'Deterministic wire canary engine',
                data: { mitre: id, requiredTelemetry: DEFAULT_REQUIRED_TELEMETRY },
              })
            }
            trailing={<span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>}
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-200">{detId}</span>
            </div>
          </ContextLinkButton>
        ))}
      </div>
    </div>

    <button
      type="button"
      onClick={() => onNavigate('/investigate/hunt')}
      className="w-full py-2 px-3 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
    >
      <Search className="w-3.5 h-3.5 text-[var(--zf-brand-accent)]" />
      <span>Pivot to Threat Hunt for {id}</span>
    </button>
  </div>
);
