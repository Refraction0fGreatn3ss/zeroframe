import type { LucideIcon } from 'lucide-react';
import { Activity, BarChart2, FileCode } from 'lucide-react';
import type React from 'react';
import type { HuntViewMode } from '../hunt.types';

interface ViewModeOption {
  mode: HuntViewMode;
  label: string;
  Icon: LucideIcon;
}

const VIEW_MODE_OPTIONS: ViewModeOption[] = [
  { mode: 'COMBINED', label: 'Cockpit Split', Icon: BarChart2 },
  { mode: 'GRAPHS_ONLY', label: 'Competitor Graphs', Icon: Activity },
  { mode: 'FLOWS_ONLY', label: 'Raw Flows & Hex', Icon: FileCode },
];

interface ViewModeToggleProps {
  viewMode: HuntViewMode;
  onChange: (mode: HuntViewMode) => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, onChange }) => (
  <div className="flex items-center bg-[#080c14] border border-slate-800 rounded p-0.5 text-xs font-mono">
    {VIEW_MODE_OPTIONS.map(({ mode, label, Icon }) => (
      <button
        type="button"
        key={mode}
        onClick={() => onChange(mode)}
        className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
          viewMode === mode
            ? 'bg-slate-800 text-cyan-300 font-semibold shadow-xs'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </button>
    ))}
  </div>
);
