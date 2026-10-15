import { Ban } from 'lucide-react';
import type { FC } from 'react';
import type { TopologyEdge, TopologyNode } from './entity-graph.types';
import { NodeFlowList } from './NodeFlowList';
import { NodeMetadataTable } from './NodeMetadataTable';
import { NodeTypeIcon } from './NodeTypeIcon';

interface NodeInspectorProps {
  node: TopologyNode;
  edges: TopologyEdge[];
  isIsolated: boolean;
  onToggleIsolation: () => void;
}

export const NodeInspector: FC<NodeInspectorProps> = ({ node, edges, isIsolated, onToggleIsolation }) => (
  <div className="lg:col-span-4 bg-[#090d16] border-l border-slate-800 p-4 flex flex-col justify-between space-y-4 text-xs font-mono">
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <NodeTypeIcon type={node.type} />
          <span className="font-semibold text-slate-100 font-sans">{node.label}</span>
        </div>
        <span className={`text-[10px] font-semibold ${node.compromised ? 'text-rose-400' : 'text-emerald-400'}`}>
          {node.compromised ? 'COMPROMISED' : 'NOMINAL'}
        </span>
      </div>

      <NodeMetadataTable node={node} />
      <NodeFlowList nodeId={node.id} edges={edges} />
    </div>

    <div className="pt-3 border-t border-slate-800 space-y-2">
      <button
        type="button"
        onClick={onToggleIsolation}
        className={`w-full py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
          isIsolated
            ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
            : 'bg-rose-950/70 hover:bg-rose-900/80 border border-rose-500/50 text-rose-200'
        }`}
      >
        <Ban className="w-3.5 h-3.5" />
        <span>{isIsolated ? 'Node Isolated (Click to Re-admit)' : 'Quarantine & Sever Sockets'}</span>
      </button>

      <div className="text-[10px] text-slate-500 text-center">eBPF network filter cuts all RFC1918 lateral routes</div>
    </div>
  </div>
);
