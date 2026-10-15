import { X } from 'lucide-react';
import type { FC } from 'react';
import type { SensorNode } from '../../../types/fleet';
import type { SensorDrawerTab } from '../fleet.types';
import { SensorCertificatePanel } from './SensorCertificatePanel';
import { SensorDrawerTabs } from './SensorDrawerTabs';
import { SensorLifecyclePanel } from './SensorLifecyclePanel';
import { SensorTelemetryPanel } from './SensorTelemetryPanel';

interface SensorDrawerProps {
  sensor: SensorNode;
  activeTab: SensorDrawerTab;
  onSelectTab: (tab: SensorDrawerTab) => void;
  onClose: () => void;
}

export const SensorDrawer: FC<SensorDrawerProps> = ({ sensor, activeTab, onSelectTab, onClose }) => (
  <div className="fixed inset-0 z-50 flex justify-end">
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" onClick={onClose} />

    <div className="relative w-full max-w-lg bg-[#0e1013] border-l border-[#20242a] text-[#e6edf3] p-5 flex flex-col h-full shadow-2xl z-10 overflow-y-auto font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-[#20242a] mb-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">{sensor.name}</h3>
          <span className="font-mono text-[11px] text-zinc-400">{sensor.hostname}</span>
        </div>
        <button type="button" onClick={onClose} className="p-1 text-zinc-400 hover:text-white cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <SensorDrawerTabs activeTab={activeTab} onSelect={onSelectTab} />

      {activeTab === 'TELEMETRY' && <SensorTelemetryPanel sensor={sensor} />}
      {activeTab === 'LIFECYCLE' && <SensorLifecyclePanel sensor={sensor} />}
      {activeTab === 'CERTIFICATE' && <SensorCertificatePanel sensor={sensor} />}
    </div>
  </div>
);
