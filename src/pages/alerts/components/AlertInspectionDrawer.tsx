import { Crosshair, Globe, X } from 'lucide-react';
import type React from 'react';
import { SecurityStatusBadge } from '../../../components/shared/SecurityStatusBadge';
import type { ContextItem } from '../../../stores/context-drawer-store';
import type { SecurityAlert } from '../../../types';
import { detectorContext, sourceHostContext } from '../alerts.utils';

interface AlertInspectionDrawerProps {
  alert: SecurityAlert;
  onClose: () => void;
  onOpenContext: (item: ContextItem) => void;
}

export const AlertInspectionDrawer: React.FC<AlertInspectionDrawerProps> = ({ alert, onClose, onOpenContext }) => {
  const pivotAndClose = (item: ContextItem) => () => {
    onClose();
    onOpenContext(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans select-none animate-in fade-in duration-150">
      <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={onClose} />

      <aside className="relative w-full max-w-md bg-[var(--zf-surface-card)] border-l border-[var(--zf-border-medium)] p-6 shadow-2xl flex flex-col h-full z-10 space-y-4 animate-in slide-in-from-right duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--zf-border-subtle)]">
          <div className="flex items-center gap-2">
            <SecurityStatusBadge state={alert.severity} size="sm" />
            <span className="font-mono text-xs text-[var(--zf-text-muted)]">{alert.id}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--zf-surface-tertiary)] text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-[var(--zf-text-primary)]">{alert.name}</h3>
          <p className="text-xs text-[var(--zf-text-secondary)] mt-1">{alert.summary}</p>
        </div>

        <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-[var(--zf-text-muted)]">Source:</span>
            <span className="text-sky-400">
              {alert.sourceIp}:{alert.sourcePort}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--zf-text-muted)]">Destination:</span>
            <span className="text-zinc-200">
              {alert.destinationIp}:{alert.destinationPort}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--zf-text-muted)]">Protocol:</span>
            <span>{alert.protocol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--zf-text-muted)]">Confidence:</span>
            <span className="text-emerald-400 font-bold">{alert.confidence}%</span>
          </div>
        </div>

        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={pivotAndClose(sourceHostContext(alert))}
            className="w-full py-2 px-3 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-xs font-medium text-[var(--zf-text-primary)] flex items-center justify-between cursor-pointer"
          >
            <span>Pivot to Source IP Context</span>
            <Globe className="w-3.5 h-3.5 text-sky-400" />
          </button>

          <button
            type="button"
            onClick={pivotAndClose(detectorContext(alert))}
            className="w-full py-2 px-3 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-xs font-medium text-[var(--zf-text-primary)] flex items-center justify-between cursor-pointer"
          >
            <span>View Detector Assurance Proof</span>
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-[var(--zf-border-subtle)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
};
