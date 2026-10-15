import type { FC } from 'react';
import { ExportButton } from '../../../components/shared/ExportButton';
import type { SensorNode } from '../../../types/fleet';

interface FleetHeaderProps {
  sensors: SensorNode[];
}

export const FleetHeader: FC<FleetHeaderProps> = ({ sensors }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold text-zinc-100 tracking-tight">Sensor Fleet & Ingress Control</h1>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
          High-Speed Wire Plane
        </span>
      </div>
      <p className="text-xs text-zinc-400 mt-0.5">
        Physical, virtual, and SCADA optical TAP appliances with discrete connectivity, health, observation, and
        cryptographic trust states.
      </p>
    </div>

    <div className="flex items-center gap-2">
      <ExportButton resourceName="Sensor Fleet" recordCount={sensors.length} data={sensors} />
    </div>
  </div>
);
