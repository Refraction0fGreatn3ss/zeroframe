import type { FC, ReactNode } from 'react';
import type { PurdueZone } from '../scada-ot.types';

interface PurdueZoneCardProps {
  zone: Omit<PurdueZone, 'devices'>;
  children: ReactNode;
}

export const PurdueZoneCard: FC<PurdueZoneCardProps> = ({ zone, children }) => (
  <div className={zone.containerClassName}>
    <div className={`flex items-center justify-between text-[11px] pb-1 border-b ${zone.headerBorderClassName}`}>
      <span className={zone.titleClassName}>{zone.title}</span>
      <span className={zone.statusClassName}>{zone.status}</span>
    </div>
    <p className={zone.descriptionClassName}>{zone.description}</p>
    {children}
  </div>
);
