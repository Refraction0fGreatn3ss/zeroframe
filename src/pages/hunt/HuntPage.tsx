import type React from 'react';
import { useState } from 'react';
import { useAppStore } from '../../stores/app-store';
import { FlowTable } from './components/FlowTable';
import { HuntGraphsSection } from './components/HuntGraphsSection';
import { HuntHeader } from './components/HuntHeader';
import { HuntQueryPanel } from './components/HuntQueryPanel';
import { PacketInspector } from './components/PacketInspector';
import { ResultStateBanner } from './components/ResultStateBanner';
import { useFlowInspector } from './hooks/use-flow-inspector';
import { useHuntFilters } from './hooks/use-hunt-filters';
import { useSavedHunts } from './hooks/use-saved-hunts';
import { WIRE_FLOWS } from './hunt.data';
import type { HuntViewMode, QuadrantEntity, ResultState } from './hunt.types';

const PCAP_EVIDENCE_PATH = '/evidence/pcap';

export const HuntPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<HuntViewMode>('COMBINED');
  const [resultState, setResultState] = useState<ResultState>('COMPLETE');
  const [selectedQuadrantEntity, setSelectedQuadrantEntity] = useState<string | null>(null);

  const filters = useHuntFilters();
  const savedHunts = useSavedHunts();
  const inspector = useFlowInspector();
  const { setCurrentPath } = useAppStore();

  const showGraphs = viewMode === 'COMBINED' || viewMode === 'GRAPHS_ONLY';
  const showFlows = viewMode === 'COMBINED' || viewMode === 'FLOWS_ONLY';

  const handleSelectQuadrantEntity = (entity: QuadrantEntity) => {
    setSelectedQuadrantEntity(entity.id);
    filters.applyHostFilter(entity.id);
  };

  const toggleResultState = () => setResultState(resultState === 'COMPLETE' ? 'PARTIAL / TRUNCATED' : 'COMPLETE');

  return (
    <div className="p-4 sm:p-5 space-y-4 text-slate-100 max-w-[1720px] mx-auto font-sans select-none">
      <HuntHeader viewMode={viewMode} onViewModeChange={setViewMode} exportFlows={WIRE_FLOWS} />

      <HuntQueryPanel filters={filters} savedHunts={savedHunts} />

      <ResultStateBanner
        resultState={resultState}
        flowCount={filters.filteredFlows.length}
        onToggle={toggleResultState}
      />

      {showGraphs && (
        <HuntGraphsSection
          selectedQuadrantEntityId={selectedQuadrantEntity}
          onSelectQuadrantEntity={handleSelectQuadrantEntity}
          onSelectTimeBucket={filters.applyTimeBucketFilter}
          onApplyTunnelingFilter={filters.applyEntropyFilter}
          onSelectPort={filters.applyPortFilter}
        />
      )}

      {showFlows && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-start">
          <FlowTable
            flows={filters.filteredFlows}
            selectedFlowId={inspector.selectedFlow.flowId}
            onSelectFlow={inspector.selectFlow}
          />
          <PacketInspector inspector={inspector} onExtractPcap={() => setCurrentPath(PCAP_EVIDENCE_PATH)} />
        </div>
      )}
    </div>
  );
};
