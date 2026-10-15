import type { FC } from 'react';
import { DATA_DIODE_SPECS } from '../scada-ot.data';

export const DataDiodeSpecs: FC = () => (
  <div className="p-2 rounded bg-[#060b14] border border-cyan-700/50 text-[10px] text-cyan-200 space-y-1">
    {DATA_DIODE_SPECS.map((spec) => (
      <div key={spec.label} className="flex justify-between">
        <span>{spec.label}</span>
        <span className={spec.valueClassName}>{spec.value}</span>
      </div>
    ))}
  </div>
);
