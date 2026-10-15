import type { LivingEntity } from '../../../types';
import {
  createExternalC2Node,
  DEMO_TOPOLOGY_EDGES,
  DEMO_TOPOLOGY_NODES,
  EXTERNAL_C2_NODE_ID,
} from './entity-graph.data';
import type {
  Topology,
  TopologyEdge,
  TopologyEdgeSeverity,
  TopologyNode,
  TopologyNodeType,
} from './entity-graph.types';

const COMPROMISED_BLAST_RADIUS_THRESHOLD = 70;
const DEFAULT_COMPROMISED_BLAST_RADIUS = 85;
const DEFAULT_NOMINAL_BLAST_RADIUS = 30;
const DEFAULT_CONNECTION_BLAST_RADIUS = 40;
const GATEWAY_LANE_MAX_X = 400;

interface LanePosition {
  x: number;
  baseY: number;
  stepY: number;
  spanY: number;
}

const GATEWAY_POSITION = { x: 240, y: 200 };
const PROTECTED_LANE: LanePosition = { x: 720, baseY: 120, stepY: 110, spanY: 220 };
const SERVER_LANE: LanePosition = { x: 640, baseY: 140, stepY: 80, spanY: 220 };
const DEFAULT_LANE: LanePosition = { x: 440, baseY: 110, stepY: 85, spanY: 240 };

const isProtectedEntity = (entity: LivingEntity): boolean => entity.entityType === 'OT_PLC' || entity.isProtected;

const placeInLane = (lane: LanePosition, index: number) => ({
  x: lane.x,
  y: lane.baseY + ((index * lane.stepY) % lane.spanY),
});

const computeEntityPosition = (entity: LivingEntity, index: number): { x: number; y: number } => {
  if (entity.entityType === 'GATEWAY') return GATEWAY_POSITION;
  if (isProtectedEntity(entity)) return placeInLane(PROTECTED_LANE, index);
  if (entity.entityType === 'SERVER') return placeInLane(SERVER_LANE, index);
  return placeInLane(DEFAULT_LANE, index);
};

const getEntityOpenPorts = (entity: LivingEntity): number[] => {
  if (entity.entityType === 'OT_PLC') return [502, 44818];
  if (entity.isProtected) return [443, 8443];
  return [80, 443, 445];
};

const entityToNode = (entity: LivingEntity, index: number): TopologyNode => {
  const isCompromised = entity.blastRadiusScore > COMPROMISED_BLAST_RADIUS_THRESHOLD;

  let nodeType: TopologyNodeType = 'PIVOT_HOST';
  if (isProtectedEntity(entity)) {
    nodeType = 'CROWN_JEWEL';
  } else if (isCompromised) {
    nodeType = 'COMPROMISED_HOST';
  }

  return {
    id: entity.id,
    label: entity.hostname || entity.currentIp,
    sublabel: `${entity.currentIp} (${entity.entityType})`,
    type: nodeType,
    ip: entity.currentIp,
    zone: entity.observationSource || (entity.isProtected ? 'Restricted Enclave' : 'Core Segment'),
    ...computeEntityPosition(entity, index),
    compromised: isCompromised,
    blastRadiusScore:
      entity.blastRadiusScore || (isCompromised ? DEFAULT_COMPROMISED_BLAST_RADIUS : DEFAULT_NOMINAL_BLAST_RADIUS),
    openPorts: getEntityOpenPorts(entity),
    activeConnections: Math.floor((entity.blastRadiusScore || DEFAULT_CONNECTION_BLAST_RADIUS) / 4) + 2,
  };
};

const isIndustrialTarget = (node: TopologyNode): boolean =>
  node.label.includes('RELAY') || node.label.includes('SCADA');

const linkIntermediaries = (nodes: TopologyNode[], gateway: TopologyNode | undefined): TopologyEdge[] => {
  const edges: TopologyEdge[] = [];
  const crownJewels = nodes.filter((n) => n.type === 'CROWN_JEWEL');
  const intermediaries = nodes.filter((n) => n.id !== EXTERNAL_C2_NODE_ID && n.type !== 'CROWN_JEWEL');

  intermediaries.forEach((inter, idx) => {
    if (gateway && inter.id !== gateway.id) {
      edges.push({
        id: `e-pivot-${inter.id}`,
        source: gateway.id,
        target: inter.id,
        protocol: inter.compromised ? 'SMB / RPC PsExec' : 'HTTP/2 Reverse Proxy',
        port: inter.compromised ? 445 : 80,
        volume: '24.1 KB',
        severity: inter.compromised ? 'CRITICAL' : 'NOMINAL',
      });
    }

    if (crownJewels.length > 0) {
      const targetCrown = crownJewels[idx % crownJewels.length];
      const industrial = isIndustrialTarget(targetCrown);
      edges.push({
        id: `e-crown-${inter.id}-${targetCrown.id}`,
        source: inter.id,
        target: targetCrown.id,
        protocol: industrial ? 'Industrial Modbus FC' : 'Kerberos TGS-REQ',
        port: industrial ? 502 : 88,
        volume: '8.4 KB',
        severity: inter.compromised ? 'CRITICAL' : 'SUSPICIOUS',
      });
    }
  });

  return edges;
};

/** Derives an attack topology from live entities, falling back to the demo graph when none exist. */
export const buildTopology = (entities: LivingEntity[] | undefined): Topology => {
  if (!entities || entities.length === 0) {
    return { nodes: DEMO_TOPOLOGY_NODES, edges: DEMO_TOPOLOGY_EDGES };
  }

  const nodes: TopologyNode[] = [createExternalC2Node('Threat Actor External C2'), ...entities.map(entityToNode)];
  const edges: TopologyEdge[] = [];

  const firstGateway =
    nodes.find((n) => n.id !== EXTERNAL_C2_NODE_ID && (n.type === 'PIVOT_HOST' || n.x < GATEWAY_LANE_MAX_X)) ||
    nodes[1];

  if (firstGateway) {
    edges.push({
      id: `e-c2-${firstGateway.id}`,
      source: EXTERNAL_C2_NODE_ID,
      target: firstGateway.id,
      protocol: 'TLS 1.3 / HTTPS',
      port: 443,
      volume: '48.2 KB',
      severity: 'CRITICAL',
    });
  }

  edges.push(...linkIntermediaries(nodes, firstGateway));

  return { nodes, edges };
};

export const findNode = (nodes: TopologyNode[], id: string): TopologyNode | undefined => nodes.find((n) => n.id === id);

export const getEdgeStrokeColor = (severity: TopologyEdgeSeverity): string => {
  if (severity === 'CRITICAL') return '#f43f5e';
  if (severity === 'SUSPICIOUS') return '#f59e0b';
  return '#334155';
};

export const getEdgeMarker = (severity: TopologyEdgeSeverity): string | undefined => {
  if (severity === 'CRITICAL') return 'url(#arrowhead-red)';
  if (severity === 'SUSPICIOUS') return 'url(#arrowhead-amber)';
  return undefined;
};

export const getNodeFill = (node: TopologyNode, isIsolated: boolean): string => {
  if (isIsolated) return '#180e14';
  return node.compromised ? '#1f1016' : '#0c1524';
};

export const getNodeStroke = (node: TopologyNode, isIsolated: boolean, isSelected: boolean): string => {
  if (isIsolated) return '#991b1b';
  if (isSelected) return '#38bdf8';
  return node.compromised ? '#f43f5e' : '#3b82f6';
};

export const isEdgeConnectedTo = (edge: TopologyEdge, nodeId: string): boolean =>
  edge.source === nodeId || edge.target === nodeId;
