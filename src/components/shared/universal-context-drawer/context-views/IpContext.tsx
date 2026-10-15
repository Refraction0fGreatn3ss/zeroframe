import { Lock, Search, Server } from 'lucide-react';
import type React from 'react';
import { ContextLinkButton } from '../ContextLinkButton';
import { ContextStatTile } from '../ContextStatTile';
import { SectionLabel } from '../SectionLabel';
import type { ContextViewActions, IpContextData } from '../universal-context-drawer.data';
import { DEFAULT_BLAST_RADIUS, DEFAULT_HOSTNAME } from '../universal-context-drawer.data';

interface IpContextProps extends ContextViewActions {
  id: string;
  data: IpContextData;
}

export const IpContext: React.FC<IpContextProps> = ({ id, data, onNavigate, onOpenContext }) => {
  const hostname = data.hostname || DEFAULT_HOSTNAME;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        <ContextStatTile
          label="Resolved Hostname"
          valueClassName="font-semibold text-xs text-[var(--zf-text-primary)] mt-0.5 block font-mono"
        >
          {hostname}
        </ContextStatTile>
        <ContextStatTile
          label="Blast Radius"
          valueClassName="font-semibold text-xs text-rose-400 mt-0.5 block font-mono"
        >
          {data.blastRadius || DEFAULT_BLAST_RADIUS} / 100
        </ContextStatTile>
        <ContextStatTile
          label="VLAN Obs. / Decl."
          valueClassName="font-semibold text-xs text-[var(--zf-text-secondary)] mt-0.5 block font-mono"
        >
          VLAN 20 (Consistent)
        </ContextStatTile>
        <ContextStatTile
          label="Observation TAP"
          valueClassName="font-semibold text-xs text-[var(--zf-text-secondary)] mt-0.5 block font-mono"
        >
          SENSOR-HQ-CORE-01
        </ContextStatTile>
      </div>

      <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2">
        <SectionLabel>One-Click Investigation Pivots</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onNavigate('/investigate/hunt')}
            className="p-2 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-left flex items-center justify-between text-xs cursor-pointer"
          >
            <span>Hunt Related Flows</span>
            <Search className="w-3.5 h-3.5 text-[var(--zf-brand-accent)]" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/respond/permits')}
            className="p-2 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-left flex items-center justify-between text-xs cursor-pointer text-amber-400"
          >
            <span>Propose Quarantine</span>
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <SectionLabel>Associated Entity</SectionLabel>
        <ContextLinkButton
          onClick={() =>
            onOpenContext({
              type: 'ASSET',
              id: hostname,
              title: hostname,
              subtitle: 'Workstation · Windows 11 Enterprise',
              data: { ip: id, os: 'Windows 11 Enterprise (23H2)' },
            })
          }
        >
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[var(--zf-brand-accent)]" />
            <div>
              <span className="font-semibold text-xs text-[var(--zf-text-primary)] font-mono">{hostname}</span>
              <span className="text-[10px] text-[var(--zf-text-muted)] block">View Full Host Profile</span>
            </div>
          </div>
        </ContextLinkButton>
      </div>
    </div>
  );
};
