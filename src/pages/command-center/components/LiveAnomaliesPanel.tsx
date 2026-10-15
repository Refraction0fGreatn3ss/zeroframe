import { ArrowRight, Zap } from 'lucide-react';
import type React from 'react';
import { LIVE_WIRE_ANOMALIES } from '../command-center.data';
import { AnomalySignalCard } from './AnomalySignalCard';

interface LiveAnomaliesPanelProps {
  onOpenHunter: () => void;
}

export const LiveAnomaliesPanel: React.FC<LiveAnomaliesPanelProps> = ({ onOpenHunter }) => (
  <div className="lg:col-span-4 bg-[#090d16] border border-slate-800/90 rounded flex flex-col overflow-hidden">
    <div className="p-3 bg-[#0d121f] border-b border-slate-800 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-semibold text-slate-100">Live Wire Anomalies</span>
      </div>
      <span className="text-[11px] font-mono text-slate-500">L7 Fingerprint Stream</span>
    </div>

    <div className="p-2 space-y-2 flex-1 overflow-y-auto">
      {LIVE_WIRE_ANOMALIES.map((sig) => (
        <AnomalySignalCard key={sig.id} signal={sig} onSelect={onOpenHunter} />
      ))}
    </div>

    <div className="p-2.5 bg-[#060911] border-t border-slate-800 text-center">
      <button
        type="button"
        onClick={onOpenHunter}
        className="text-xs font-mono text-cyan-400 hover:underline flex items-center justify-center gap-1 w-full"
      >
        <span>Query Full Wire Stream in Threat Hunter</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  </div>
);
