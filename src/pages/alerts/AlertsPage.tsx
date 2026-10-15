import type React from 'react';
import { useState } from 'react';
import { useDrawerStore } from '../../stores/context-drawer-store';
import { useInvestigationStore } from '../../stores/investigation-store';
import type { SecurityAlert } from '../../types';
import { AlertInspectionDrawer } from './components/AlertInspectionDrawer';
import { AlertsHeader } from './components/AlertsHeader';
import { AlertsTable } from './components/AlertsTable';
import { AlertsToolbar } from './components/AlertsToolbar';
import { CorrelationBanner } from './components/CorrelationBanner';
import { useAlertFilters } from './hooks/use-alert-filters';

export const AlertsPage: React.FC = () => {
  const { alerts } = useInvestigationStore();
  const { openContext } = useDrawerStore();
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const filters = useAlertFilters(alerts);

  return (
    <div className="p-5 space-y-5 text-[var(--zf-text-primary)] max-w-[1540px] mx-auto font-sans select-none">
      <AlertsHeader totalCount={alerts.length} exportAlerts={filters.filteredAlerts} />

      <AlertsToolbar filters={filters} totalCount={alerts.length} />

      {filters.groupCorrelated && <CorrelationBanner />}

      <AlertsTable alerts={filters.filteredAlerts} onSelectAlert={setSelectedAlert} onOpenContext={openContext} />

      {selectedAlert && (
        <AlertInspectionDrawer
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onOpenContext={openContext}
        />
      )}
    </div>
  );
};
