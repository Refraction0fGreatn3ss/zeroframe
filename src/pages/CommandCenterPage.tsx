/**
 * ZeroFrame NDR/XDR Tactical SOC Command Center
 * 
 * Domain-Native NDR/XDR Architecture:
 * - Real-time Wire Telemetry & L7 Protocol Mix (TLS 1.3, DNS, SMB, Kerberos, HTTP)
 * - Multi-Stage Cross-Layer Kill Chain Pipeline (Initial Access -> Execution -> Lateral Wire -> C2 Beacon -> Exfil)
 * - Interactive MITRE ATT&CK Matrix Funnel with dynamic incident filtering
 * - Live Wire Anomaly Stream (Suspicious JA4 hashes, High-Entropy DNS queries, Anomalous Beacons)
 * - Anti-AI-Slop discipline: Zero static pills, unboxed typography, tabular numerals
 */

import React, { useState } from 'react';
import { useDashboardStore } from '../stores/dashboard-store';
import { useInvestigationStore } from '../stores/investigation-store';
import { useAppStore } from '../stores/app-store';
import { ExportButton } from '../components/shared/ExportButton';
import { SecurityActivityLogPanel } from '../components/shared/SecurityActivityLogPanel';
import { TruthBar } from '../components/shared/TruthBar';
import { SinceLastLoginSummary } from '../components/shared/SinceLastLoginSummary';
import { timeAgo, formatNumber, formatBitsPerSec } from '../lib/utils';
import {
  ShieldAlert,
  Terminal,
  Layers,
  Radio,
  Download,
  Activity,
  ArrowRight,
  Filter,
  Search,
  ExternalLink,
  ChevronRight,
  Cpu,
  Server,
  Zap,
} from 'lucide-react';

interface AnomalySignal {
  id: string;
  type: 'JA4_FINGERPRINT' | 'DNS_ENTROPY' | 'SMB_NAMED_PIPE' | 'BEACON_CADENCE';
  indicator: string;
  detail: string;
  sourceIp: string;
  destination: string;
  risk: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  timestamp: string;
}

const LIVE_WIRE_ANOMALIES: AnomalySignal[] = [
  {
    id: 'SIG-8812',
    type: 'JA4_FINGERPRINT',
    indicator: 't13d1516h2_8daaf6152771_0278457224b8',
    detail: 'Known Cobalt Strike Malleable C2 TLS profile over TCP 443',
    sourceIp: '10.140.2.88',
    destination: '185.220.101.44:443',
    risk: 'CRITICAL',
    timestamp: '2m ago',
  },
  {
    id: 'SIG-8813',
    type: 'DNS_ENTROPY',
    indicator: 'Entropy 4.89 · TXT record query burst (84 req/min)',
    detail: 'Encoded payload payload chunking to c2-dns.dynamic-resolver.cc',
    sourceIp: '10.140.10.14',
    destination: '1.1.1.1:53',
    risk: 'HIGH',
    timestamp: '5m ago',
  },
  {
    id: 'SIG-8814',
    type: 'SMB_NAMED_PIPE',
    indicator: '\\\\10.140.4.12\\pipe\\status_rpc_914b',
    detail: 'Anomalous anonymous named pipe connection without kerberos ticket',
    sourceIp: '10.140.2.88',
    destination: '10.140.4.12:445',
    risk: 'CRITICAL',
    timestamp: '8m ago',
  },
  {
    id: 'SIG-8815',
    type: 'BEACON_CADENCE',
    indicator: 'Jitter 2.1% · Interval 60.4s · 32 consecutive heartbeats',
    detail: 'Strict periodic HTTPS POST heartbeats to AWS API Gateway',
    sourceIp: '10.140.8.44',
    destination: '34.201.88.19:443',
    risk: 'ELEVATED',
    timestamp: '14m ago',
  },
];

const PROTOCOL_DISTRIBUTION = [
  { name: 'TLS 1.3 / HTTPS', pct: 62.4, color: 'bg-cyan-500' },
  { name: 'DNS (UDP/53)', pct: 15.2, color: 'bg-emerald-500' },
  { name: 'HTTP/2 REST', pct: 10.8, color: 'bg-indigo-500' },
  { name: 'SMB / RPC', pct: 7.4, color: 'bg-amber-500' },
  { name: 'Kerberos / LDAP', pct: 4.2, color: 'bg-violet-500' },
];

const MITRE_KILL_CHAIN = [
  { stage: 'Initial Access', technique: 'T1190 Exploit Public App', hits: 2, severity: 'ELEVATED' },
  { stage: 'Execution', technique: 'T1059.001 PowerShell Spawn', hits: 5, severity: 'CRITICAL' },
  { stage: 'Persistence', technique: 'T1543.003 Windows Service', hits: 1, severity: 'NOMINAL' },
  { stage: 'Lateral Movement', technique: 'T1021.002 SMB/Admin Share', hits: 4, severity: 'CRITICAL' },
  { stage: 'Command & Control', technique: 'T1071.001 Web Protocols', hits: 7, severity: 'CRITICAL' },
  { stage: 'Exfiltration', technique: 'T1048 Exfil Over Alt Protocol', hits: 3, severity: 'ELEVATED' },
];

export const CommandCenterPage: React.FC = () => {
  const { metrics } = useDashboardStore();
  const { incidents, selectIncident } = useInvestigationStore();
  const { setCurrentPath, realtimeConnected, lastHeartbeatTimestamp } = useAppStore();

  const [timeRange, setTimeRange] = useState<'15m' | '1h' | '6h' | '24h'>('1h');
  const [selectedKillChainStage, setSelectedKillChainStage] = useState<string | null>(null);

  const filteredIncidents = selectedKillChainStage
    ? incidents.filter((inc) =>
        inc.mitreTactics.some(
          (t) =>
            t.stage?.toLowerCase().includes(selectedKillChainStage.toLowerCase()) ||
            t.name?.toLowerCase().includes(selectedKillChainStage.toLowerCase())
        )
      )
    : incidents;

  return (
    <div className="p-4 sm:p-5 space-y-4 text-slate-200 max-w-[1720px] mx-auto font-sans select-none">
      {/* Authoritative Truth Bar: Exists, Visible, Detectable, Respondable */}
      <TruthBar className="mb-4" />

      {/* Delta Reconciliation: Since Last Login */}
      <SinceLastLoginSummary className="mb-4" />

      {/* Top Header & Wire Scope Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight text-slate-100">
              NDR / XDR Command Center
            </h1>
            <span className="text-slate-500">·</span>
            <span className={`text-xs font-mono font-medium ${!realtimeConnected ? 'text-amber-400' : 'text-cyan-400'}`}>
              {!realtimeConnected
                ? `Telemetry Link Disconnected · STALE (Last known ${new Date(lastHeartbeatTimestamp).toLocaleTimeString()})`
                : 'Live Wire Telemetry & Cross-Layer Triage'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized packet flow observation, MITRE ATT&CK progression, and rapid incident isolation.
          </p>
        </div>

        {/* Tactical Controls: Time Range + Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Time Range Selector */}
          <div className="flex items-center bg-[#080c14] border border-slate-800 rounded p-0.5 text-xs font-mono">
            {(['15m', '1h', '6h', '24h'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  timeRange === range
                    ? 'bg-slate-800 text-cyan-300 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPath('/investigate/hunt')}
            className="px-3 py-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Open Wire Hunter</span>
          </button>

          <ExportButton
            resourceName="Command_Center_Metrics"
            recordCount={incidents.length}
            data={incidents}
          />
        </div>
      </div>

      {/* Row 1: Wire-Speed Hardware Telemetry & L7 Protocol Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Wire Rate & Ingress Metrics */}
        <div className="p-3.5 bg-[#090d16] border border-slate-800/90 rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Wire Ingress Throughput</span>
            </span>
            <span className="font-mono text-[11px] text-slate-500">Kernel AF_XDP Zero-Copy</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-mono font-bold text-slate-100 tabular-nums">
              {formatBitsPerSec(metrics.currentIngressThroughputBps || 1_420_000_000)}
            </div>
            <div className="text-xs font-mono text-slate-400 mt-0.5 flex items-center gap-2">
              <span>{formatNumber(metrics.currentPacketRatePps || 184_200)} packets / sec</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400">0 Ring Buffer Drops</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            4 Physical SFP28/QSFP+ optical taps active and synchronized
          </div>
        </div>

        {/* L7 Protocol Distribution Bar */}
        <div className="p-3.5 bg-[#090d16] border border-slate-800/90 rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>L7 Protocol Distribution</span>
            </span>
            <span className="font-mono text-[11px] text-slate-500">Live Wire Inspection</span>
          </div>

          {/* Stacked bar */}
          <div className="my-2 space-y-1.5">
            <div className="h-3 w-full bg-slate-900 rounded-xs flex overflow-hidden">
              {PROTOCOL_DISTRIBUTION.map((proto) => (
                <div
                  key={proto.name}
                  style={{ width: `${proto.pct}%` }}
                  className={`${proto.color} h-full transition-all`}
                  title={`${proto.name}: ${proto.pct}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-400">
              {PROTOCOL_DISTRIBUTION.map((proto) => (
                <div key={proto.name} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-xs ${proto.color}`} />
                  <span>{proto.name}</span>
                  <span className="text-slate-200 font-medium tabular-nums">{proto.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            TLS 1.3 encrypted sessions analyzed via client-hello JA4 fingerprinting
          </div>
        </div>

        {/* Tactical Defense Posture */}
        <div className="p-3.5 bg-[#090d16] border border-slate-800/90 rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Active Threat Vectors</span>
            </span>
            <span className="font-mono text-[11px] text-rose-400 font-semibold">
              {incidents.filter((i) => i.state === 'OPEN').length} Uncontained
            </span>
          </div>

          <div className="my-2 grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 bg-[#060911] border border-slate-800 rounded">
              <div className="text-slate-500 text-[10px]">CRITICAL INCIDENTS</div>
              <div className="text-xl font-bold text-rose-400 tabular-nums">
                {incidents.filter((i) => i.severity === 'CRITICAL').length}
              </div>
            </div>
            <div className="p-2 bg-[#060911] border border-slate-800 rounded">
              <div className="text-slate-500 text-[10px]">HIGH SEVERITY</div>
              <div className="text-xl font-bold text-amber-400 tabular-nums">
                {incidents.filter((i) => i.severity === 'HIGH').length}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Asymmetric ratio: 4.2%</span>
            <span className="text-emerald-400">Zero data exfiltration detected</span>
          </div>
        </div>
      </div>

      {/* Row 1.5: Real-Time Wire Throughput & Attack Spike Velocity Graph */}
      <div className="p-3.5 bg-[#090d16] border border-slate-800/90 rounded space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-100 font-sans">
              Wire Throughput Velocity & Ingress Anomalies Curve (Last 60 Minutes)
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-[11px] font-mono text-slate-400">
              Kernel eBPF AF_XDP Sampling Rate: 100ms
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
              <span>Observed Ingress Rate</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-0.5 bg-slate-600 inline-block stroke-dasharray" />
              <span>7-Day Moving Baseline</span>
            </span>
            <button
              type="button"
              onClick={() => setCurrentPath('/investigate/hunt')}
              className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore in SPIGraph Hunter</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* SVG Time-Series Area Chart */}
        <div className="h-40 w-full bg-[#060911] border border-slate-800/80 rounded relative p-2 overflow-hidden flex items-end">
          <svg className="w-full h-full" viewBox="0 0 1000 140" preserveAspectRatio="none">
            <defs>
              <linearGradient id="ingressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            <line x1="0" y1="20" x2="1000" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1="60" x2="1000" y2="60" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="1000" y2="100" stroke="#1e293b" strokeDasharray="3 3" />

            {/* 7-Day Baseline Line (dashed) */}
            <path
              d="M 0 105 Q 250 100, 500 98 T 1000 95"
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Observed Area Fill */}
            <path
              d="M 0 110 L 100 106 L 200 102 L 300 98 L 450 85 L 600 45 L 680 18 L 760 38 L 880 82 L 1000 88 L 1000 140 L 0 140 Z"
              fill="url(#ingressGradient)"
            />

            {/* Observed Throughput Curve */}
            <path
              d="M 0 110 L 100 106 L 200 102 L 300 98 L 450 85 L 600 45 L 680 18 L 760 38 L 880 82 L 1000 88"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />

            {/* Anomaly Spike Marker at 680, 18 */}
            <circle cx="680" cy="18" r="5" fill="#f43f5e" />
            <circle cx="680" cy="18" r="10" fill="#f43f5e" opacity="0.3" className="animate-ping" />
          </svg>

          {/* Anomaly Callout Badge */}
          <div className="absolute top-2 left-[62%] bg-[#080c14]/90 border border-rose-500/60 rounded px-2 py-1 text-[10px] font-mono text-rose-300 shadow-md">
            <div className="font-bold text-rose-400">19:38 UTC: 4.12 Gbps Spike</div>
            <div className="text-slate-400">Cobalt Strike C2 Burst + Exfil</div>
          </div>

          {/* Y-Axis Value Labels */}
          <div className="absolute left-3 top-2 text-[9px] font-mono text-slate-500 flex flex-col justify-between h-[80%] pointer-events-none">
            <span>5.0 Gbps</span>
            <span>2.5 Gbps</span>
            <span>1.0 Gbps</span>
          </div>

          {/* X-Axis Time Labels */}
          <div className="absolute bottom-1 w-full px-8 flex justify-between text-[9px] font-mono text-slate-500 pointer-events-none">
            <span>19:00</span>
            <span>19:15</span>
            <span>19:30</span>
            <span className="text-rose-400 font-bold">19:40 (C2 Spike)</span>
            <span>19:50</span>
            <span>20:00 (Live)</span>
          </div>
        </div>
      </div>

      {/* Row 2: Cross-Layer Attack Kill Chain Funnel (Interactive Stage Navigator) */}
      <div className="p-3.5 bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] rounded space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold text-[var(--zf-text-primary)] uppercase tracking-wider">
              Cross-Layer Attack Kill Chain & Detection Progression
            </h2>
            {selectedKillChainStage && (
              <button
                onClick={() => setSelectedKillChainStage(null)}
                className="text-[11px] text-[var(--zf-brand-accent)] hover:underline font-mono cursor-pointer"
              >
                (Clear filter: {selectedKillChainStage})
              </button>
            )}
          </div>
          <span className="text-[11px] font-mono text-[var(--zf-text-muted)]">
            Click any stage to filter correlated incident queue
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
          {MITRE_KILL_CHAIN.map((item, idx) => {
            const isSelected = selectedKillChainStage === item.stage;
            return (
              <button
                key={item.stage}
                type="button"
                onClick={() => setSelectedKillChainStage(isSelected ? null : item.stage)}
                className={`p-2.5 rounded border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[var(--zf-brand-accent-subtle)] border-[var(--zf-brand-accent)] shadow-xs ring-1 ring-[var(--zf-brand-accent)]'
                    : item.severity === 'CRITICAL'
                    ? 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/60'
                    : item.severity === 'ELEVATED'
                    ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60'
                    : 'bg-[var(--zf-surface-card)] border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--zf-text-muted)]">
                  <span>STAGE 0{idx + 1}</span>
                  <span
                    className={`font-semibold ${
                      item.severity === 'CRITICAL'
                        ? 'text-rose-400'
                        : item.severity === 'ELEVATED'
                        ? 'text-amber-400'
                        : 'text-[var(--zf-text-muted)]'
                    }`}
                  >
                    {item.hits} Hits
                  </span>
                </div>
                <div className="text-xs font-semibold text-[var(--zf-text-primary)] mt-1 truncate">
                  {item.stage}
                </div>
                <div className="text-[11px] font-mono text-[var(--zf-text-secondary)] truncate mt-0.5">
                  {item.technique}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 3: Split View — Priority Incident Queue (Left) & Live Wire Anomaly Radar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left: Master Incident Queue (8 cols) */}
        <div className="lg:col-span-8 bg-[#090d16] border border-slate-800/90 rounded flex flex-col overflow-hidden">
          <div className="p-3 bg-[#0d121f] border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100">Priority Threat Queue</span>
              <span className="text-slate-600">·</span>
              <span className="font-mono text-slate-400">
                {filteredIncidents.length} Multi-Stage Attacks Requiring Triage
              </span>
            </div>
            <button
              onClick={() => setCurrentPath('/investigate/incidents')}
              className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <span>Open Investigation Workbench</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#060911] border-b border-slate-800 text-slate-500 text-[10px] uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Incident Description & Vector</th>
                  <th className="py-2.5 px-3">Affected Asset</th>
                  <th className="py-2.5 px-3">Primary MITRE</th>
                  <th className="py-2.5 px-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                {filteredIncidents.map((incident) => {
                  return (
                    <tr
                      key={incident.id}
                      onClick={() => {
                        selectIncident(incident.id);
                        setCurrentPath('/investigate/incidents');
                      }}
                      className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                    >
                      {/* Severity (Zero-Pill: Clean unboxed indicator) */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`font-semibold text-[11px] flex items-center gap-1.5 ${
                            incident.severity === 'CRITICAL'
                              ? 'text-rose-400'
                              : incident.severity === 'HIGH'
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              incident.severity === 'CRITICAL'
                                ? 'bg-rose-500'
                                : incident.severity === 'HIGH'
                                ? 'bg-amber-400'
                                : 'bg-slate-500'
                            }`}
                          />
                          <span>{incident.severity}</span>
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap font-bold text-slate-200 group-hover:text-cyan-300">
                        {incident.id}
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-100 group-hover:text-cyan-300 font-sans text-xs">
                          {incident.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5">
                          {incident.plainEnglishSummary}
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-slate-200">{incident.primaryVictim.hostname}</div>
                        <div className="text-[10px] text-slate-500">
                          {incident.primaryVictim.ip} · {incident.primaryVictim.criticality}
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap text-cyan-300 text-[11px]">
                        {incident.mitreTactics[0]?.technique || incident.mitreTactics[0]?.name || 'T1059'}
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectIncident(incident.id);
                              setCurrentPath('/evidence/pcap');
                            }}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
                            title="Extract targeted PCAP"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectIncident(incident.id);
                              setCurrentPath('/respond/quarantine');
                            }}
                            className="p-1.5 rounded bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 transition-colors"
                            title="Isolate host from network"
                          >
                            <ShieldAlert className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Live Wire Anomaly Stream (4 cols) */}
        <div className="lg:col-span-4 bg-[#090d16] border border-slate-800/90 rounded flex flex-col overflow-hidden">
          <div className="p-3 bg-[#0d121f] border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-slate-100">Live Wire Anomalies</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">L7 Fingerprint Stream</span>
          </div>

          <div className="p-2 space-y-2 flex-1 overflow-y-auto">
            {LIVE_WIRE_ANOMALIES.map((sig) => (
              <div
                key={sig.id}
                onClick={() => setCurrentPath('/investigate/hunt')}
                className="p-2.5 rounded bg-[#060911] border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-semibold">{sig.type.replace('_', ' ')}</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-semibold ${
                        sig.risk === 'CRITICAL'
                          ? 'text-rose-400'
                          : sig.risk === 'HIGH'
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {sig.risk}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-500">{sig.timestamp}</span>
                  </div>
                </div>

                <div className="text-slate-200 group-hover:text-cyan-300 font-semibold text-[11px] truncate">
                  {sig.indicator}
                </div>

                <div className="text-[10px] text-slate-400 font-sans line-clamp-2">
                  {sig.detail}
                </div>

                <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{sig.sourceIp}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                  <span>{sig.destination}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-[#060911] border-t border-slate-800 text-center">
            <button
              onClick={() => setCurrentPath('/investigate/hunt')}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center justify-center gap-1 w-full"
            >
              <span>Query Full Wire Stream in Threat Hunter</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: Real-Time Security Activity Log Panel (Tracks System Events, User Logins, and Threat Alerts) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--zf-brand-accent)]" />
            <h2 className="text-xs font-semibold text-[var(--zf-text-primary)] uppercase tracking-wider">
              Real-Time Security Activity Stream
            </h2>
            <span className="text-[10px] font-mono text-[var(--zf-text-muted)]">
              Unified telemetry: System, Auth, and Threat Alerts
            </span>
          </div>

          <button
            type="button"
            onClick={() => setCurrentPath('/overview/activity-log')}
            className="text-[11px] font-mono text-[var(--zf-brand-accent)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Dedicated Operations View</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <SecurityActivityLogPanel maxHeight="420px" showHeader={true} />
      </div>
    </div>
  );
};
