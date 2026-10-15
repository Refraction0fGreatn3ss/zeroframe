import { Zap } from 'lucide-react';
import type { FC, ReactNode } from 'react';

interface ScadaHeaderProps {
  actions: ReactNode;
}

export const ScadaHeader: FC<ScadaHeaderProps> = ({ actions }) => (
  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold tracking-tight text-slate-100 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>SCADA / OT & Industrial Grid Defense</span>
        </h1>
        <span className="text-slate-600">·</span>
        <span className="text-xs font-mono text-cyan-400 font-medium">Purdue Model Levels 0–3 Passive Optical Tap</span>
      </div>
      <p className="text-xs text-slate-400 mt-0.5">
        Real-time industrial protocol dissector, Modbus coil injection detector, and physical hardware data diode
        assurance.
      </p>
    </div>

    {actions}
  </div>
);
