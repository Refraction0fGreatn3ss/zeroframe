import { Sliders } from 'lucide-react';
import type React from 'react';
import { TOP_PORTS } from '../hunt.data';
import { portBarClass } from '../hunt.utils';

interface TopPortsChartProps {
  onSelectPort: (port: number) => void;
}

export const TopPortsChart: React.FC<TopPortsChartProps> = ({ onSelectPort }) => (
  <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded flex flex-col justify-between space-y-2">
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5">
        <Sliders className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-semibold text-slate-200">Arkime SPI Top Ports & Protocol Mix</span>
      </div>
      <span className="text-[10px] font-mono text-slate-500">Facet Drilldown</span>
    </div>

    <div className="h-44 w-full bg-[#060911] border border-slate-800/80 rounded p-2.5 flex flex-col justify-between text-xs font-mono">
      {TOP_PORTS.map((item) => (
        <div key={item.port} onClick={() => onSelectPort(item.port)} className="space-y-0.5 cursor-pointer group">
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-300 group-hover:text-cyan-300">
              Port {item.port} ({item.service})
            </span>
            <span className="text-slate-400 tabular-nums">
              {item.flows} ({item.pct}%)
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-xs overflow-hidden">
            <div
              style={{ width: `${item.pct}%` }}
              className={`h-full rounded-xs transition-all ${portBarClass(item.port)}`}
            />
          </div>
        </div>
      ))}
    </div>

    <div className="text-[10px] font-mono text-slate-500 flex justify-between">
      <span>Click any port to inject into BPF search</span>
      <span className="text-slate-400">4,880 Total Sessions</span>
    </div>
  </div>
);
