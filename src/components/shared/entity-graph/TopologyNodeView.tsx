import type { FC } from 'react';
import type { TopologyNode } from './entity-graph.types';
import { getNodeFill, getNodeStroke } from './entity-graph.utils';

const SELECTED_RADIUS = 26;
const DEFAULT_RADIUS = 22;
const LABEL_OFFSET_Y = 36;
const SUBLABEL_OFFSET_Y = 49;

interface TopologyNodeViewProps {
  node: TopologyNode;
  isSelected: boolean;
  isIsolated: boolean;
  onSelect: () => void;
}

export const TopologyNodeView: FC<TopologyNodeViewProps> = ({ node, isSelected, isIsolated, onSelect }) => (
  <g onClick={onSelect} className="cursor-pointer">
    <circle
      cx={node.x}
      cy={node.y}
      r={isSelected ? SELECTED_RADIUS : DEFAULT_RADIUS}
      fill={getNodeFill(node, isIsolated)}
      stroke={getNodeStroke(node, isIsolated, isSelected)}
      strokeWidth={isSelected ? 2.5 : 1.5}
    />

    <circle cx={node.x} cy={node.y} r="8" fill={node.compromised ? '#e11d48' : '#0284c7'} />

    <text
      x={node.x}
      y={node.y + LABEL_OFFSET_Y}
      textAnchor="middle"
      fill={isSelected ? '#f1f5f9' : '#cbd5e1'}
      fontSize="11"
      fontWeight="600"
      fontFamily="sans-serif"
    >
      {node.label}
    </text>

    <text
      x={node.x}
      y={node.y + SUBLABEL_OFFSET_Y}
      textAnchor="middle"
      fill="#64748b"
      fontSize="9"
      fontFamily="monospace"
    >
      {node.sublabel}
    </text>
  </g>
);
