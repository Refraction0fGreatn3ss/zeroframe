import type React from 'react';
import type { WireFlow } from '../hunt.types';

interface ProtocolDissectionViewProps {
  flow: WireFlow;
}

export const ProtocolDissectionView: React.FC<ProtocolDissectionViewProps> = ({ flow }) => (
  <div className="font-mono text-xs space-y-2 text-slate-300">
    <div className="p-2 rounded bg-[#090d16] border border-slate-800">
      <span className="text-cyan-400 font-semibold">Frame 1:</span> {flow.bytes} bytes on wire ({flow.packets} packets)
    </div>
    <div className="p-2 rounded bg-[#090d16] border border-slate-800">
      <span className="text-cyan-400 font-semibold">Ethernet II:</span> Src: 00:1a:2b:3c:4d:5e, Dst: 00:0c:29:88:12:44
    </div>
    <div className="p-2 rounded bg-[#090d16] border border-slate-800">
      <span className="text-cyan-400 font-semibold">IPv4 Protocol:</span> Src: {flow.srcIp}, Dst: {flow.dstIp}
    </div>
    <div className="p-2 rounded bg-[#090d16] border border-slate-800">
      <span className="text-cyan-400 font-semibold">{flow.proto} Transport:</span> Port {flow.srcPort} &rarr; Port{' '}
      {flow.dstPort}
    </div>
    {flow.sni && (
      <div className="p-2 rounded bg-[#090d16] border border-slate-800">
        <span className="text-amber-400 font-semibold">L7 Application Metadata:</span> {flow.sni}
      </div>
    )}
  </div>
);
