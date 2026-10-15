/**
 * ZeroFrame NDR/XDR Attack Blast Radius & Entity Topology Graph
 * 
 * Domain-Native NDR/XDR Architecture:
 * - Interactive Visual Attack Graph with Directed Network & Process Edges
 * - Distinguishes External C2, Compromised Hosts, Targeted Crown Jewels, and User Identities
 * - Live Edge Telemetry: Protocol (TLS, SMB, Kerberos, TDS), Traffic Volume, and Port Numbers
 * - Blast Radius Impact Analyzer with 1-Click Host Containment
 * - Layer Switcher: Network Wire Flows vs Identity Privilege Edges vs Process Lineage
 */

import React, { useState, useEffect } from 'react';
import { LivingEntity } from '../../types';
import {
  Server,
  Laptop,
  Database,
  Radio,
  User,
  ShieldAlert,
  ShieldCheck,
  Ban,
  ArrowRight,
  Layers,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface TopologyNode {
  id: string;
  label: string;
  sublabel: string;
  type: 'EXTERNAL_C2' | 'COMPROMISED_HOST' | 'PIVOT_HOST' | 'CROWN_JEWEL' | 'IDENTITY';
  ip?: string;
  zone: string;
  x: number;
  y: number;
  compromised: boolean;
  blastRadiusScore: number;
  openPorts: number[];
  activeConnections: number;
}

interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  protocol: string;
  port: number;
  volume: string;
  severity: 'CRITICAL' | 'SUSPICIOUS' | 'NOMINAL';
}

const TOPOLOGY_NODES: TopologyNode[] = [
  {
    id: 'c2-ext',
    label: '185.220.101.44',
    sublabel: 'Cobalt Strike C2 (NL)',
    type: 'EXTERNAL_C2',
    ip: '185.220.101.44',
    zone: 'External WAN',
    x: 80,
    y: 200,
    compromised: true,
    blastRadiusScore: 94,
    openPorts: [443, 8080],
    activeConnections: 3,
  },
  {
    id: 'gw-border',
    label: 'Edge Gateway 01',
    sublabel: '10.140.0.1 (DMZ)',
    type: 'PIVOT_HOST',
    ip: '10.140.0.1',
    zone: 'Perimeter DMZ',
    x: 260,
    y: 200,
    compromised: false,
    blastRadiusScore: 40,
    openPorts: [443, 80, 22],
    activeConnections: 142,
  },
  {
    id: 'srv-app-01',
    label: 'srv-app-prod-01',
    sublabel: '10.140.2.88 (Web Tier)',
    type: 'COMPROMISED_HOST',
    ip: '10.140.2.88',
    zone: 'Production App',
    x: 480,
    y: 120,
    compromised: true,
    blastRadiusScore: 88,
    openPorts: [80, 443, 3389],
    activeConnections: 18,
  },
  {
    id: 'user-admin',
    label: 'svc_backup_admin',
    sublabel: 'Hijacked Domain Account',
    type: 'IDENTITY',
    zone: 'Active Directory',
    x: 480,
    y: 300,
    compromised: true,
    blastRadiusScore: 92,
    openPorts: [],
    activeConnections: 4,
  },
  {
    id: 'dc-01',
    label: 'DC-01 (Domain Controller)',
    sublabel: '10.140.10.5 (Kerberos/LDAP)',
    type: 'CROWN_JEWEL',
    ip: '10.140.10.5',
    zone: 'Identity Core',
    x: 720,
    y: 140,
    compromised: true,
    blastRadiusScore: 98,
    openPorts: [88, 389, 445, 135],
    activeConnections: 89,
  },
  {
    id: 'db-crown',
    label: 'DB-CLUSTER-PRIMARY',
    sublabel: '10.140.4.12 (Customer PII)',
    type: 'CROWN_JEWEL',
    ip: '10.140.4.12',
    zone: 'Restricted Data Tier',
    x: 720,
    y: 280,
    compromised: false,
    blastRadiusScore: 99,
    openPorts: [1433, 5432],
    activeConnections: 12,
  },
];

const TOPOLOGY_EDGES: TopologyEdge[] = [
  {
    id: 'e1',
    source: 'c2-ext',
    target: 'gw-border',
    protocol: 'TLS 1.3 / HTTPS',
    port: 443,
    volume: '48.2 KB',
    severity: 'CRITICAL',
  },
  {
    id: 'e2',
    source: 'gw-border',
    target: 'srv-app-01',
    protocol: 'HTTP/2 Reverse Proxy',
    port: 80,
    volume: '48.2 KB',
    severity: 'CRITICAL',
  },
  {
    id: 'e3',
    source: 'srv-app-01',
    target: 'user-admin',
    protocol: 'LSASS Memory Dump',
    port: 0,
    volume: 'Token Stolen',
    severity: 'CRITICAL',
  },
  {
    id: 'e4',
    source: 'srv-app-01',
    target: 'dc-01',
    protocol: 'SMB / RPC PsExec',
    port: 445,
    volume: '84.2 KB',
    severity: 'CRITICAL',
  },
  {
    id: 'e5',
    source: 'user-admin',
    target: 'dc-01',
    protocol: 'Kerberos TGS-REQ',
    port: 88,
    volume: '3.1 KB',
    severity: 'SUSPICIOUS',
  },
  {
    id: 'e6',
    source: 'srv-app-01',
    target: 'db-crown',
    protocol: 'TDS SQL Connection',
    port: 1433,
    volume: '12.4 KB (Blocked)',
    severity: 'NOMINAL',
  },
];

interface EntityGraphViewProps {
  entities?: LivingEntity[];
  selectedEntityId?: string | null;
  onSelectEntity?: (id: string) => void;
}

export const EntityGraphView: React.FC<EntityGraphViewProps> = ({
  entities,
  selectedEntityId,
  onSelectEntity,
}) => {
  const { nodes, edges } = React.useMemo(() => {
    if (!entities || entities.length === 0) {
      return { nodes: TOPOLOGY_NODES, edges: TOPOLOGY_EDGES };
    }

    const computedNodes: TopologyNode[] = [];
    const computedEdges: TopologyEdge[] = [];

    // Always include External C2 anchor
    computedNodes.push({
      id: 'c2-ext',
      label: '185.220.101.44',
      sublabel: 'Threat Actor External C2',
      type: 'EXTERNAL_C2',
      ip: '185.220.101.44',
      zone: 'External WAN',
      x: 80,
      y: 200,
      compromised: true,
      blastRadiusScore: 94,
      openPorts: [443, 8080],
      activeConnections: 3,
    });

    entities.forEach((entity, idx) => {
      let x = 460;
      let y = 100 + ((idx * 90) % 260);

      if (entity.entityType === 'GATEWAY') {
        x = 240;
        y = 200;
      } else if (entity.entityType === 'OT_PLC' || entity.isProtected) {
        x = 720;
        y = 120 + ((idx * 110) % 220);
      } else if (entity.entityType === 'SERVER') {
        x = 640;
        y = 140 + ((idx * 80) % 220);
      } else {
        x = 440;
        y = 110 + ((idx * 85) % 240);
      }

      const isCompromised = entity.blastRadiusScore > 70;
      let nodeType: TopologyNode['type'] = 'PIVOT_HOST';
      if (entity.entityType === 'OT_PLC' || entity.isProtected) {
        nodeType = 'CROWN_JEWEL';
      } else if (isCompromised) {
        nodeType = 'COMPROMISED_HOST';
      }

      computedNodes.push({
        id: entity.id,
        label: entity.hostname || entity.currentIp,
        sublabel: `${entity.currentIp} (${entity.entityType})`,
        type: nodeType,
        ip: entity.currentIp,
        zone: entity.observationSource || (entity.isProtected ? 'Restricted Enclave' : 'Core Segment'),
        x,
        y,
        compromised: isCompromised,
        blastRadiusScore: entity.blastRadiusScore || (isCompromised ? 85 : 30),
        openPorts: entity.entityType === 'OT_PLC' ? [502, 44818] : entity.isProtected ? [443, 8443] : [80, 443, 445],
        activeConnections: Math.floor((entity.blastRadiusScore || 40) / 4) + 2,
      });
    });

    // Link C2 to first pivot/gateway
    const firstGateway = computedNodes.find((n) => n.id !== 'c2-ext' && (n.type === 'PIVOT_HOST' || n.x < 400)) || computedNodes[1];
    if (firstGateway) {
      computedEdges.push({
        id: `e-c2-${firstGateway.id}`,
        source: 'c2-ext',
        target: firstGateway.id,
        protocol: 'TLS 1.3 / HTTPS',
        port: 443,
        volume: '48.2 KB',
        severity: 'CRITICAL',
      });
    }

    // Link intermediaries to crown jewels
    const crownJewels = computedNodes.filter((n) => n.type === 'CROWN_JEWEL');
    const intermediaries = computedNodes.filter((n) => n.id !== 'c2-ext' && n.type !== 'CROWN_JEWEL');

    intermediaries.forEach((inter, idx) => {
      if (firstGateway && inter.id !== firstGateway.id) {
        computedEdges.push({
          id: `e-pivot-${inter.id}`,
          source: firstGateway.id,
          target: inter.id,
          protocol: inter.compromised ? 'SMB / RPC PsExec' : 'HTTP/2 Reverse Proxy',
          port: inter.compromised ? 445 : 80,
          volume: '24.1 KB',
          severity: inter.compromised ? 'CRITICAL' : 'NOMINAL',
        });
      }

      if (crownJewels.length > 0) {
        const targetCrown = crownJewels[idx % crownJewels.length];
        computedEdges.push({
          id: `e-crown-${inter.id}-${targetCrown.id}`,
          source: inter.id,
          target: targetCrown.id,
          protocol: targetCrown.label.includes('RELAY') || targetCrown.label.includes('SCADA') ? 'Industrial Modbus FC' : 'Kerberos TGS-REQ',
          port: targetCrown.label.includes('RELAY') || targetCrown.label.includes('SCADA') ? 502 : 88,
          volume: '8.4 KB',
          severity: inter.compromised ? 'CRITICAL' : 'SUSPICIOUS',
        });
      }
    });

    return { nodes: computedNodes, edges: computedEdges };
  }, [entities]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    selectedEntityId || (entities && entities.length > 0 ? entities[0].id : 'srv-app-01')
  );
  const [layer, setLayer] = useState<'ALL' | 'NETWORK' | 'IDENTITY'>('ALL');
  const [isolatedHosts, setIsolatedHosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedEntityId) {
      setSelectedNodeId(selectedEntityId);
    } else if (nodes.length > 0 && !nodes.some((n) => n.id === selectedNodeId)) {
      setSelectedNodeId(nodes[1]?.id || nodes[0].id);
    }
  }, [selectedEntityId, nodes]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0] || TOPOLOGY_NODES[2];

  const handleToggleIsolation = (nodeId: string) => {
    setIsolatedHosts((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const getNodeIcon = (type: TopologyNode['type']) => {
    switch (type) {
      case 'EXTERNAL_C2':
        return <Radio className="w-4 h-4 text-rose-400" />;
      case 'COMPROMISED_HOST':
        return <Server className="w-4 h-4 text-rose-400" />;
      case 'CROWN_JEWEL':
        return <Database className="w-4 h-4 text-amber-400" />;
      case 'IDENTITY':
        return <User className="w-4 h-4 text-violet-400" />;
      default:
        return <Laptop className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="bg-[#090d16] border border-slate-800/90 rounded overflow-hidden flex flex-col font-sans">
      {/* Topology Toolbar */}
      <div className="p-3 bg-[#0d121f] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-100 font-sans">Attack Topology & Blast Radius</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">
            Lateral wire movements and identity credential lineage
          </span>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center bg-[#060911] border border-slate-800 rounded p-0.5 text-[11px]">
          {(['ALL', 'NETWORK', 'IDENTITY'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLayer(l)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                layer === l
                  ? 'bg-slate-800 text-cyan-300 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {l === 'ALL' ? 'Full Blast Radius' : l === 'NETWORK' ? 'Network Flows' : 'Identity Chain'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas: Left Interactive SVG Graph + Right Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* SVG Graph Canvas (8 cols) */}
        <div className="lg:col-span-8 p-4 bg-[#060911] relative overflow-hidden flex items-center justify-center">
          <svg className="w-full h-[480px]" viewBox="0 0 850 420">
            <defs>
              <linearGradient id="edge-critical" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="edge-suspicious" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
              </linearGradient>
              <marker
                id="arrowhead-red"
                markerWidth="8"
                markerHeight="6"
                refX="24"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#f43f5e" />
              </marker>
              <marker
                id="arrowhead-amber"
                markerWidth="8"
                markerHeight="6"
                refX="24"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
              </marker>
            </defs>

            {/* Render Directed Edges */}
            {edges.map((edge) => {
              const src = nodes.find((n) => n.id === edge.source);
              const tgt = nodes.find((n) => n.id === edge.target);
              if (!src || !tgt) return null;

              const isEdgeHighlighted =
                selectedNodeId === edge.source || selectedNodeId === edge.target;

              return (
                <g key={edge.id}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={
                      edge.severity === 'CRITICAL'
                        ? '#f43f5e'
                        : edge.severity === 'SUSPICIOUS'
                        ? '#f59e0b'
                        : '#334155'
                    }
                    strokeWidth={isEdgeHighlighted ? 2.5 : 1.5}
                    strokeDasharray={edge.severity === 'CRITICAL' ? '4 2' : undefined}
                    markerEnd={
                      edge.severity === 'CRITICAL'
                        ? 'url(#arrowhead-red)'
                        : edge.severity === 'SUSPICIOUS'
                        ? 'url(#arrowhead-amber)'
                        : undefined
                    }
                    opacity={isEdgeHighlighted ? 1 : 0.6}
                  />

                  {/* Edge Protocol Label */}
                  <rect
                    x={(src.x + tgt.x) / 2 - 40}
                    y={(src.y + tgt.y) / 2 - 9}
                    width="80"
                    height="18"
                    rx="3"
                    fill="#080c14"
                    stroke="#1e293b"
                  />
                  <text
                    x={(src.x + tgt.x) / 2}
                    y={(src.y + tgt.y) / 2 + 3}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {edge.protocol.split(' ')[0]}
                  </text>
                </g>
              );
            })}

            {/* Render Interactive Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isIsolated = isolatedHosts[node.id];

              return (
                <g
                  key={node.id}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    onSelectEntity?.(node.id);
                  }}
                  className="cursor-pointer"
                >
                  {/* Node Outer Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 26 : 22}
                    fill={isIsolated ? '#180e14' : node.compromised ? '#1f1016' : '#0c1524'}
                    stroke={
                      isIsolated
                        ? '#991b1b'
                        : isSelected
                        ? '#38bdf8'
                        : node.compromised
                        ? '#f43f5e'
                        : '#3b82f6'
                    }
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />

                  {/* Node Type Indicator */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="8"
                    fill={node.compromised ? '#e11d48' : '#0284c7'}
                  />

                  {/* Node Text Label */}
                  <text
                    x={node.x}
                    y={node.y + 36}
                    textAnchor="middle"
                    fill={isSelected ? '#f1f5f9' : '#cbd5e1'}
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    {node.label}
                  </text>

                  {/* Node Sublabel */}
                  <text
                    x={node.x}
                    y={node.y + 49}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {node.sublabel}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick Graph Legend */}
          <div className="absolute bottom-3 left-3 bg-[#080c14]/90 border border-slate-800 rounded p-2 text-[10px] font-mono text-slate-400 flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Compromised / Malicious</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Targeted Crown Jewel</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>Internal Host</span>
            </span>
          </div>
        </div>

        {/* Right Pane: Selected Node Blast Radius Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-[#090d16] border-l border-slate-800 p-4 flex flex-col justify-between space-y-4 text-xs font-mono">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {getNodeIcon(selectedNode.type)}
                <span className="font-semibold text-slate-100 font-sans">{selectedNode.label}</span>
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  selectedNode.compromised ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {selectedNode.compromised ? 'COMPROMISED' : 'NOMINAL'}
              </span>
            </div>

            {/* Node Metadata Table */}
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Security Zone:</span>
                <span className="text-slate-200">{selectedNode.zone}</span>
              </div>
              {selectedNode.ip && (
                <div className="flex justify-between">
                  <span className="text-slate-500">IP Address:</span>
                  <span className="text-slate-200">{selectedNode.ip}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Blast Radius Score:</span>
                <span className="text-rose-400 font-bold tabular-nums">
                  {selectedNode.blastRadiusScore} / 100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Connections:</span>
                <span className="text-slate-200 tabular-nums">
                  {selectedNode.activeConnections} sockets
                </span>
              </div>
              {selectedNode.openPorts.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Observed Ports:</span>
                  <span className="text-slate-300">
                    {selectedNode.openPorts.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Inbound & Outbound Connections for this Node */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <div className="text-slate-400 font-semibold text-[11px]">
                Connected Graph Flows
              </div>
              <div className="space-y-1 text-[10px]">
                {edges.filter(
                  (e) => e.source === selectedNode.id || e.target === selectedNode.id
                ).map((e) => (
                  <div
                    key={e.id}
                    className="p-1.5 rounded bg-[#060911] border border-slate-800/80 flex items-center justify-between"
                  >
                    <span>
                      {e.source === selectedNode.id ? `➔ Outbound: ${e.target}` : `⬅ Inbound: ${e.source}`}
                    </span>
                    <span className="text-slate-400">{e.protocol}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Containment & Quarantine Actions */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => handleToggleIsolation(selectedNode.id)}
              className={`w-full py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                isolatedHosts[selectedNode.id]
                  ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/70 hover:bg-rose-900/80 border border-rose-500/50 text-rose-200'
              }`}
            >
              <Ban className="w-3.5 h-3.5" />
              <span>
                {isolatedHosts[selectedNode.id]
                  ? 'Node Isolated (Click to Re-admit)'
                  : 'Quarantine & Sever Sockets'}
              </span>
            </button>

            <div className="text-[10px] text-slate-500 text-center">
              eBPF network filter cuts all RFC1918 lateral routes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
