import type React from 'react';
import { SecurityStatusBadge } from '../../../components/shared/SecurityStatusBadge';
import { timeAgo } from '../../../lib/utils';
import type { ContextItem } from '../../../stores/context-drawer-store';
import type { SecurityAlert } from '../../../types';
import {
  destinationIpContext,
  detectorContext,
  evidenceContext,
  evidenceFileName,
  sourceIpContext,
} from '../alerts.utils';

interface AlertRowProps {
  alert: SecurityAlert;
  onSelect: (alert: SecurityAlert) => void;
  onOpenContext: (item: ContextItem) => void;
}

export const AlertRow: React.FC<AlertRowProps> = ({ alert, onSelect, onOpenContext }) => {
  const pivot = (item: ContextItem) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenContext(item);
  };

  return (
    <tr
      onClick={() => onSelect(alert)}
      className="hover:bg-[var(--zf-surface-card-hover)] cursor-pointer transition-colors"
    >
      <td className="py-2.5 px-3">
        <SecurityStatusBadge state={alert.severity} size="sm" />
      </td>
      <td className="py-2.5 px-3">
        <div className="font-semibold text-[var(--zf-text-primary)]">{alert.name}</div>
        <div className="text-[10px] text-[var(--zf-text-muted)] font-mono">{alert.id}</div>
      </td>
      <td className="py-2.5 px-3">
        <button
          type="button"
          onClick={pivot(detectorContext(alert))}
          className="text-[var(--zf-brand-accent)] hover:underline font-mono text-[11px] font-medium text-left cursor-pointer"
        >
          {alert.detectorName}
        </button>
        <div className="font-mono text-[10px] text-[var(--zf-text-muted)]">{alert.detectorVersion}</div>
      </td>
      <td className="py-2.5 px-3 font-mono text-[11px]">
        <button
          type="button"
          onClick={pivot(sourceIpContext(alert))}
          className="text-sky-400 hover:underline cursor-pointer"
        >
          {alert.sourceIp}:{alert.sourcePort}
        </button>
        <span className="text-[var(--zf-text-muted)] mx-1.5">&rarr;</span>
        <button
          type="button"
          onClick={pivot(destinationIpContext(alert))}
          className="text-zinc-200 hover:underline cursor-pointer"
        >
          {alert.destinationIp}:{alert.destinationPort}
        </button>
        <span className="text-[var(--zf-text-muted)] ml-1.5 font-sans">({alert.protocol})</span>
      </td>
      <td className="py-2.5 px-3 font-mono text-[11px] text-[var(--zf-text-secondary)]">{alert.fidelity}</td>
      <td className="py-2.5 px-3 font-mono text-[11px] text-emerald-400 font-semibold">{alert.confidence}%</td>
      <td className="py-2.5 px-3 text-[var(--zf-text-muted)] font-mono text-[11px]">{timeAgo(alert.timestamp)}</td>
      <td className="py-2.5 px-3 text-right font-mono text-[11px]">
        <button
          type="button"
          onClick={pivot(evidenceContext(alert))}
          className="text-emerald-400 hover:underline cursor-pointer"
        >
          {evidenceFileName(alert.evidenceRef)}
        </button>
      </td>
    </tr>
  );
};
