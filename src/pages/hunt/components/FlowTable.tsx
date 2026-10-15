import type React from 'react';
import type { WireFlow } from '../hunt.types';
import { FlowTableRow } from './FlowTableRow';

interface FlowTableProps {
  flows: WireFlow[];
  selectedFlowId: string;
  onSelectFlow: (flow: WireFlow) => void;
}

export const FlowTable: React.FC<FlowTableProps> = ({ flows, selectedFlowId, onSelectFlow }) => (
  <div className="xl:col-span-7 bg-[#090d16] border border-slate-800 rounded overflow-hidden flex flex-col">
    <div className="p-3 bg-[#0d121f] border-b border-slate-800 text-xs text-slate-300 flex items-center justify-between font-mono">
      <div className="flex items-center gap-2">
        <span className="text-slate-100 font-semibold">Live Wire Session Stream</span>
        <span className="text-slate-500">·</span>
        <span className="text-cyan-400">{flows.length} Captured Flows</span>
      </div>
      <span className="text-slate-500 text-[10px]">Ring Buffer: TAP-CORE-01 (10G SFP28)</span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-mono">
        <thead className="bg-[#060911] border-b border-slate-800 text-slate-500 text-[10px] uppercase font-semibold">
          <tr>
            <th className="py-2 px-3">Flow ID</th>
            <th className="py-2 px-3">Timestamp</th>
            <th className="py-2 px-3">7D Ownership Key (Site / Sensor / VLAN / VRF)</th>
            <th className="py-2 px-3">5-Tuple (Src &rarr; Dst)</th>
            <th className="py-2 px-3">Proto / Flags</th>
            <th className="py-2 px-3">JA4 / SNI Indicator</th>
            <th className="py-2 px-3 text-right">Bytes</th>
            <th className="py-2 px-3 text-center">Verdict</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80 text-slate-300 text-[11px]">
          {flows.map((flow) => (
            <FlowTableRow
              key={flow.flowId}
              flow={flow}
              isSelected={selectedFlowId === flow.flowId}
              onSelect={onSelectFlow}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
