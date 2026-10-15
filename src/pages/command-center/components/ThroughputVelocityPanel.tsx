import { Activity, ArrowRight } from 'lucide-react';
import type React from 'react';
import { ThroughputChart } from './ThroughputChart';

interface ThroughputVelocityPanelProps {
  onExploreInHunter: () => void;
}

export const ThroughputVelocityPanel: React.FC<ThroughputVelocityPanelProps> = ({ onExploreInHunter }) => (
  <div className="p-3.5 bg-[#090d16] border border-slate-800/90 rounded space-y-2">
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <Activity className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-semibold text-slate-100 font-sans">
          Wire Throughput Velocity & Ingress Anomalies Curve (Last 60 Minutes)
        </span>
        <span className="text-slate-600">·</span>
        <span className="text-[11px] font-mono text-slate-400">Kernel eBPF AF_XDP Sampling Rate: 100ms</span>
      </div>
      <div className="flex items-center gap-3 text-[11px] font-mono">
        <span className="flex items-center gap-1.5 text-cyan-400">
          <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
          <span>Observed Ingress Rate</span>
        </span>
        <span className="flex items-center gap-1.5 text-slate-500">
          <span className="w-2.5 h-0.5 bg-slate-600 inline-block stroke-dasharray" />
          <span>7-Day Moving Baseline</span>
        </span>
        <button
          type="button"
          onClick={onExploreInHunter}
          className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Explore in SPIGraph Hunter</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>

    <ThroughputChart />
  </div>
);
