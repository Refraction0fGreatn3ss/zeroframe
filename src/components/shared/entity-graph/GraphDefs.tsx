import type { FC } from 'react';

const ArrowheadMarker: FC<{ id: string; color: string }> = ({ id, color }) => (
  <marker id={id} markerWidth="8" markerHeight="6" refX="24" refY="3" orient="auto">
    <polygon points="0 0, 8 3, 0 6" fill={color} />
  </marker>
);

export const GraphDefs: FC = () => (
  <defs>
    <linearGradient id="edge-critical" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
    </linearGradient>
    <linearGradient id="edge-suspicious" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
    </linearGradient>
    <ArrowheadMarker id="arrowhead-red" color="#f43f5e" />
    <ArrowheadMarker id="arrowhead-amber" color="#f59e0b" />
  </defs>
);
