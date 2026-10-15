import { Activity } from 'lucide-react';
import type React from 'react';
import { DNS_ENTROPY_BUCKETS } from '../hunt.data';
import { entropyBarClass, entropyBarWidthPct } from '../hunt.utils';

interface DnsEntropyChartProps {
  onApplyTunnelingFilter: () => void;
}

export const DnsEntropyChart: React.FC<DnsEntropyChartProps> = ({ onApplyTunnelingFilter }) => (
  <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded flex flex-col justify-between space-y-2">
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-semibold text-slate-200">Corelight DNS Shannon Entropy</span>
      </div>
      <span className="text-[10px] font-mono text-slate-500">DGA & Tunneling</span>
    </div>

    <div className="h-44 w-full bg-[#060911] border border-slate-800/80 rounded p-2.5 flex flex-col justify-between text-xs font-mono">
      {DNS_ENTROPY_BUCKETS.map((bucket) => {
        const isCritical = bucket.threat === 'CRITICAL';
        return (
          <div
            key={bucket.range}
            onClick={() => isCritical && onApplyTunnelingFilter()}
            className={`space-y-0.5 ${isCritical ? 'cursor-pointer group' : ''}`}
          >
            <div className="flex justify-between text-[10px]">
              <span className={isCritical ? 'text-rose-400 font-bold group-hover:underline' : 'text-slate-400'}>
                {bucket.range} ({bucket.label})
              </span>
              <span className="text-slate-300 font-semibold tabular-nums">{bucket.count}</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-xs overflow-hidden">
              <div
                style={{ width: `${entropyBarWidthPct(bucket)}%` }}
                className={`h-full rounded-xs transition-all ${entropyBarClass(bucket)}`}
              />
            </div>
          </div>
        );
      })}
    </div>

    <div className="text-[10px] font-mono text-slate-500 flex justify-between">
      <span>Entropy &gt; 4.2 = Cobalt Strike / Iodine</span>
      <button type="button" onClick={onApplyTunnelingFilter} className="text-cyan-400 hover:underline cursor-pointer">
        Filter Tunneling (88)
      </button>
    </div>
  </div>
);
