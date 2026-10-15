import type { FC } from 'react';
import { PACKET_VERDICT_STYLES } from '../scada-ot.data';
import type { OtProtocolPacket } from '../scada-ot.types';
import { formatPacketTime } from '../scada-ot.utils';
import { StatusIndicator } from './StatusIndicator';

interface PacketTableRowProps {
  packet: OtProtocolPacket;
  isSelected: boolean;
  onSelect: (packet: OtProtocolPacket) => void;
}

export const PacketTableRow: FC<PacketTableRowProps> = ({ packet: pkt, isSelected, onSelect }) => (
  <tr
    onClick={() => onSelect(pkt)}
    className={`hover:bg-[#12192b] transition-colors cursor-pointer ${isSelected ? 'bg-[#131c33] text-white' : ''}`}
  >
    <td className="py-2.5 px-3">
      <span className="font-semibold text-cyan-300">{pkt.id}</span>
      <div className="text-[10px] text-slate-500">{formatPacketTime(pkt.timestamp)}</div>
    </td>
    <td className="py-2.5 px-3">
      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300">
        {pkt.protocol}
      </span>
      {pkt.unitId !== undefined && <span className="text-[10px] text-slate-500 ml-1">U:{pkt.unitId}</span>}
    </td>
    <td className="py-2.5 px-3 text-[11px]">
      <div>
        {pkt.sourceIp}:{pkt.sourcePort}
      </div>
      <div className="text-slate-500">
        &rarr; {pkt.destIp}:{pkt.destPort}
      </div>
    </td>
    <td className="py-2.5 px-3 text-[11px] font-medium text-slate-200">{pkt.functionCode}</td>
    <td className="py-2.5 px-3 text-[11px]">
      <div className="text-slate-300 font-semibold">{pkt.targetAddress}</div>
      <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{pkt.targetDescription}</div>
    </td>
    <td className="py-2.5 px-3 text-right text-[11px] font-semibold">
      <span className={pkt.verdict === 'ATTACK_INJECTION' ? 'text-rose-400' : 'text-slate-300'}>
        {pkt.injectedValue}
      </span>
    </td>
    <td className="py-2.5 px-3 text-center">
      <StatusIndicator style={PACKET_VERDICT_STYLES[pkt.verdict]} />
    </td>
  </tr>
);
