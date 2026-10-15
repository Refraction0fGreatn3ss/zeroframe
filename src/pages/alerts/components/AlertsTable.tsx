import type React from 'react';
import type { ContextItem } from '../../../stores/context-drawer-store';
import type { SecurityAlert } from '../../../types';
import { AlertRow } from './AlertRow';

interface AlertsTableProps {
  alerts: SecurityAlert[];
  onSelectAlert: (alert: SecurityAlert) => void;
  onOpenContext: (item: ContextItem) => void;
}

export const AlertsTable: React.FC<AlertsTableProps> = ({ alerts, onSelectAlert, onOpenContext }) => (
  <div className="bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] rounded-lg overflow-hidden shadow-xs">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-sans">
        <thead className="bg-[var(--zf-surface-topbar)] border-b border-[var(--zf-border-subtle)] text-[var(--zf-text-muted)] text-[11px] font-medium">
          <tr>
            <th className="py-2.5 px-3 w-24">Severity</th>
            <th className="py-2.5 px-3">Alert Name</th>
            <th className="py-2.5 px-3">Detector Key</th>
            <th className="py-2.5 px-3">Flow: Source &rarr; Destination</th>
            <th className="py-2.5 px-3">Fidelity</th>
            <th className="py-2.5 px-3">Confidence</th>
            <th className="py-2.5 px-3">Timestamp</th>
            <th className="py-2.5 px-3 text-right">Evidence Ref</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--zf-border-subtle)]">
          {alerts.map((alert) => (
            <AlertRow key={alert.id} alert={alert} onSelect={onSelectAlert} onOpenContext={onOpenContext} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
