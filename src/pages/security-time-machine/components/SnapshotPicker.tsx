import type React from 'react';

interface SnapshotPickerProps {
  selectedTime: string;
  isReconstructing: boolean;
  onTimeChange: (value: string) => void;
  onReconstruct: () => void;
}

export const SnapshotPicker: React.FC<SnapshotPickerProps> = ({
  selectedTime,
  isReconstructing,
  onTimeChange,
  onReconstruct,
}) => (
  <div className="p-3 bg-[#101215] border border-[#20242a] rounded space-y-2 text-xs">
    <span className="font-semibold text-zinc-300 block">Select Point-in-Time Snapshot</span>

    <div className="flex flex-wrap items-center gap-2.5">
      <input
        type="datetime-local"
        value={selectedTime}
        onChange={(e) => onTimeChange(e.target.value)}
        className="px-3 py-1.5 bg-[#14171c] border border-[#23272e] rounded text-zinc-100 font-mono text-xs focus:outline-hidden focus:border-zinc-500"
      />

      <button
        type="button"
        onClick={onReconstruct}
        disabled={isReconstructing}
        className="px-3.5 py-1.5 rounded bg-[#181b20] border border-[#2a2f38] hover:bg-[#20242a] text-zinc-200 font-medium text-xs cursor-pointer transition-colors"
      >
        {isReconstructing ? 'Reconstructing graph...' : 'Reconstruct Truth State'}
      </button>
    </div>
  </div>
);
