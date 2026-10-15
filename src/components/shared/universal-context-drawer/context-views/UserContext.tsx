import { Server } from 'lucide-react';
import type React from 'react';
import { ContextFieldRow } from '../ContextFieldRow';
import { ContextLinkButton } from '../ContextLinkButton';
import { SectionLabel } from '../SectionLabel';
import type { ContextViewActions, UserContextData } from '../universal-context-drawer.data';
import {
  DEFAULT_ASSOCIATED_ASSETS,
  DEFAULT_AUTH_EVENTS,
  DEFAULT_USER_CLEARANCE,
  DEFAULT_USER_IDENTITY,
} from '../universal-context-drawer.data';

interface UserContextProps extends Pick<ContextViewActions, 'onOpenContext'> {
  id: string;
  data?: UserContextData | null;
}

export const UserContext: React.FC<UserContextProps> = ({ id, data, onOpenContext }) => (
  <div className="space-y-4">
    <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2">
      <ContextFieldRow label="User Identity">
        <span className="font-mono text-xs font-semibold text-slate-100">
          {data?.username || id || DEFAULT_USER_IDENTITY}
        </span>
      </ContextFieldRow>
      <ContextFieldRow label="Clearance & Role">
        <span className="font-mono text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
          {data?.clearance || data?.role || DEFAULT_USER_CLEARANCE}
        </span>
      </ContextFieldRow>
      <ContextFieldRow label="MFA Status">
        <span className="text-emerald-400 text-xs font-semibold">FIDO2 / WebAuthn Hardware Key</span>
      </ContextFieldRow>
    </div>

    <div className="space-y-2">
      <SectionLabel>Recent Authentication Events</SectionLabel>
      <div className="space-y-1.5 font-mono text-[11px]">
        {(data?.authEvents || DEFAULT_AUTH_EVENTS).map((evt, idx) => (
          <div
            key={idx}
            className="p-2 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] flex items-center justify-between text-xs"
          >
            <div>
              <div className="text-slate-200 font-sans text-xs">{evt.event}</div>
              <div className="text-[10px] text-slate-400">
                {evt.ip} · {evt.time}
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {evt.status}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-1.5">
      <SectionLabel>Associated Primary Assets</SectionLabel>
      <div className="space-y-1.5">
        {(data?.associatedAssets || DEFAULT_ASSOCIATED_ASSETS).map((ast) => (
          <ContextLinkButton
            key={ast.hostname}
            className="font-mono text-xs"
            onClick={() =>
              onOpenContext({
                type: 'ASSET',
                id: ast.hostname,
                title: ast.hostname,
                subtitle: `Assigned to ${id}`,
                data: { ip: ast.ip, mac: ast.mac, os: 'Windows 11 Enterprise' },
              })
            }
          >
            <div className="flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-200 font-sans">{ast.hostname}</span>
              <span className="text-slate-400 text-[11px]">({ast.ip})</span>
            </div>
          </ContextLinkButton>
        ))}
      </div>
    </div>
  </div>
);
