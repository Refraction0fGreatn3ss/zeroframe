import { type FC, useMemo } from 'react';
import type { LivingEntity } from '../../../types';
import { buildTopology } from './entity-graph.utils';
import { GraphToolbar } from './GraphToolbar';
import { NodeInspector } from './NodeInspector';
import { TopologyCanvas } from './TopologyCanvas';
import { useEntityGraphState } from './use-entity-graph-state';

export interface EntityGraphViewProps {
  entities?: LivingEntity[];
  selectedEntityId?: string | null;
  onSelectEntity?: (id: string) => void;
}

export const EntityGraphView: FC<EntityGraphViewProps> = ({ entities, selectedEntityId, onSelectEntity }) => {
  const { nodes, edges } = useMemo(() => buildTopology(entities), [entities]);
  const { selectedNodeId, setSelectedNodeId, selectedNode, layer, setLayer, isIsolated, toggleIsolation } =
    useEntityGraphState(nodes, entities, selectedEntityId);

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    onSelectEntity?.(nodeId);
  };

  return (
    <div className="bg-[#090d16] border border-slate-800/90 rounded overflow-hidden flex flex-col font-sans">
      <GraphToolbar layer={layer} onLayerChange={setLayer} />

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        <TopologyCanvas
          nodes={nodes}
          edges={edges}
          selectedNodeId={selectedNodeId}
          isIsolated={isIsolated}
          onSelectNode={handleSelectNode}
        />
        <NodeInspector
          node={selectedNode}
          edges={edges}
          isIsolated={isIsolated(selectedNode.id)}
          onToggleIsolation={() => toggleIsolation(selectedNode.id)}
        />
      </div>
    </div>
  );
};
