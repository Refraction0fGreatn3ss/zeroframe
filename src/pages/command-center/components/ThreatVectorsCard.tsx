import { ShieldAlert } from 'lucide-react';
import type React from 'react';

interface ThreatVectorsCardProps {
  uncontainedCount: number;
  criticalCount: number;
  highCount: number;
}

export const ThreatVectorsCard: React.FC<ThreatVectorsCardProps> = ({ uncontainedCount, criticalCount, highCount }) => (
  <div className="p-3.5 bg-[#090d16] border border-slate-800/90 rounded flex flex-col justify-between">
    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
      <span className="flex items-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
        <span>Active Threat Vectors</span>
      </span>
      <span className="font-mono text-[11px] text-rose-400 font-semibold">{uncontainedCount} Uncontained</span>
    </div>

    <div className="my-2 grid grid-cols-2 gap-2 text-xs font-mono">
      <div className="p-2 bg-[#060911] border border-slate-800 rounded">
        <div className="text-slate-500 text-[10px]">CRITICAL INCIDENTS</div>
        <div className="text-xl font-bold text-rose-400 tabular-nums">{criticalCount}</div>
      </div>
      <div className="p-2 bg-[#060911] border border-slate-800 rounded">
        <div className="text-slate-500 text-[10px]">HIGH SEVERITY</div>
        <div className="text-xl font-bold text-amber-400 tabular-nums">{highCount}</div>
      </div>
    </div>

    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
      <span>Asymmetric ratio: 4.2%</span>
      <span className="text-emerald-400">Zero data exfiltration detected</span>
    </div>
  </div>
);
