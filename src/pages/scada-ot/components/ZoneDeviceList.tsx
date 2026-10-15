import type { FC } from 'react';
import type { ZoneDeviceRowData } from '../scada-ot.types';

interface ZoneDeviceListProps {
  devices: ZoneDeviceRowData[];
}

export const ZoneDeviceList: FC<ZoneDeviceListProps> = ({ devices }) => (
  <div className="space-y-1 text-[11px]">
    {devices.map((device) => (
      <div key={device.name} className={`p-1 rounded ${device.toneClassName} flex items-center justify-between`}>
        <span>{device.name}</span>
        <span className={device.detailClassName}>{device.detail}</span>
      </div>
    ))}
  </div>
);
