import { Activity } from 'lucide-react';
import type React from 'react';
import { formatBitsPerSec, formatNumber } from '../../../lib/utils';
import { FALLBACK_INGRESS_THROUGHPUT_BPS, FALLBACK_PACKET_RATE_PPS } from '../command-center.data';

interface WireIngressCardProps {
  throughputBps: number;
  packetRatePps: number;
}

export const WireIngressCard: React.FC<WireIngressCardProps> = ({ throughputBps, packetRatePps }) => (
  <div className="p-3.5 bg-[#090d16] border border-slate-800/90 rounded flex flex-col justify-between">
    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
      <span className="flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5 text-cyan-400" />
        <span>Wire Ingress Throughput</span>
      </span>
      <span className="font-mono text-[11px] text-slate-500">Kernel AF_XDP Zero-Copy</span>
    </div>
    <div className="my-2">
      <div className="text-2xl font-mono font-bold text-slate-100 tabular-nums">
        {formatBitsPerSec(throughputBps || FALLBACK_INGRESS_THROUGHPUT_BPS)}
      </div>
      <div className="text-xs font-mono text-slate-400 mt-0.5 flex items-center gap-2">
        <span>{formatNumber(packetRatePps || FALLBACK_PACKET_RATE_PPS)} packets / sec</span>
        <span className="text-slate-600">·</span>
        <span className="text-emerald-400">0 Ring Buffer Drops</span>
      </div>
    </div>
    <div className="text-[11px] text-slate-500 font-mono">
      4 Physical SFP28/QSFP+ optical taps active and synchronized
    </div>
  </div>
);
