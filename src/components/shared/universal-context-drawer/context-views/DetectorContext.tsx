import type React from 'react';
import { ContextFieldRow } from '../ContextFieldRow';
import { ContextLinkButton } from '../ContextLinkButton';
import { SectionLabel } from '../SectionLabel';
import type { ContextViewActions, DetectorContextData } from '../universal-context-drawer.data';
import { DEFAULT_REQUIRED_TELEMETRY } from '../universal-context-drawer.data';

interface DetectorContextProps extends Pick<ContextViewActions, 'onOpenContext'> {
  data: DetectorContextData;
}

export const DetectorContext: React.FC<DetectorContextProps> = ({ data, onOpenContext }) => {
  const { mitre } = data;

  return (
    <div className="space-y-4">
      <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2">
        <ContextFieldRow label="Canary Assurance">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
            VERIFIED & SIGNED
          </span>
        </ContextFieldRow>
        <ContextFieldRow label="Telemetry Required">
          <span className="font-mono text-xs text-[var(--zf-text-primary)]">
            {data.requiredTelemetry || DEFAULT_REQUIRED_TELEMETRY}
          </span>
        </ContextFieldRow>
      </div>

      {mitre && (
        <div className="space-y-1.5">
          <SectionLabel>ATT&CK Technique Mapping</SectionLabel>
          <ContextLinkButton
            className="font-mono text-xs"
            onClick={() =>
              onOpenContext({
                type: 'MITRE',
                id: mitre,
                title: `${mitre}: MITRE ATT&CK Technique`,
                subtitle: 'Technique detail & detection heuristics',
              })
            }
          >
            <span>{mitre}</span>
          </ContextLinkButton>
        </div>
      )}
    </div>
  );
};
