import type { LucideIcon } from 'lucide-react';
import { Camera, Cpu, KeyRound, Laptop, Phone, Printer, Radio, Server, Tv } from 'lucide-react';
import type { FC } from 'react';
import type { EntityType } from '../../../types';

interface IconStyle {
  Icon: LucideIcon;
  colorClassName: string;
}

const ENTITY_ICON_STYLES: Partial<Record<EntityType, IconStyle>> = {
  CAMERA: { Icon: Camera, colorClassName: 'text-cyan-400' },
  PRINTER: { Icon: Printer, colorClassName: 'text-slate-400' },
  VOIP: { Icon: Phone, colorClassName: 'text-indigo-400' },
  ACCESS_CONTROL: { Icon: KeyRound, colorClassName: 'text-amber-400' },
  DISPLAY: { Icon: Tv, colorClassName: 'text-purple-400' },
  OT_PLC: { Icon: Cpu, colorClassName: 'text-orange-400' },
  SERVER: { Icon: Server, colorClassName: 'text-blue-400' },
  WORKSTATION: { Icon: Laptop, colorClassName: 'text-emerald-400' },
  GATEWAY: { Icon: Radio, colorClassName: 'text-teal-400' },
};

const DEFAULT_ICON_STYLE: IconStyle = { Icon: Cpu, colorClassName: 'text-slate-400' };

interface EntityIconProps {
  type: EntityType;
}

export const EntityIcon: FC<EntityIconProps> = ({ type }) => {
  const { Icon, colorClassName } = ENTITY_ICON_STYLES[type] ?? DEFAULT_ICON_STYLE;
  return <Icon className={`w-3.5 h-3.5 ${colorClassName} shrink-0`} />;
};
