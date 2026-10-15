import type React from 'react';
import { ExportButton } from '../../../components/shared/ExportButton';
import type { SecurityAlert } from '../../../types';

interface AlertsHeaderProps {
  totalCount: number;
  exportAlerts: SecurityAlert[];
}

export const AlertsHeader: React.FC<AlertsHeaderProps> = ({ totalCount, exportAlerts }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--zf-border-subtle)]">
    <div>
      <div className="flex items-center gap-2.5">
        <h1 className="text-lg font-semibold tracking-tight text-[var(--zf-text-primary)]">
          Raw Security Alerts & Detector Signals
        </h1>
        <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-muted)] font-medium">
          {totalCount} Events Total
        </span>
      </div>
      <p className="text-xs text-[var(--zf-text-muted)] mt-0.5">
        Correlated signal triage with detector integrity signatures and wire evidence references.
      </p>
    </div>

    <div className="flex items-center gap-2">
      <ExportButton resourceName="Raw Alerts" recordCount={exportAlerts.length} data={exportAlerts} />
    </div>
  </div>
);
