import type React from 'react';
import type { SecurityActivityItem } from '../../../types/activity-log';
import { CATEGORY_CONFIG } from './activity-log.data';
import { StatusBadge } from './StatusBadge';

interface ActivityLogDetailMetadataProps {
  log: SecurityActivityItem;
  isIpCopied: boolean;
  onCopyIp: () => void;
}

export const ActivityLogDetailMetadata: React.FC<ActivityLogDetailMetadataProps> = ({ log, isIpCopied, onCopyIp }) => (
  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
    <div className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
      <span className="text-[10px] text-[var(--zf-text-muted)] block">Event Category</span>
      <span className="font-semibold text-[var(--zf-text-primary)] mt-0.5 block">
        {CATEGORY_CONFIG[log.category].label}
      </span>
    </div>

    <div className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
      <span className="text-[10px] text-[var(--zf-text-muted)] block">Verification State</span>
      <div className="mt-0.5">
        <StatusBadge status={log.status} />
      </div>
    </div>

    <div className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
      <span className="text-[10px] text-[var(--zf-text-muted)] block">Actor Identity</span>
      <span className="font-semibold text-[var(--zf-text-primary)] mt-0.5 block truncate">{log.actor}</span>
      {log.actorRole && <span className="text-[10px] text-[var(--zf-text-muted)] block mt-0.5">{log.actorRole}</span>}
    </div>

    <div className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
      <span className="text-[10px] text-[var(--zf-text-muted)] block">Source IP Address</span>
      <div className="flex items-center justify-between mt-0.5">
        <span className="font-bold text-[var(--zf-text-primary)]">{log.sourceIp}</span>
        <button
          type="button"
          onClick={onCopyIp}
          className="text-[10px] text-[var(--zf-brand-accent)] hover:underline cursor-pointer"
        >
          {isIpCopied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {log.location && <span className="text-[10px] text-[var(--zf-text-muted)] block mt-0.5">{log.location}</span>}
    </div>

    {log.targetResource && (
      <div className="col-span-2 p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
        <span className="text-[10px] text-[var(--zf-text-muted)] block">Target Asset / Protocol Endpoint</span>
        <span className="font-semibold text-[var(--zf-text-primary)] mt-0.5 block">{log.targetResource}</span>
      </div>
    )}

    {log.mitreTactic && (
      <div className="col-span-2 p-2.5 rounded bg-rose-500/10 border border-rose-500/30">
        <span className="text-[10px] text-rose-400 block font-bold">MITRE ATT&CK Mapping</span>
        <span className="font-semibold text-rose-300 mt-0.5 block">{log.mitreTactic}</span>
      </div>
    )}
  </div>
);
