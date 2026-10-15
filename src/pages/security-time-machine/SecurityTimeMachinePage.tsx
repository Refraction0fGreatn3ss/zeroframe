import type React from 'react';
import { PageHeader } from '../../components/page/PageHeader';
import { ReconstructionResult } from './components/ReconstructionResult';
import { SnapshotPicker } from './components/SnapshotPicker';
import { useTimeMachine } from './hooks/use-time-machine';

export const SecurityTimeMachinePage: React.FC = () => {
  const { selectedTime, setSelectedTime, isReconstructing, historicalState, reconstruct } = useTimeMachine();

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      <PageHeader
        title="Security Time Machine"
        description="Bitemporal state reconstruction: What did ZeroFrame know at timestamp T?"
      />

      <SnapshotPicker
        selectedTime={selectedTime}
        isReconstructing={isReconstructing}
        onTimeChange={setSelectedTime}
        onReconstruct={reconstruct}
      />

      <ReconstructionResult state={historicalState} />
    </div>
  );
};
