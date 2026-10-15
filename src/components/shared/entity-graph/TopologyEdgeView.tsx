import type { FC } from 'react';
import type { TopologyEdge, TopologyNode } from './entity-graph.types';
import { getEdgeMarker, getEdgeStrokeColor } from './entity-graph.utils';

const LABEL_WIDTH = 80;
const LABEL_HEIGHT = 18;
const LABEL_TEXT_BASELINE_OFFSET = 3;

interface TopologyEdgeViewProps {
  edge: TopologyEdge;
  source: TopologyNode;
  target: TopologyNode;
  isHighlighted: boolean;
}

export const TopologyEdgeView: FC<TopologyEdgeViewProps> = ({ edge, source, target, isHighlighted }) => {
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2;

  return (
    <g>
      <line
        x1={source.x}
        y1={source.y}
        x2={target.x}
        y2={target.y}
        stroke={getEdgeStrokeColor(edge.severity)}
        strokeWidth={isHighlighted ? 2.5 : 1.5}
        strokeDasharray={edge.severity === 'CRITICAL' ? '4 2' : undefined}
        markerEnd={getEdgeMarker(edge.severity)}
        opacity={isHighlighted ? 1 : 0.6}
      />

      <rect
        x={midX - LABEL_WIDTH / 2}
        y={midY - LABEL_HEIGHT / 2}
        width={LABEL_WIDTH}
        height={LABEL_HEIGHT}
        rx="3"
        fill="#080c14"
        stroke="#1e293b"
      />
      <text
        x={midX}
        y={midY + LABEL_TEXT_BASELINE_OFFSET}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="9"
        fontFamily="monospace"
      >
        {edge.protocol.split(' ')[0]}
      </text>
    </g>
  );
};
