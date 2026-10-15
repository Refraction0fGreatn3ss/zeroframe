import type { FC } from 'react';
import type { OtProtocolPacket } from '../scada-ot.types';

interface PacketTargetSummaryProps {
  packet: OtProtocolPacket;
}

export const PacketTargetSummary: FC<PacketTargetSummaryProps> = ({ packet }) => (
  <div className="p-3 bg-[#060911] border border-slate-800 rounded space-y-2">
    <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-800/80">
      <span className="text-slate-400 font-semibold">Target Grid Device:</span>
      <span className="text-cyan-400 font-bold">{packet.destIp}</span>
    </div>
    <div className="text-xs text-slate-200 font-semibold">{packet.targetDescription}</div>
    <div className="text-[11px] text-slate-400">
      Target Address: <span className="text-amber-400">{packet.targetAddress}</span>
    </div>
    <div className="text-[11px] text-slate-400">
      Baseline Normal: <span className="text-emerald-400">{packet.baselineValue}</span>
    </div>
    <div className="text-[11px] text-rose-400 font-bold">Injected Payload: {packet.injectedValue}</div>
  </div>
);
