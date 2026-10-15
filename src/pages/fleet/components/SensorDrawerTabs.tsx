import type { FC } from 'react';
import type { SensorDrawerTab } from '../fleet.types';

interface SensorDrawerTabsProps {
  activeTab: SensorDrawerTab;
  onSelect: (tab: SensorDrawerTab) => void;
}

const DRAWER_TABS: { id: SensorDrawerTab; label: string }[] = [
  { id: 'TELEMETRY', label: 'Wire Telemetry' },
  { id: 'LIFECYCLE', label: 'Lifecycle (14-Stage)' },
  { id: 'CERTIFICATE', label: 'mTLS Certificate' },
];

export const SensorDrawerTabs: FC<SensorDrawerTabsProps> = ({ activeTab, onSelect }) => (
  <div className="flex items-center gap-2 border-b border-[#20242a] pb-2 mb-4 text-xs">
    {DRAWER_TABS.map(({ id, label }) => (
      <button
        type="button"
        key={id}
        onClick={() => onSelect(id)}
        className={`pb-1 px-2 font-medium border-b-2 transition-colors cursor-pointer ${
          activeTab === id ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-zinc-400 hover:text-zinc-200'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);
