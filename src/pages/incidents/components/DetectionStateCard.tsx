import { Clock } from 'lucide-react';
import type React from 'react';
import { FALLBACK_DETECTION_TIMESTAMP } from '../incidents.data';

interface DetectionStateCardProps {
  detectedAt: string;
}

export const DetectionStateCard: React.FC<DetectionStateCardProps> = ({ detectedAt }) => (
  <div className="p-2.5 rounded bg-[#060912] border border-cyan-900/40 text-xs font-mono space-y-1.5">
    <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 text-[11px]">
      <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
        <Clock className="w-3.5 h-3.5" />
        <span>HISTORICAL STATE AT DETECTION TIME</span>
      </div>
      <span className="text-[10px] text-slate-500 font-mono">
        Timestamp: {detectedAt || FALLBACK_DETECTION_TIMESTAMP}
      </span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
      <div className="p-1.5 rounded bg-[#080d1a] border border-slate-800/60">
        <span className="text-slate-500 block text-[10px]">Historical Visibility:</span>
        <span className="text-slate-200 font-semibold">94.2% Flow Coverage</span>
        <span className="text-[10px] text-cyan-400/80 block">Symmetric L2/L3 TAP</span>
      </div>
      <div className="p-1.5 rounded bg-[#080d1a] border border-slate-800/60">
        <span className="text-slate-500 block text-[10px]">Historical Detector State:</span>
        <span className="text-slate-200 font-semibold">DET-BEACON-04 Active</span>
        <span className="text-[10px] text-emerald-400/80 block">Engine v3.2.1 · Latency 14ms</span>
      </div>
      <div className="p-1.5 rounded bg-[#080d1a] border border-slate-800/60">
        <span className="text-slate-500 block text-[10px]">Historical Operating Mode:</span>
        <span className="text-emerald-400 font-semibold">ACTIVE_PROTECTION</span>
        <span className="text-[10px] text-slate-400 block">Kill-Switch: Armed</span>
      </div>
      <div className="p-1.5 rounded bg-[#080d1a] border border-slate-800/60">
        <span className="text-slate-500 block text-[10px]">Evidence State:</span>
        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950/80 border border-cyan-700/60 text-cyan-300">
          VALIDATED
        </span>
        <span className="text-[10px] text-slate-400 block">Immutable Block #8819</span>
      </div>
    </div>
  </div>
);
