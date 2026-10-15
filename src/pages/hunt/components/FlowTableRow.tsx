import type React from 'react';
import type { WireFlow } from '../hunt.types';
import { formatFlowBytes, formatFlowIndicator, formatFlowTime } from '../hunt.utils';
import { VerdictBadge } from './VerdictBadge';

interface FlowTableRowProps {
  flow: WireFlow;
  isSelected: boolean;
  onSelect: (flow: WireFlow) => void;
}

export const FlowTableRow: React.FC<FlowTableRowProps> = ({ flow, isSelected, onSelect }) => (
  <tr
    onClick={() => onSelect(flow)}
    className={`cursor-pointer transition-colors ${
      isSelected ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white' : 'hover:bg-slate-800/40'
    }`}
  >
    <td className="py-2.5 px-3 font-semibold text-slate-300 whitespace-nowrap">{flow.flowId}</td>
    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap text-[10px]">{formatFlowTime(flow.timestamp)}</td>
    <td className="py-2.5 px-3 whitespace-nowrap text-[10px] font-mono text-slate-300">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-cyan-300 font-semibold">{flow.siteId}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300">{flow.sensorId}</span>
        </div>
        <div className="text-[9px] text-slate-400">
          QinQ:{' '}
          <span className="text-slate-200">
            O:{flow.outerVid} I:{flow.innerVid}
          </span>{' '}
          · <span className="text-indigo-300">{flow.routingDomain}</span>
        </div>
      </div>
    </td>
    <td className="py-2.5 px-3 whitespace-nowrap text-[11px]">
      <span className="text-slate-200">
        {flow.srcIp}:{flow.srcPort}
      </span>
      <span className="text-slate-500 mx-1.5">&rarr;</span>
      <span className="text-slate-200">
        {flow.dstIp}:{flow.dstPort}
      </span>
    </td>
    <td className="py-2.5 px-3 whitespace-nowrap text-[10px]">
      <span className="text-slate-300 font-semibold">{flow.proto}</span>
      {flow.tcpFlags && flow.tcpFlags.length > 0 && (
        <span className="text-slate-500 ml-1">[{flow.tcpFlags.join(',')}]</span>
      )}
    </td>
    <td className="py-2.5 px-3 whitespace-nowrap text-[10px] text-slate-400 max-w-[160px] truncate" title={flow.ja4}>
      {formatFlowIndicator(flow)}
    </td>
    <td className="py-2.5 px-3 text-right whitespace-nowrap text-slate-400 tabular-nums">
      {formatFlowBytes(flow.bytes)}
    </td>
    <td className="py-2.5 px-3 text-center whitespace-nowrap">
      <VerdictBadge verdict={flow.verdict} />
    </td>
  </tr>
);
