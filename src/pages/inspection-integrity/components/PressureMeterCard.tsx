import type { FC } from 'react';
import type { PressureMeter } from '../inspection-integrity.types';
import { getPressureBarClassName } from '../inspection-integrity.utils';

interface PressureMeterCardProps {
  meter: PressureMeter;
}

export const PressureMeterCard: FC<PressureMeterCardProps> = ({ meter }) => (
  <div className="p-3 bg-[#101215] border border-[#20242a] rounded space-y-2 text-xs">
    <div className="flex justify-between items-center text-zinc-300">
      <span className="font-medium">{meter.name}</span>
      <span className="font-mono font-bold text-cyan-400">
        {meter.value}
        {meter.unit}
      </span>
    </div>
    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${getPressureBarClassName(meter.value)}`}
        style={{ width: `${meter.value}%` }}
      />
    </div>
    <div className="text-[10px] font-mono text-zinc-500">{meter.detail}</div>
  </div>
);
