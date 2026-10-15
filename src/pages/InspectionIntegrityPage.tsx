/**
 * Engineering Inspection Diagnostics View
 * Clean status rows, small stage indicators, technical drilldowns.
 * Includes:
 * - 7-Layer Observation Pipeline Diagnostics
 * - Network Encapsulation & Crypto Dissection Truth
 * - Blind Spots & Exposure View (Missing telemetry, stale detectors, root cause, remediation without fake risk scores)
 * - Resource Governor & Telemetry Backpressure panel (Governor states, pressure meters, browser protection telemetry)
 */

import React, { useState } from 'react';
import { useInspectionStore } from '../stores/inspection-store';
import { SecurityStatusBadge } from '../components/shared/SecurityStatusBadge';
import { ExportButton } from '../components/shared/ExportButton';
import { formatBitsPerSec, formatNumber } from '../lib/utils';
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  EyeOff,
  Gauge,
  Sliders,
  ShieldAlert,
  Server,
  Layers,
  CheckCircle2,
  Lock,
  Cpu,
  Database,
  Radio,
  FileCode,
  HardDrive,
  Wrench,
} from 'lucide-react';

const BLIND_SPOTS = [
  {
    id: 'BSP-01',
    name: 'Unmonitored Branch Core Ingress TAP',
    affectedDomain: 'SITE-BRANCH-NORTH',
    sensor: 'Unassigned (No Appliance)',
    visibilityDomain: 'Branch WAN Edge (10G AT&T Circuit)',
    missingTelemetry: 'Raw Full-Packet Ingress (Only NetFlow v9 metadata imported)',
    detectorImpact: 'Layer 7 Deep-Inspection & JARM TLS fingerprinting completely unavailable',
    rootCause: 'Physical optical TAP not yet provisioned on carrier handoff interface Gi0/0/1',
    requiredRemediation: 'Install 10G LC fiber TAP on carrier handoff and enroll secondary sensor node to SITE-BRANCH-NORTH',
    status: 'ACTIVE_EXPOSURE',
  },
  {
    id: 'BSP-02',
    name: 'Encrypted Client Hello (ECH) Inner SNI Masking',
    affectedDomain: 'SITE-HQ-EAST',
    sensor: 'SENSOR-HQ-CORE-01',
    visibilityDomain: 'Corporate Outbound HTTPS Egress',
    missingTelemetry: 'Inner Plaintext SNI & Encrypted HTTP/3 Handshake Payload',
    detectorImpact: 'Domain reputation canaries cannot observe encrypted inner domain name',
    rootCause: 'Cloudflare ECH / RFC 9460 adoption by endpoint browsers over TLS 1.3',
    requiredRemediation: 'Enforce corporate DNS split-horizon policy dropping draft-ech HTTPS RR params, or deploy managed endpoint certs',
    status: 'TECHNICAL_BLIND_SPOT',
  },
  {
    id: 'BSP-03',
    name: 'SCADA Substation 04 Unidirectional Optical Diode Egress Blindness',
    affectedDomain: 'SITE-GRID-SUB04',
    sensor: 'tap-scada-ot-01',
    visibilityDomain: 'Substation Relay Bus (IEC 61850 / Modbus)',
    missingTelemetry: 'Return ACK Frames (Unidirectional TX-Only Physical Optical Diode)',
    detectorImpact: 'Asymmetric flow tracking; TCP reassembly requires synthetic ACK emulation',
    rootCause: 'NERC CIP physical air-gap mandate: hardware diode physically blocks reverse transmission',
    requiredRemediation: 'Enable unidirectional flow heuristic profile; do not flag missing return ACKs as dropped connections',
    status: 'POLICY_CONSTRAINED',
  },
  {
    id: 'BSP-04',
    name: 'Stale Kerberos Ticket Canary Detector',
    affectedDomain: 'SITE-HQ-EAST',
    sensor: 'SENSOR-HQ-EDGE-02',
    visibilityDomain: 'Domain Controller Kerberos KDC (UDP/TCP:88)',
    missingTelemetry: 'Canary handshake heartbeat expired (> 45 minutes)',
    detectorImpact: 'DET-KERB-ROASTING-03 operating in degraded assurance mode',
    rootCause: 'Active Directory lab replication maintenance interrupted automated synthetic probe account',
    requiredRemediation: 'Restart Kerberos synthetic transaction canary daemon on DC-GLOBAL-01 and verify Ed25519 signature',
    status: 'CANARY_DEGRADED',
  },
];

type GovernorState = 'NORMAL' | 'PRESSURED' | 'DEGRADED' | 'SECURITY_IMPAIRED' | 'UNSAFE';

export const InspectionIntegrityPage: React.FC = () => {
  const { stages, encapsulation, crypto } = useInspectionStore();
  const [activeTab, setActiveTab] = useState<'PIPELINE' | 'BLIND_SPOTS' | 'GOVERNOR'>('PIPELINE');
  const [expandedStage, setExpandedStage] = useState<string | null>('CAPTURE');
  const [governorState, setGovernorState] = useState<GovernorState>('NORMAL');

  return (
    <div className="p-5 space-y-4 text-[#e6edf3] max-w-[1720px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-zinc-100 tracking-tight">Inspection Integrity & Diagnostics</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium">
              Zero-Copy Wire Kernel
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Engineering observation diagnostics tracking wire capture, L2–L4 reassembly, blind spot exposure, and telemetry resource backpressure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton
            resourceName="Inspection Diagnostics"
            recordCount={stages.length}
            data={stages}
          />
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#20242a] pb-2 text-xs">
        <button
          onClick={() => setActiveTab('PIPELINE')}
          className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'PIPELINE'
              ? 'bg-slate-800 text-cyan-300 border border-slate-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Observation Pipeline (7 Layers)</span>
        </button>

        <button
          onClick={() => setActiveTab('BLIND_SPOTS')}
          className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'BLIND_SPOTS'
              ? 'bg-slate-800 text-cyan-300 border border-slate-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <EyeOff className="w-3.5 h-3.5 text-amber-400" />
          <span>Blind Spots & Exposure ({BLIND_SPOTS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('GOVERNOR')}
          className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'GOVERNOR'
              ? 'bg-slate-800 text-cyan-300 border border-slate-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Gauge className="w-3.5 h-3.5 text-emerald-400" />
          <span>Resource Governor & Backpressure</span>
        </button>
      </div>

      {/* TAB 1: Observation Pipeline Diagnostics */}
      {activeTab === 'PIPELINE' && (
        <div className="space-y-4">
          <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden shadow-xs">
            <div className="p-3 border-b border-[#20242a] flex items-center justify-between bg-[#14171c]">
              <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                Observation Pipeline Diagnostics (7 Layers)
              </span>
              <span className="text-xs font-mono text-zinc-400">Kernel driver: zeroframe_afxdp_core</span>
            </div>

            <div className="divide-y divide-[#181b20]">
              {stages.map((stg) => {
                const isExpanded = expandedStage === stg.stage;

                return (
                  <div key={stg.stage} className="transition-colors hover:bg-[#15181e]">
                    <div
                      onClick={() => setExpandedStage(isExpanded ? null : stg.stage)}
                      className="p-3 flex items-center justify-between cursor-pointer select-none text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-zinc-500 w-6 text-center">{stg.stage.charAt(0)}</span>
                        <div>
                          <span className="font-semibold text-zinc-100">{stg.stage} Layer</span>
                          <span className="text-zinc-400 text-[11px] ml-2 font-mono">
                            {formatNumber(stg.packetRate)} pps · {formatBitsPerSec(stg.byteRate)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <SecurityStatusBadge state={stg.state} size="sm" />
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </div>
                    </div>

                    {/* Technical Diagnostic Drilldown */}
                    {isExpanded && (
                      <div className="px-5 pb-3 pt-1 bg-[#0b0e13] text-xs font-sans space-y-2 border-t border-[#181b20]">
                        <p className="text-zinc-300 leading-relaxed text-xs">{stg.notes}</p>

                        {stg.primaryCause && (
                          <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Diagnostic cause: {stg.primaryCause}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Network Encapsulation & Crypto Dissection Truth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            {/* Encapsulation & Asymmetry */}
            <div className="p-4 bg-[#101215] border border-[#20242a] rounded space-y-3 shadow-xs">
              <h3 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tunneling & Traffic Symmetry</span>
              </h3>
              <div className="space-y-1.5 text-zinc-300">
                <div className="flex justify-between py-1 border-b border-[#20242a]">
                  <span>802.1Q Single VLAN Trunk:</span>
                  <span className="text-emerald-400 font-mono">Verified Active</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#20242a]">
                  <span>QinQ Double Tagging:</span>
                  <span className="text-emerald-400 font-mono">Outer & Inner Tag Stripped</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#20242a]">
                  <span>Active VXLAN Tunnels:</span>
                  <span className="text-zinc-100 font-mono">{encapsulation.vxlanTunnels} Tunnels Decapsulated</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Asymmetric Flow Ratio:</span>
                  <span className="text-amber-400 font-mono font-medium">
                    {(encapsulation.asymmetricFlowRatio * 100).toFixed(1)}% (Half-Open Flows)
                  </span>
                </div>
              </div>
            </div>

            {/* Cryptographic Dissection Truth */}
            <div className="p-4 bg-[#101215] border border-[#20242a] rounded space-y-3 shadow-xs">
              <h3 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Cryptographic Dissection Truth</span>
              </h3>
              <div className="space-y-1.5 text-zinc-300">
                <div className="flex justify-between py-1 border-b border-[#20242a]">
                  <span>JA4 / JA4S Fingerprints:</span>
                  <span className="text-zinc-100 font-mono">{formatNumber(crypto.ja4FingerprintedFlows)} Sessions</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#20242a]">
                  <span>TLS 1.3 Encrypted Client Hello:</span>
                  <span className="text-amber-400 font-mono font-semibold">{crypto.echDetectedCount} Blind Spots</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#20242a]">
                  <span>DNS-over-HTTPS (DoH) Tunnels:</span>
                  <span className="text-amber-400 font-mono font-semibold">{crypto.dohTunnelCandidates} Candidates</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Decryption Claim Policy:</span>
                  <span className="text-emerald-400 font-mono">No Deceptive Decryption Claim</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Blind Spots & Exposure View */}
      {activeTab === 'BLIND_SPOTS' && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-950/20 border border-amber-500/40 rounded text-xs text-amber-200 space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Authoritative Blind Spot Disclosure (No Synthetic Risk Scores)</span>
            </div>
            <p className="text-zinc-400 leading-relaxed font-sans text-xs">
              ZeroFrame explicitly maps where wire telemetry is unmonitored, masked by encryption, or constrained by physical unidirectional diodes. We report exact observation gaps and engineering remediations rather than generating arbitrary risk points.
            </p>
          </div>

          <div className="space-y-3">
            {BLIND_SPOTS.map((bsp) => (
              <div
                key={bsp.id}
                className="p-4 bg-[#101215] border border-[#20242a] rounded space-y-2.5 text-xs font-sans"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#181b20] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                      {bsp.id}
                    </span>
                    <h3 className="font-semibold text-zinc-100 text-sm">{bsp.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {bsp.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px] bg-[#0b0e13] p-2.5 rounded border border-[#181b20]">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Affected Site & Domain:</span>
                    <span className="text-zinc-200">{bsp.affectedDomain}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Assigned Sensor:</span>
                    <span className="text-cyan-400">{bsp.sensor}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Visibility Domain:</span>
                    <span className="text-zinc-200">{bsp.visibilityDomain}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-zinc-400 font-medium">Missing Wire Telemetry: </span>
                    <span className="text-zinc-300">{bsp.missingTelemetry}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-medium">Detector Impact: </span>
                    <span className="text-rose-300">{bsp.detectorImpact}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-medium">Root Cause: </span>
                    <span className="text-zinc-300">{bsp.rootCause}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#181b20] flex items-start gap-2 text-cyan-300 bg-cyan-950/15 p-2 rounded border border-cyan-800/30 text-[11px]">
                  <Wrench className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cyan-200">Required Engineering Remediation: </strong>
                    <span>{bsp.requiredRemediation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Resource Governor & Telemetry Backpressure */}
      {activeTab === 'GOVERNOR' && (
        <div className="space-y-4">
          {/* Governor State Banner */}
          <div className="p-4 bg-[#101215] border border-[#20242a] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-semibold text-zinc-400">Current Governor State:</span>
                <span
                  className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded border ${
                    governorState === 'NORMAL'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : governorState === 'PRESSURED'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      : governorState === 'DEGRADED'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {governorState}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Dynamic telemetry throttling protects kernel ring buffers and browser DOM responsiveness without silent event loss.
              </p>
            </div>

            {/* Simulated State Switcher */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['NORMAL', 'PRESSURED', 'DEGRADED', 'SECURITY_IMPAIRED', 'UNSAFE'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setGovernorState(st)}
                  className={`px-2 py-1 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                    governorState === st
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Subsystem Pressure Meters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: 'Host CPU Pressure', value: 28, max: 100, unit: '%', detail: '32 Cores · eBPF 8.4% load' },
              { name: 'Memory Pressure', value: 41, max: 100, unit: '%', detail: '65.6 / 160 GB locked hugepages' },
              { name: 'AF_XDP Ingress Queue', value: 14, max: 100, unit: '%', detail: '2,240 / 16,384 packet slots' },
              { name: 'NVMe Ring Buffer Write', value: 33, max: 100, unit: '%', detail: '1.38 GB/s / 4.20 GB/s cap' },
              { name: 'Open File Descriptors', value: 8, max: 100, unit: '%', detail: '8,192 / 102,400 FDs' },
              { name: 'Worker Thread Pool', value: 22, max: 100, unit: '%', detail: '14 / 64 threads utilized' },
              { name: 'Database Commit Backlog', value: 3, max: 100, unit: '%', detail: '120 events pending ledger seal' },
              { name: 'Telemetry Loss Rate', value: 0, max: 100, unit: '%', detail: '0 drops at line rate (100% SLA)' },
            ].map((meter) => (
              <div
                key={meter.name}
                className="p-3 bg-[#101215] border border-[#20242a] rounded space-y-2 text-xs"
              >
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium">{meter.name}</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {meter.value}
                    {meter.unit}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      meter.value > 80
                        ? 'bg-rose-500'
                        : meter.value > 50
                        ? 'bg-amber-400'
                        : 'bg-cyan-400'
                    }`}
                    style={{ width: `${meter.value}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-zinc-500">{meter.detail}</div>
              </div>
            ))}
          </div>

          {/* Browser Protection & Backpressure Telemetry */}
          <div className="bg-[#101215] border border-[#20242a] rounded p-4 space-y-3">
            <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Browser DOM Protection & Stream Backpressure Telemetry</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#0b0e13] rounded border border-[#181b20] space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase font-semibold block">CircuitBreaker Status</span>
                <div className="text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ARMED & NOMINAL (0 Trips)</span>
                </div>
                <p className="text-zinc-400 text-[10px]">
                  Trips automatically if browser event bus exceeds 25,000 events/sec to prevent DOM freezing.
                </p>
              </div>

              <div className="p-3 bg-[#0b0e13] rounded border border-[#181b20] space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase font-semibold block">MaxRows Buffer Cap</span>
                <div className="text-cyan-400 font-mono font-semibold">
                  10,000 Rows Hard Limit
                </div>
                <p className="text-zinc-400 text-[10px]">
                  Enforces virtual windowing decimation so memory usage never leaks beyond 85 MB in tab session.
                </p>
              </div>

              <div className="p-3 bg-[#0b0e13] rounded border border-[#181b20] space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase font-semibold block">Adaptive Decimation</span>
                <div className="text-purple-400 font-mono font-semibold">
                  OFF (Raw 1:1 Ingestion Active)
                </div>
                <p className="text-zinc-400 text-[10px]">
                  Automatically aggregates non-critical events 10:1 if browser frame rate falls below 30 FPS.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
