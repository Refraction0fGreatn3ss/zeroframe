import { Globe } from 'lucide-react';
import type React from 'react';
import { ContextFieldRow } from '../ContextFieldRow';
import { ContextLinkButton } from '../ContextLinkButton';
import { SectionLabel } from '../SectionLabel';
import type { AssetContextData, ContextViewActions } from '../universal-context-drawer.data';
import { DEFAULT_CRITICALITY, DEFAULT_OS } from '../universal-context-drawer.data';

interface AssetContextProps extends Pick<ContextViewActions, 'onOpenContext'> {
  title: string;
  data: AssetContextData;
}

export const AssetContext: React.FC<AssetContextProps> = ({ title, data, onOpenContext }) => {
  const { ip } = data;

  return (
    <div className="space-y-4">
      <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2">
        <ContextFieldRow label="Criticality Tier">
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono font-medium text-amber-400">
            {data.criticality || DEFAULT_CRITICALITY}
          </span>
        </ContextFieldRow>
        <ContextFieldRow label="Crown Jewel Asset">
          <span className="text-xs font-semibold text-[var(--zf-text-primary)]">
            {data.isProtected ? 'YES (Strict Blast Radius)' : 'Standard Endpoint'}
          </span>
        </ContextFieldRow>
        <ContextFieldRow label="Operating System">
          <span className="text-xs text-[var(--zf-text-secondary)] font-mono">{data.os || DEFAULT_OS}</span>
        </ContextFieldRow>
      </div>

      {ip && (
        <div className="space-y-1.5">
          <SectionLabel>Bound Primary IP</SectionLabel>
          <ContextLinkButton
            className="font-mono text-xs"
            onClick={() =>
              onOpenContext({
                type: 'IP',
                id: ip,
                title: ip,
                subtitle: `Bound to ${title}`,
                data: { hostname: title },
              })
            }
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>{ip}</span>
            </div>
          </ContextLinkButton>
        </div>
      )}
    </div>
  );
};
