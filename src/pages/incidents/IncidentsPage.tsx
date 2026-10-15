import type React from 'react';
import { useState } from 'react';
import { StructuredIncidentReportModal } from '../../components/shared/incident-report/StructuredIncidentReportModal';
import { useAppStore } from '../../stores/app-store';
import { useDrawerStore } from '../../stores/context-drawer-store';
import { useInvestigationStore } from '../../stores/investigation-store';
import { DossierBody } from './components/DossierBody';
import { DossierHeader } from './components/DossierHeader';
import { DossierTabBar } from './components/DossierTabBar';
import { IncidentQueuePane } from './components/IncidentQueuePane';
import { IncidentsHeader } from './components/IncidentsHeader';
import { useAnalystNotes } from './hooks/use-analyst-notes';
import { useContainmentActions } from './hooks/use-containment-actions';
import { useIncidentFilters } from './hooks/use-incident-filters';
import { useOperatorAssignment } from './hooks/use-operator-assignment';
import { usePcapExtraction } from './hooks/use-pcap-extraction';
import { useProcessNodeSelection } from './hooks/use-process-node-selection';
import { ROUTES } from './incidents.data';
import type { DossierTab } from './incidents.types';
import { getProcessTree } from './incidents.utils';

export const IncidentsPage: React.FC = () => {
  const { incidents, selectedIncident, selectIncident, updateIncidentState } = useInvestigationStore();
  const { setCurrentPath } = useAppStore();
  const { openContext } = useDrawerStore();

  const current = selectedIncident || incidents[0];
  const [activeTab, setActiveTab] = useState<DossierTab>('TREE');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const filters = useIncidentFilters(incidents);
  const { assignee, assignOperator } = useOperatorAssignment(current?.id);
  const { notes, newNoteText, setNewNoteText, addNote } = useAnalystNotes(current?.id);
  const { selectedProcessNode, setSelectedProcessNode } = useProcessNodeSelection();
  const { processKilled, routeToGovernedIsolation } = useContainmentActions();
  const { isExtractingPcap, extractPcap } = usePcapExtraction(current);

  if (!current) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 font-sans">
        No incidents available in current tenant scope.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 space-y-4 text-slate-200 max-w-[1720px] mx-auto font-sans select-none">
      <IncidentsHeader incident={current} onOpenReport={() => setIsReportOpen(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[720px]">
        <IncidentQueuePane
          incidents={filters.filteredIncidents}
          selectedIncidentId={current.id}
          onSelectIncident={selectIncident}
          searchFilter={filters.searchFilter}
          onSearchChange={filters.setSearchFilter}
          severityFilter={filters.severityFilter}
          onSeverityChange={filters.setSeverityFilter}
        />

        <div className="lg:col-span-8 bg-[#090d16] border border-slate-800/90 rounded flex flex-col overflow-hidden">
          <DossierHeader
            incident={current}
            assignee={assignee}
            onAssign={assignOperator}
            onStateChange={(state) => updateIncidentState(current.id, state)}
            onOpenContext={openContext}
            processKilled={processKilled}
            isExtractingPcap={isExtractingPcap}
            onRequestIsolation={routeToGovernedIsolation}
            onExtractPcap={extractPcap}
            onPivotToNetwork={() => setCurrentPath(ROUTES.networkInvestigation)}
            onPivotToEntities={() => setCurrentPath(ROUTES.entityInvestigation)}
          />

          <DossierTabBar activeTab={activeTab} onTabChange={setActiveTab} noteCount={notes?.length || 0} />

          <DossierBody
            activeTab={activeTab}
            incidentId={current.id}
            processTree={getProcessTree(current.id)}
            selectedProcessNode={selectedProcessNode}
            onSelectProcessNode={setSelectedProcessNode}
            notes={notes}
            newNoteText={newNoteText}
            onNewNoteTextChange={setNewNoteText}
            onAddNote={addNote}
          />
        </div>
      </div>

      {isReportOpen && <StructuredIncidentReportModal incident={current} onClose={() => setIsReportOpen(false)} />}
    </div>
  );
};
