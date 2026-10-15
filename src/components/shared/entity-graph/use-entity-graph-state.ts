import { useEffect, useState } from 'react';
import type { LivingEntity } from '../../../types';
import { DEFAULT_SELECTED_NODE_ID, DEMO_TOPOLOGY_NODES, FALLBACK_SELECTED_NODE_INDEX } from './entity-graph.data';
import type { GraphLayer, TopologyNode } from './entity-graph.types';

export const useEntityGraphState = (
  nodes: TopologyNode[],
  entities: LivingEntity[] | undefined,
  selectedEntityId: string | null | undefined,
) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    selectedEntityId || (entities && entities.length > 0 ? entities[0].id : DEFAULT_SELECTED_NODE_ID),
  );
  const [layer, setLayer] = useState<GraphLayer>('ALL');
  const [isolatedHosts, setIsolatedHosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedEntityId) {
      setSelectedNodeId(selectedEntityId);
    } else if (nodes.length > 0) {
      setSelectedNodeId((current) => (nodes.some((n) => n.id === current) ? current : nodes[1]?.id || nodes[0].id));
    }
  }, [selectedEntityId, nodes]);

  const selectedNode =
    nodes.find((n) => n.id === selectedNodeId) || nodes[0] || DEMO_TOPOLOGY_NODES[FALLBACK_SELECTED_NODE_INDEX];

  const toggleIsolation = (nodeId: string) => {
    setIsolatedHosts((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const isIsolated = (nodeId: string): boolean => Boolean(isolatedHosts[nodeId]);

  return {
    selectedNodeId,
    setSelectedNodeId,
    selectedNode,
    layer,
    setLayer,
    isIsolated,
    toggleIsolation,
  };
};
