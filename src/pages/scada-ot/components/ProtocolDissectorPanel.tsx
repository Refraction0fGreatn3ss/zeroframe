import type { FC } from 'react';
import type { OtProtocolPacket, ProtocolFilter } from '../scada-ot.types';
import { PacketTableRow } from './PacketTableRow';
import { ProtocolFilterTabs } from './ProtocolFilterTabs';

interface ProtocolDissectorPanelProps {
  packets: OtProtocolPacket[];
  selectedPacketId: string;
  onSelectPacket: (packet: OtProtocolPacket) => void;
  activeFilter: ProtocolFilter;
  onFilterChange: (filter: ProtocolFilter) => void;
}

export const ProtocolDissectorPanel: FC<ProtocolDissectorPanelProps> = ({
  packets,
  selectedPacketId,
  onSelectPacket,
  activeFilter,
  onFilterChange,
}) => (
  <div className="xl:col-span-7 bg-[#090d16] border border-slate-800 rounded overflow-hidden flex flex-col">
    <div className="p-3 bg-[#0d121f] border-b border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2 font-mono">
      <div className="flex items-center gap-2">
        <span className="text-slate-100 font-semibold">Live Industrial Protocol Dissector</span>
        <span className="text-slate-500">·</span>
        <span className="text-cyan-400">{packets.length} Captured Wire Packets</span>
      </div>

      <ProtocolFilterTabs activeFilter={activeFilter} onFilterChange={onFilterChange} />
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-mono">
        <thead className="bg-[#060911] border-b border-slate-800 text-slate-500 text-[10px] uppercase font-semibold">
          <tr>
            <th className="py-2 px-3">Packet ID</th>
            <th className="py-2 px-3">Protocol / Unit</th>
            <th className="py-2 px-3">Source &rarr; Target</th>
            <th className="py-2 px-3">Function Code</th>
            <th className="py-2 px-3">Register / Coil</th>
            <th className="py-2 px-3 text-right">Injected Value</th>
            <th className="py-2 px-3 text-center">Verdict</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {packets.map((pkt) => (
            <PacketTableRow
              key={pkt.id}
              packet={pkt}
              isSelected={selectedPacketId === pkt.id}
              onSelect={onSelectPacket}
            />
          ))}
        </tbody>
      </table>
    </div>

    <div className="p-2.5 bg-[#070b14] border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
      <span>Tap Interface: SENSOR-SCADA-OPTICAL-01 (enp4s0f0)</span>
      <span className="text-rose-400 font-semibold">Unauthenticated FC05 Injection Flagged</span>
    </div>
  </div>
);
