import type React from 'react';
import type { InspectorTab } from '../hunt.types';

const INSPECTOR_TABS: { tab: InspectorTab; label: string }[] = [
  { tab: 'HEX', label: 'Hex/ASCII' },
  { tab: 'DISSECTION', label: 'L2-L7 Tree' },
  { tab: 'ATTRIBUTES', label: 'JA4 Profile' },
  { tab: '7D_KEY', label: '7D Ownership' },
];

interface InspectorTabsProps {
  activeTab: InspectorTab;
  onChange: (tab: InspectorTab) => void;
}

export const InspectorTabs: React.FC<InspectorTabsProps> = ({ activeTab, onChange }) => (
  <div className="flex items-center gap-1 p-0.5 bg-[#060911] border border-slate-800 rounded">
    {INSPECTOR_TABS.map(({ tab, label }) => (
      <button
        key={tab}
        type="button"
        onClick={() => onChange(tab)}
        className={`px-2 py-0.5 text-[10px] font-mono font-medium rounded transition-colors cursor-pointer ${
          activeTab === tab ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);
