import type React from 'react';
import type { ComplianceFrameworkSummary } from '../../../types/compliance';

interface FrameworkTabsProps {
  frameworks: ComplianceFrameworkSummary[];
  selectedFrameworkId: string;
  onSelect: (frameworkId: string) => void;
}

export const FrameworkTabs: React.FC<FrameworkTabsProps> = ({ frameworks, selectedFrameworkId, onSelect }) => (
  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-[#20242a]">
    {frameworks.map((framework) => (
      <button
        type="button"
        key={framework.id}
        onClick={() => onSelect(framework.id)}
        className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
          framework.id === selectedFrameworkId
            ? 'bg-[#181c22] text-white font-medium border border-[#2b323c]'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#121417]'
        }`}
      >
        <span>{framework.name}</span>
        <span className="font-mono text-[10px] text-zinc-500 ml-1.5">({framework.readinessPercentage}%)</span>
      </button>
    ))}
  </div>
);
