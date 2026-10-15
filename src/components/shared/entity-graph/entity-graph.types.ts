export type TopologyNodeType = 'EXTERNAL_C2' | 'COMPROMISED_HOST' | 'PIVOT_HOST' | 'CROWN_JEWEL' | 'IDENTITY';

export type TopologyEdgeSeverity = 'CRITICAL' | 'SUSPICIOUS' | 'NOMINAL';

export type GraphLayer = 'ALL' | 'NETWORK' | 'IDENTITY';

export interface TopologyNode {
  id: string;
  label: string;
  sublabel: string;
  type: TopologyNodeType;
  ip?: string;
  zone: string;
  x: number;
  y: number;
  compromised: boolean;
  blastRadiusScore: number;
  openPorts: number[];
  activeConnections: number;
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  protocol: string;
  port: number;
  volume: string;
  severity: TopologyEdgeSeverity;
}

export interface Topology {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
}
