import type { FC } from 'react';
import { DEVICE_STATUS_STYLES } from '../scada-ot.data';
import type { OtDevice } from '../scada-ot.types';
import { StatusIndicator } from './StatusIndicator';

interface DeviceTableRowProps {
  device: OtDevice;
  isSelected: boolean;
  onSelect: (device: OtDevice) => void;
}

export const DeviceTableRow: FC<DeviceTableRowProps> = ({ device: dev, isSelected, onSelect }) => (
  <tr
    onClick={() => onSelect(dev)}
    className={`hover:bg-[#12192b] transition-colors cursor-pointer ${isSelected ? 'bg-[#131c33]' : ''}`}
  >
    <td className="py-2.5 px-3">
      <div className="font-semibold text-slate-100">{dev.name}</div>
      <div className="text-[10px] text-cyan-400">{dev.id}</div>
    </td>
    <td className="py-2.5 px-3">
      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300">
        {dev.purdueLevel}
      </span>
    </td>
    <td className="py-2.5 px-3 text-slate-300 text-[11px]">{dev.vendor}</td>
    <td className="py-2.5 px-3 text-[11px]">
      <div>{dev.ip}</div>
      <div className="text-slate-500 text-[10px]">{dev.mac}</div>
    </td>
    <td className="py-2.5 px-3">
      <span className="font-semibold text-slate-200">{dev.protocol}</span>
    </td>
    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{dev.firmwareVersion}</td>
    <td className="py-2.5 px-3">
      <span
        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
          dev.keySwitchState === 'REMOTE'
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
        }`}
      >
        {dev.keySwitchState}
      </span>
    </td>
    <td className="py-2.5 px-3">
      <StatusIndicator style={DEVICE_STATUS_STYLES[dev.status]} />
    </td>
  </tr>
);
