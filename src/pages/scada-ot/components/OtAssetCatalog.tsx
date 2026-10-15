import { Cpu } from 'lucide-react';
import type { FC } from 'react';
import type { OtDevice } from '../scada-ot.types';
import { DeviceTableRow } from './DeviceTableRow';

interface OtAssetCatalogProps {
  devices: OtDevice[];
  selectedDeviceId: string;
  onSelectDevice: (device: OtDevice) => void;
}

export const OtAssetCatalog: FC<OtAssetCatalogProps> = ({ devices, selectedDeviceId, onSelectDevice }) => (
  <div className="bg-[#090d16] border border-slate-800 rounded overflow-hidden space-y-0">
    <div className="p-3 bg-[#0d121f] border-b border-slate-800 text-xs font-mono flex items-center justify-between text-slate-300">
      <div className="flex items-center gap-2">
        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-semibold text-slate-100">Operational Technology & SCADA Asset Catalog</span>
        <span className="text-slate-500">·</span>
        <span className="text-cyan-400">{devices.length} High-Assurance Field Assets</span>
      </div>
      <span className="text-slate-500 text-[10px]">Purdue Level 0–3 Grid Hardware</span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-mono">
        <thead className="bg-[#060911] border-b border-slate-800 text-slate-500 text-[10px] uppercase font-semibold">
          <tr>
            <th className="py-2 px-3">Device Identifier</th>
            <th className="py-2 px-3">Purdue Level</th>
            <th className="py-2 px-3">Hardware Vendor & Model</th>
            <th className="py-2 px-3">IP / MAC Address</th>
            <th className="py-2 px-3">Protocol</th>
            <th className="py-2 px-3">Firmware</th>
            <th className="py-2 px-3">Key Switch</th>
            <th className="py-2 px-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {devices.map((dev) => (
            <DeviceTableRow
              key={dev.id}
              device={dev}
              isSelected={selectedDeviceId === dev.id}
              onSelect={onSelectDevice}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
