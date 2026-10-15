import type { FC } from 'react';
import type { TopologyEdge } from './entity-graph.types';
import { isEdgeConnectedTo } from './entity-graph.utils';

interface NodeFlowListProps {
  nodeId: string;
  edges: TopologyEdge[];
}

export const NodeFlowList: FC<NodeFlowListProps> = ({ nodeId, edges }) => (
  <div className="pt-2 border-t border-slate-800 space-y-1.5">
    <div className="text-slate-400 font-semibold text-[11px]">Connected Graph Flows</div>
    <div className="space-y-1 text-[10px]">
      {edges
        .filter((e) => isEdgeConnectedTo(e, nodeId))
        .map((e) => (
          <div
            key={e.id}
            className="p-1.5 rounded bg-[#060911] border border-slate-800/80 flex items-center justify-between"
          >
            <span>{e.source === nodeId ? `➔ Outbound: ${e.target}` : `⬅ Inbound: ${e.source}`}</span>
            <span className="text-slate-400">{e.protocol}</span>
          </div>
        ))}
    </div>
  </div>
);
