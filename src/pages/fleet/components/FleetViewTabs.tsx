import type { LucideIcon } from 'lucide-react';
import { KeyRound, Server, Sliders } from 'lucide-react';
import type { FC } from 'react';
import type { FleetViewTab } from '../fleet.types';

interface FleetViewTabsProps {
  activeTab: FleetViewTab;
  sensorCount: number;
  onSelect: (tab: FleetViewTab) => void;
}

interface TabDefinition {
  id: FleetViewTab;
  icon: LucideIcon;
  label: string;
}

export const FleetViewTabs: FC<FleetViewTabsProps> = ({ activeTab, sensorCount, onSelect }) => {
  const tabs: TabDefinition[] = [
    { id: 'SENSORS', icon: Server, label: `Sensor Appliances (${sensorCount})` },
    { id: 'PREFLIGHT', icon: Sliders, label: 'Sensor Lifecycle & Deployment Preflight' },
    { id: 'MTLS', icon: KeyRound, label: 'mTLS & Certificate Lifecycle' },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-[#20242a] pb-2 text-xs">
      {tabs.map(({ id, icon: Icon, label }) => (
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
          <Icon className="w-3.5 h-3.5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};
