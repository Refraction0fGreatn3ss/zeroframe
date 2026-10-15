import { Layers } from 'lucide-react';
import type React from 'react';
import { PROTOCOL_DISTRIBUTION } from '../command-center.data';

export const ProtocolDistributionCard: React.FC = () => (
  <div className="p-3.5 bg-[#090d16] border border-slate-800/90 rounded flex flex-col justify-between">
    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
      <span className="flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5 text-cyan-400" />
        <span>L7 Protocol Distribution</span>
      </span>
      <span className="font-mono text-[11px] text-slate-500">Live Wire Inspection</span>
    </div>

    <div className="my-2 space-y-1.5">
      <div className="h-3 w-full bg-slate-900 rounded-xs flex overflow-hidden">
        {PROTOCOL_DISTRIBUTION.map((proto) => (
          <div
            key={proto.name}
            style={{ width: `${proto.pct}%` }}
            className={`${proto.color} h-full transition-all`}
            title={`${proto.name}: ${proto.pct}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-400">
        {PROTOCOL_DISTRIBUTION.map((proto) => (
          <div key={proto.name} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-xs ${proto.color}`} />
            <span>{proto.name}</span>
            <span className="text-slate-200 font-medium tabular-nums">{proto.pct}%</span>
          </div>
        ))}
      </div>
    </div>

    <div className="text-[11px] text-slate-500 font-mono">
      TLS 1.3 encrypted sessions analyzed via client-hello JA4 fingerprinting
    </div>
  </div>
);
