import type { LucideIcon } from 'lucide-react';
import { EyeOff, Gauge, Layers } from 'lucide-react';
import type { FC } from 'react';
import type { InspectionTab } from '../inspection-integrity.types';

interface InspectionTabsProps {
  activeTab: InspectionTab;
  blindSpotCount: number;
  onSelect: (tab: InspectionTab) => void;
}

interface TabDefinition {
  id: InspectionTab;
  icon: LucideIcon;
  iconClassName: string;
  label: string;
}

export const InspectionTabs: FC<InspectionTabsProps> = ({ activeTab, blindSpotCount, onSelect }) => {
  const tabs: TabDefinition[] = [
    { id: 'PIPELINE', icon: Layers, iconClassName: 'w-3.5 h-3.5', label: 'Observation Pipeline (7 Layers)' },
    {
      id: 'BLIND_SPOTS',
      icon: EyeOff,
      iconClassName: 'w-3.5 h-3.5 text-amber-400',
      label: `Blind Spots & Exposure (${blindSpotCount})`,
    },
    {
      id: 'GOVERNOR',
      icon: Gauge,
      iconClassName: 'w-3.5 h-3.5 text-emerald-400',
      label: 'Resource Governor & Backpressure',
    },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-[#20242a] pb-2 text-xs">
      {tabs.map(({ id, icon: Icon, iconClassName, label }) => (
        <button
          type="button"
          key={id}
          onClick={() => onSelect(id)}
          className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === id
              ? 'bg-slate-800 text-cyan-300 border border-slate-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Icon className={iconClassName} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};
