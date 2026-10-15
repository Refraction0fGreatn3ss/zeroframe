import type { FC } from 'react';
import type { TopologyEdge, TopologyNode } from './entity-graph.types';
import { findNode, isEdgeConnectedTo } from './entity-graph.utils';
import { GraphDefs } from './GraphDefs';
import { GraphLegend } from './GraphLegend';
import { TopologyEdgeView } from './TopologyEdgeView';
import { TopologyNodeView } from './TopologyNodeView';

interface TopologyCanvasProps {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  selectedNodeId: string;
  isIsolated: (nodeId: string) => boolean;
  onSelectNode: (nodeId: string) => void;
}

export const TopologyCanvas: FC<TopologyCanvasProps> = ({ nodes, edges, selectedNodeId, isIsolated, onSelectNode }) => (
  <div className="lg:col-span-8 p-4 bg-[#060911] relative overflow-hidden flex items-center justify-center">
    <svg className="w-full h-[480px]" viewBox="0 0 850 420" role="img" aria-label="Entity relationship topology">
      <GraphDefs />

      {edges.map((edge) => {
        const source = findNode(nodes, edge.source);
        const target = findNode(nodes, edge.target);
        if (!source || !target) return null;

        return (
          <TopologyEdgeView
            key={edge.id}
            edge={edge}
            source={source}
            target={target}
            isHighlighted={isEdgeConnectedTo(edge, selectedNodeId)}
          />
        );
      })}

      {nodes.map((node) => (
        <TopologyNodeView
          key={node.id}
          node={node}
          isSelected={selectedNodeId === node.id}
          isIsolated={isIsolated(node.id)}
          onSelect={() => onSelectNode(node.id)}
        />
      ))}
    </svg>

    <GraphLegend />
  </div>
);
