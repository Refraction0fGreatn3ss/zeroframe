import { Layers } from 'lucide-react';
import type { FC } from 'react';
import { DATA_DIODE_ZONE, DMZ_HISTORIAN_ZONE, FIELD_CONTROL_ZONE, SUPERVISORY_ZONE } from '../scada-ot.data';
import { DataDiodeSpecs } from './DataDiodeSpecs';
import { PurdueZoneCard } from './PurdueZoneCard';
import { ZoneDeviceList } from './ZoneDeviceList';

export const PurdueModelMap: FC = () => (
  <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded space-y-3">
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <Layers className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-semibold text-slate-200">
          Purdue Model Architecture Segmentation & Real-Time Threat State
        </span>
      </div>
      <span className="text-[10px] font-mono text-slate-500">ISA/IEC 62443 Security Zones & Conduits</span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs font-mono">
      <PurdueZoneCard zone={FIELD_CONTROL_ZONE}>
        <ZoneDeviceList devices={FIELD_CONTROL_ZONE.devices} />
      </PurdueZoneCard>

      <PurdueZoneCard zone={SUPERVISORY_ZONE}>
        <ZoneDeviceList devices={SUPERVISORY_ZONE.devices} />
      </PurdueZoneCard>

      <PurdueZoneCard zone={DATA_DIODE_ZONE}>
        <DataDiodeSpecs />
      </PurdueZoneCard>

      <PurdueZoneCard zone={DMZ_HISTORIAN_ZONE}>
        <ZoneDeviceList devices={DMZ_HISTORIAN_ZONE.devices} />
      </PurdueZoneCard>
    </div>
  </div>
);
