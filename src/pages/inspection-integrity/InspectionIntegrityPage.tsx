import type { FC } from 'react';
import { useState } from 'react';
import { useInspectionStore } from '../../stores/inspection-store';
import { BlindSpotsView } from './components/BlindSpotsView';
import { GovernorView } from './components/GovernorView';
import { InspectionHeader } from './components/InspectionHeader';
import { InspectionTabs } from './components/InspectionTabs';
import { PipelineView } from './components/PipelineView';
import { useExpandedStage } from './hooks/use-expanded-stage';
import { BLIND_SPOTS } from './inspection-integrity.data';
import type { GovernorState, InspectionTab } from './inspection-integrity.types';

export const InspectionIntegrityPage: FC = () => {
  const { stages, encapsulation, crypto } = useInspectionStore();
  const [activeTab, setActiveTab] = useState<InspectionTab>('PIPELINE');
  const [governorState, setGovernorState] = useState<GovernorState>('NORMAL');
  const { expandedStage, toggleStage } = useExpandedStage();

  return (
    <div className="p-5 space-y-4 text-[#e6edf3] max-w-[1720px] mx-auto font-sans">
      <InspectionHeader stages={stages} />

      <InspectionTabs activeTab={activeTab} blindSpotCount={BLIND_SPOTS.length} onSelect={setActiveTab} />

      {activeTab === 'PIPELINE' && (
        <PipelineView
          stages={stages}
          encapsulation={encapsulation}
          crypto={crypto}
          expandedStage={expandedStage}
          onToggleStage={toggleStage}
        />
      )}

      {activeTab === 'BLIND_SPOTS' && <BlindSpotsView />}

      {activeTab === 'GOVERNOR' && (
        <GovernorView governorState={governorState} onGovernorStateChange={setGovernorState} />
      )}
    </div>
  );
};
