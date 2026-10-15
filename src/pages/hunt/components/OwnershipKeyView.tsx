import type React from 'react';
import type { WireFlow } from '../hunt.types';

interface OwnershipKeyViewProps {
  flow: WireFlow;
}

export const OwnershipKeyView: React.FC<OwnershipKeyViewProps> = ({ flow }) => (
  <div className="font-mono text-xs space-y-2 text-slate-300">
    <div className="p-2.5 rounded bg-[#080d1a] border border-cyan-800/60 space-y-1">
      <div className="text-cyan-300 font-semibold text-[11px] flex items-center justify-between">
        <span>7-DIMENSIONAL FLOW OWNERSHIP KEY</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-400">
          IMMUTABLE WIRE TUPLE
        </span>
      </div>
      <p className="text-[10px] text-slate-400 font-sans">
        Authoritative multi-dimensional packet provenance key mapping physical ingress point, encapsulation tags, and
        logical security partition.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-1.5 text-[11px]">
      <div className="p-2 rounded bg-[#090d16] border border-slate-800 flex justify-between items-center">
        <span className="text-slate-400">1. Site ID:</span>
        <span className="font-bold text-cyan-300">{flow.siteId}</span>
      </div>
      <div className="p-2 rounded bg-[#090d16] border border-slate-800 flex justify-between items-center">
        <span className="text-slate-400">2. Sensor ID:</span>
        <span className="font-bold text-slate-200">{flow.sensorId}</span>
      </div>
      <div className="p-2 rounded bg-[#090d16] border border-slate-800 flex justify-between items-center">
        <span className="text-slate-400">3. Outer VID (802.1Q/ad QinQ):</span>
        <span className="font-bold text-emerald-400">VLAN {flow.outerVid}</span>
      </div>
      <div className="p-2 rounded bg-[#090d16] border border-slate-800 flex justify-between items-center">
        <span className="text-slate-400">4. Inner VID (802.1Q):</span>
        <span className="font-bold text-emerald-400">VLAN {flow.innerVid}</span>
      </div>
      <div className="p-2 rounded bg-[#090d16] border border-slate-800 flex justify-between items-center">
        <span className="text-slate-400">5. 802.1p PCP / DEI:</span>
        <span className="text-amber-300 font-medium">{flow.pcpDei}</span>
      </div>
      <div className="p-2 rounded bg-[#090d16] border border-slate-800 flex justify-between items-center">
        <span className="text-slate-400">6. Routing Domain (VRF):</span>
        <span className="font-bold text-purple-300">{flow.routingDomain}</span>
      </div>
      <div className="p-2 rounded bg-[#090d16] border border-slate-800 space-y-0.5">
        <span className="text-slate-400 block text-[10px]">7. Full 5-Tuple:</span>
        <div className="text-slate-200 font-semibold break-all text-[11px]">
          {flow.srcIp}:{flow.srcPort} &rarr; {flow.dstIp}:{flow.dstPort} ({flow.proto})
        </div>
      </div>
    </div>
  </div>
);
