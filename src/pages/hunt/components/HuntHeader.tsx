import type React from 'react';
import { ExportButton } from '../../../components/shared/ExportButton';
import type { HuntViewMode, WireFlow } from '../hunt.types';
import { ViewModeToggle } from './ViewModeToggle';

interface HuntHeaderProps {
  viewMode: HuntViewMode;
  onViewModeChange: (mode: HuntViewMode) => void;
  exportFlows: WireFlow[];
}

export const HuntHeader: React.FC<HuntHeaderProps> = ({ viewMode, onViewModeChange, exportFlows }) => (
  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold tracking-tight text-slate-100">
          NDR Threat Hunting & Wire Analysis Cockpit
        </h1>
        <span className="text-slate-600">·</span>
        <span className="text-xs font-mono text-cyan-400 font-medium">
          Arkime SPI + Vectra Matrix + Corelight Entropy
        </span>
      </div>
      <p className="text-xs text-slate-400 mt-0.5">
        Full-spectrum packet hunting: Time-bucketed session histograms, threat-certainty quadrants, and deep hex
        dissector.
      </p>
    </div>

    <div className="flex items-center gap-2">
      <ViewModeToggle viewMode={viewMode} onChange={onViewModeChange} />

      <ExportButton resourceName="Threat_Hunting_Flows" recordCount={exportFlows.length} data={exportFlows} />
    </div>
  </div>
);
