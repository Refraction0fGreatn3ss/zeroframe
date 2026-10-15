import type React from 'react';

interface SaveHuntFormProps {
  label: string;
  onLabelChange: (label: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const SaveHuntForm: React.FC<SaveHuntFormProps> = ({ label, onLabelChange, onSave, onCancel }) => (
  <div className="p-2.5 rounded bg-[#070b14] border border-cyan-800/50 flex flex-wrap items-center gap-2 text-xs font-mono">
    <span className="text-slate-400">Save Hunt As:</span>
    <input
      type="text"
      value={label}
      onChange={(e) => onLabelChange(e.target.value)}
      placeholder="e.g. Cobalt Strike Malleable C2 Beacon"
      className="bg-[#04060c] border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs flex-1 min-w-[200px] outline-hidden focus:border-cyan-400"
    />
    <button
      type="button"
      onClick={onSave}
      disabled={!label.trim()}
      className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-40"
    >
      Save to Repository
    </button>
    <button
      type="button"
      onClick={onCancel}
      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
    >
      Cancel
    </button>
  </div>
);
