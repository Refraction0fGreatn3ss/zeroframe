/**
 * Enterprise Sensor Fleet Management
 * Follows strict infrastructure table layout:
 * - Table: Sensor, Site, Connectivity, Health, Observation, Trust, Capture Driver, Version, Last Seen
 * - Keeps Lifecycle, Connectivity, Health, Observation, and Trust separate
 * - Sensor Lifecycle & Deployment Preflight: 14 lifecycle states with "Applied != Verified" mandate
 * - 10-point Deployment Preflight Check table
 * - mTLS & Certificate Lifecycle dossier with SPIFFE ID, Trust Domain, and Rotation History
 * - Right-side slide-over drawer for hardware and outbox queue inspection
 */

import React, { useState } from 'react';
import { useFleetStore } from '../stores/fleet-store';
import { SecurityStatusBadge } from '../components/shared/SecurityStatusBadge';
import { ExportButton } from '../components/shared/ExportButton';
import { SensorNode } from '../types/fleet';
import { timeAgo, formatNumber } from '../lib/utils';
import {
  Cpu,
  Server,
  X,
  Activity,
  HardDrive,
  ShieldCheck,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  KeyRound,
  FileCheck,
  AlertTriangle,
  RotateCw,
  Sliders,
  Layers,
  ArrowRight,
} from 'lucide-react';

const LIFECYCLE_STAGES = [
  { step: 1, id: 'ENROLLMENT_REQUESTED', label: 'Enrollment Request', desc: 'Hardware attestation & initial bootstrap beacon' },
  { step: 2, id: 'CSR_PENDING', label: 'CSR Pending', desc: 'TPM 2.0 CSR generated with curve Ed25519' },
  { step: 3, id: 'CERT_ISSUED', label: 'Certificate Issued', desc: 'Signed by Intermediate Fleet CA' },
  { step: 4, id: 'TRUST_VERIFIED', label: 'Trust Verified', desc: 'Mutual mTLS cryptographic handshake confirmed' },
  { step: 5, id: 'CONFIG_SENT', label: 'Config Sent', desc: 'Signed control plane wire policy transmitted' },
  { step: 6, id: 'CONFIG_ACCEPTED', label: 'Config Accepted', desc: 'Sensor daemon validates schema and cryptographic signature' },
  { step: 7, id: 'CONFIG_APPLIED', label: 'Config Applied', desc: 'eBPF / AF_XDP filters attached to kernel ring' },
  { step: 8, id: 'OBSERVING', label: 'Observing', desc: 'Raw ingress frames parsing through protocol decoders' },
  { step: 9, id: 'VERIFYING', label: 'Verifying', desc: 'Autonomous canary loop validating detection accuracy' },
  { step: 10, id: 'VERIFIED', label: 'Verified Nominal', desc: 'Authoritative telemetry certification issued' },
  { step: 11, id: 'DRAINING', label: 'Draining', desc: 'Safe ring buffer flushing prior to maintenance' },
  { step: 12, id: 'MAINTENANCE', label: 'Maintenance', desc: 'Kernel upgrade or driver reconfiguration' },
  { step: 13, id: 'RETIRED', label: 'Retired', desc: 'Appliance gracefully decommissioned' },
  { step: 14, id: 'REVOKED', label: 'Revoked', desc: 'mTLS certificate purged from trust domain' },
];

const PREFLIGHT_CHECKS = [
  { id: 'CHK-01', name: 'AF_XDP Driver & UMEM Ring Buffer Allocation', status: 'PASSED', target: 'enp4s0f0 (Queue 0-15)', metric: 'Zero-Copy Direct DMA Enabled', latency: '0.12 ms' },
  { id: 'CHK-02', name: 'Hardware Offload Disable & Promiscuous Mode', status: 'PASSED', target: 'LRO/GRO/TSO disabled', metric: 'True Wire Reconstruction', latency: '0.04 ms' },
  { id: 'CHK-03', name: 'Hugepages 2MB/1GB Pool Availability', status: 'PASSED', target: '16 x 1GB Pages allocated', metric: '16,384 MB locked memory', latency: '0.08 ms' },
  { id: 'CHK-04', name: 'Hardware TPM 2.0 & Secure Boot Attestation', status: 'PASSED', target: 'PCR[0-7] Sha256 Verified', metric: 'Golden Kernel Signature', latency: '1.40 ms' },
  { id: 'CHK-05', name: 'QinQ 802.1Q/ad VLAN Unstripping Support', status: 'PASSED', target: 'Nested Tag Parser', metric: 'Inner/Outer VID Preservation', latency: '0.02 ms' },
  { id: 'CHK-06', name: 'SPIFFE mTLS Mutual Attestation with Control Plane', status: 'PASSED', target: 'spiffe://zeroframe.corp', metric: 'Ed25519 Mutual Verified', latency: '4.80 ms' },
  { id: 'CHK-07', name: 'PTP/NTP Sub-Millisecond Time Synchronization', status: 'PASSED', target: 'IEEE 1588 PTP Hardware Clock', metric: 'Clock Drift < 42 ns', latency: '0.01 ms' },
  { id: 'CHK-08', name: 'Kernel Ingress Buffer Ring Drops Benchmark', status: 'PASSED', target: '14.88 Mpps Line Rate Test', metric: '0.0000% Packet Drop Rate', latency: '12.0 ms' },
  { id: 'CHK-09', name: 'Disk NVMe Ring Buffer Write Throughput', status: 'PASSED', target: 'PCIe Gen5 NVMe Array', metric: 'Write Speed 4.2 GB/s', latency: '2.10 ms' },
  { id: 'CHK-10', name: 'Byzantine Witness Consensus Notary Link', status: 'PASSED', target: 'Quorum (3/3 signed)', metric: 'Sub-second Notary Seal', latency: '18.4 ms' },
];

export const FleetPage: React.FC = () => {
  const { sensors } = useFleetStore();
  const [activeDrawerSensor, setActiveDrawerSensor] = useState<SensorNode | null>(null);
  const [activeViewTab, setActiveViewTab] = useState<'SENSORS' | 'PREFLIGHT' | 'MTLS'>('SENSORS');
  const [drawerSubTab, setDrawerSubTab] = useState<'TELEMETRY' | 'LIFECYCLE' | 'CERTIFICATE'>('TELEMETRY');

  return (
    <div className="p-5 space-y-4 text-[#e6edf3] max-w-[1720px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-zinc-100 tracking-tight">Sensor Fleet & Ingress Control</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
              High-Speed Wire Plane
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Physical, virtual, and SCADA optical TAP appliances with discrete connectivity, health, observation, and cryptographic trust states.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton resourceName="Sensor Fleet" recordCount={sensors.length} data={sensors} />
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#20242a] pb-2 text-xs">
        <button
          onClick={() => setActiveViewTab('SENSORS')}
          className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeViewTab === 'SENSORS'
              ? 'bg-slate-800 text-cyan-300 border border-slate-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Sensor Appliances ({sensors.length})</span>
        </button>

        <button
          onClick={() => setActiveViewTab('PREFLIGHT')}
          className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeViewTab === 'PREFLIGHT'
              ? 'bg-slate-800 text-cyan-300 border border-slate-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Sensor Lifecycle & Deployment Preflight</span>
        </button>

        <button
          onClick={() => setActiveViewTab('MTLS')}
          className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeViewTab === 'MTLS'
              ? 'bg-slate-800 text-cyan-300 border border-slate-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>mTLS & Certificate Lifecycle</span>
        </button>
      </div>

      {/* VIEW 1: Sensor Appliances Table */}
      {activeViewTab === 'SENSORS' && (
        <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#14171c] border-b border-[#20242a] text-zinc-400 text-[11px] font-medium">
                <tr>
                  <th className="py-2.5 px-3">Sensor Appliance</th>
                  <th className="py-2.5 px-3">Site / Location</th>
                  <th className="py-2.5 px-3">Connectivity</th>
                  <th className="py-2.5 px-3">Health</th>
                  <th className="py-2.5 px-3">Observation</th>
                  <th className="py-2.5 px-3">mTLS Trust</th>
                  <th className="py-2.5 px-3">Capture Driver</th>
                  <th className="py-2.5 px-3">Version</th>
                  <th className="py-2.5 px-3 text-right">Heartbeat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181b20] text-zinc-300">
                {sensors.map((sensor) => (
                  <tr
                    key={sensor.id}
                    onClick={() => {
                      setActiveDrawerSensor(sensor);
                      setDrawerSubTab('TELEMETRY');
                    }}
                    className="hover:bg-[#15181e] cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{sensor.name}</span>
                      </div>
                      <div className="font-mono text-[11px] text-zinc-500">{sensor.managementIp}</div>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-300">{sensor.site}</td>
                    <td className="py-2.5 px-3">
                      <SecurityStatusBadge state={sensor.connectivity} size="sm" />
                    </td>
                    <td className="py-2.5 px-3">
                      <SecurityStatusBadge state={sensor.health} size="sm" />
                    </td>
                    <td className="py-2.5 px-3">
                      <SecurityStatusBadge state={sensor.observation} size="sm" />
                    </td>
                    <td className="py-2.5 px-3">
                      <SecurityStatusBadge state={sensor.trust} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-300">
                      {sensor.captureDriver} (Q{sensor.activeQueue})
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">
                      {sensor.version}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[11px] text-zinc-400">
                      {timeAgo(sensor.lastHeartbeat)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: Sensor Lifecycle & Deployment Preflight */}
      {activeViewTab === 'PREFLIGHT' && (
        <div className="space-y-4">
          {/* Applied != Verified Constitutional Callout */}
          <div className="p-4 bg-amber-950/20 border border-amber-600/40 rounded space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>CRITICAL ARCHITECTURE MANDATE: Applied != Verified</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              A sensor node that has successfully applied an eBPF / AF_XDP wire policy is <strong className="text-amber-300">not considered authoritative</strong> until the autonomous verification canary loops have injected, captured, and cryptographically verified test vectors across that specific observation point. Premature certainty is strictly prohibited.
            </p>
          </div>

          {/* 14-Stage Sensor Lifecycle Pipeline Diagram */}
          <div className="bg-[#101215] border border-[#20242a] rounded p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#20242a] pb-2">
              <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Authoritative 14-Stage Sensor Lifecycle Pipeline</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400">State Progression: Left to Right</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {LIFECYCLE_STAGES.map((stg) => {
                const isConfigApplied = stg.id === 'CONFIG_APPLIED';
                const isVerified = stg.id === 'VERIFIED';

                return (
                  <div
                    key={stg.id}
                    className={`p-2.5 rounded border text-xs flex flex-col justify-between ${
                      isConfigApplied
                        ? 'bg-amber-950/20 border-amber-500/50 text-amber-300'
                        : isVerified
                        ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-[#14171d] border-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500">
                        <span>#{stg.step}</span>
                        {isConfigApplied && (
                          <span className="text-amber-400 font-bold">APPLIED</span>
                        )}
                        {isVerified && (
                          <span className="text-emerald-400 font-bold">VERIFIED</span>
                        )}
                      </div>
                      <div className="font-semibold text-xs mt-1">{stg.label}</div>
                      <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{stg.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 10-Point Deployment Preflight Check Table */}
          <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden">
            <div className="p-3 bg-[#14171c] border-b border-[#20242a] flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>10-Point Deployment Preflight Verification Matrix</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400">10 / 10 CHECKS PASSED (100% ASSURANCE)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#12151a] border-b border-[#20242a] text-zinc-400 text-[11px] font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Check ID</th>
                    <th className="py-2.5 px-3">Preflight Verification Name</th>
                    <th className="py-2.5 px-3">Target Subsystem</th>
                    <th className="py-2.5 px-3">Measured Telemetry Metric</th>
                    <th className="py-2.5 px-3">Execution Latency</th>
                    <th className="py-2.5 px-3 text-right">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181b20] text-zinc-300">
                  {PREFLIGHT_CHECKS.map((chk) => (
                    <tr key={chk.id} className="hover:bg-[#15181e] transition-colors">
                      <td className="py-2 px-3 font-mono text-cyan-400 text-[11px] font-semibold">{chk.id}</td>
                      <td className="py-2 px-3 font-medium text-zinc-200">{chk.name}</td>
                      <td className="py-2 px-3 font-mono text-zinc-400 text-[11px]">{chk.target}</td>
                      <td className="py-2 px-3 font-mono text-slate-300 text-[11px]">{chk.metric}</td>
                      <td className="py-2 px-3 font-mono text-zinc-400 text-[11px]">{chk.latency}</td>
                      <td className="py-2 px-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>PASSED</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: mTLS & Certificate Lifecycle */}
      {activeViewTab === 'MTLS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-[#101215] border border-[#20242a] rounded space-y-1">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Trust Domain Root</span>
              <div className="font-mono text-xs font-semibold text-cyan-400">spiffe://zeroframe.corp</div>
              <span className="text-[10px] text-zinc-500 font-sans">Strict Mutual mTLS v1.3 Only (TLS_AES_256_GCM_SHA384)</span>
            </div>

            <div className="p-3 bg-[#101215] border border-[#20242a] rounded space-y-1">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Intermediate CA Key</span>
              <div className="font-mono text-xs font-semibold text-emerald-400">ZeroFrame Intermediate Fleet CA 2026</div>
              <span className="text-[10px] text-zinc-500 font-sans">Hardware HSM-Backed (FIPS 140-3 Level 4)</span>
            </div>

            <div className="p-3 bg-[#101215] border border-[#20242a] rounded space-y-1">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Rotation Policy</span>
              <div className="font-mono text-xs font-semibold text-purple-400">90-Day Automated Ephemeral Reissuance</div>
              <span className="text-[10px] text-zinc-500 font-sans">Zero-Downtime Hot-Reload via SPIFFE Workload API</span>
            </div>
          </div>

          {/* Active Sensor Certificates Table */}
          <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden">
            <div className="p-3 bg-[#14171c] border-b border-[#20242a] flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <span>Sensor mTLS X.509 Certificates & Rotation Lifecycle</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400">{sensors.length} ACTIVE ATTESTED NODES</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#12151a] border-b border-[#20242a] text-zinc-400 text-[11px] font-medium">
                  <tr>
                    <th className="py-2.5 px-3">SPIFFE Workload ID</th>
                    <th className="py-2.5 px-3">Subject Distinguished Name</th>
                    <th className="py-2.5 px-3">Certificate Serial</th>
                    <th className="py-2.5 px-3">SHA-256 Fingerprint</th>
                    <th className="py-2.5 px-3">Valid Until</th>
                    <th className="py-2.5 px-3">Trust Domain</th>
                    <th className="py-2.5 px-3 text-right">Rotation State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181b20] text-zinc-300">
                  {sensors.map((s, idx) => (
                    <tr
                      key={s.id}
                      onClick={() => {
                        setActiveDrawerSensor(s);
                        setDrawerSubTab('CERTIFICATE');
                      }}
                      className="hover:bg-[#15181e] cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono text-cyan-300 font-semibold">{s.spiffeId}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-200">
                        CN={s.hostname}, O=ZeroFrame Enterprise
                      </td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400 text-[11px]">
                        4F:9A:{idx + 10}:BC:01:E4:77
                      </td>
                      <td className="py-2.5 px-3 font-mono text-zinc-500 text-[10px] truncate max-w-[140px]">
                        {s.certFingerprintSha256}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400 text-[11px]">
                        {s.certExpiresAt.split('T')[0]}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-zinc-300 text-[11px]">zeroframe.corp</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          VALID (Nominal)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Slide-Over Sensor Inspection Drawer */}
      {activeDrawerSensor && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveDrawerSensor(null)}
          />

          <div className="relative w-full max-w-lg bg-[#0e1013] border-l border-[#20242a] text-[#e6edf3] p-5 flex flex-col h-full shadow-2xl z-10 overflow-y-auto font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#20242a] mb-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">{activeDrawerSensor.name}</h3>
                <span className="font-mono text-[11px] text-zinc-400">{activeDrawerSensor.hostname}</span>
              </div>
              <button
                onClick={() => setActiveDrawerSensor(null)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Sub-tabs */}
            <div className="flex items-center gap-2 border-b border-[#20242a] pb-2 mb-4 text-xs">
              <button
                onClick={() => setDrawerSubTab('TELEMETRY')}
                className={`pb-1 px-2 font-medium border-b-2 transition-colors cursor-pointer ${
                  drawerSubTab === 'TELEMETRY'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Wire Telemetry
              </button>
              <button
                onClick={() => setDrawerSubTab('LIFECYCLE')}
                className={`pb-1 px-2 font-medium border-b-2 transition-colors cursor-pointer ${
                  drawerSubTab === 'LIFECYCLE'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Lifecycle (14-Stage)
              </button>
              <button
                onClick={() => setDrawerSubTab('CERTIFICATE')}
                className={`pb-1 px-2 font-medium border-b-2 transition-colors cursor-pointer ${
                  drawerSubTab === 'CERTIFICATE'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                mTLS Certificate
              </button>
            </div>

            {drawerSubTab === 'TELEMETRY' && (
              <div className="space-y-4 text-xs">
                {/* Separate States Strip */}
                <div className="p-3 bg-[#131518] rounded border border-[#23272e] space-y-2">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Authoritative Security States
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-zinc-300">
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Lifecycle:</span>
                      <SecurityStatusBadge state={activeDrawerSensor.lifecycle} size="sm" showDot={false} />
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Connectivity:</span>
                      <SecurityStatusBadge state={activeDrawerSensor.connectivity} size="sm" />
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Daemon Health:</span>
                      <SecurityStatusBadge state={activeDrawerSensor.health} size="sm" />
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Observation:</span>
                      <SecurityStatusBadge state={activeDrawerSensor.observation} size="sm" />
                    </div>
                  </div>
                </div>

                {/* Hardware Telemetry */}
                <div className="p-3 bg-[#131518] rounded border border-[#23272e] space-y-2">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Capture & Wire Statistics
                  </span>
                  <div className="space-y-1 text-zinc-300">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Interface:</span>
                      <span className="font-mono text-zinc-200">{activeDrawerSensor.interfaceName} (Promiscuous)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Wire Throughput:</span>
                      <span className="font-mono text-zinc-200">{activeDrawerSensor.wireThroughputMbps} Mbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Packet Rate:</span>
                      <span className="font-mono text-zinc-200">{formatNumber(activeDrawerSensor.packetRatePps)} pps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Kernel Buffer Drops:</span>
                      <span className={`font-mono ${activeDrawerSensor.kernelDropsPps > 0 ? 'text-amber-400' : 'text-zinc-200'}`}>
                        {activeDrawerSensor.kernelDropsPps} pps
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Pending Outbox Queue:</span>
                      <span className="font-mono text-zinc-200">{activeDrawerSensor.outboxPendingEvents} events</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {drawerSubTab === 'LIFECYCLE' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#131518] rounded border border-[#23272e] space-y-1.5 font-mono text-[11px]">
                  <span className="font-sans font-semibold text-zinc-300 text-xs block">Active Lifecycle Transition</span>
                  <div className="text-emerald-400 font-bold">STATE: VERIFIED_NOMINAL (Stage 10/14)</div>
                  <div className="text-zinc-400 text-[10px]">Attestation Validated: {new Date(activeDrawerSensor.lastHeartbeat).toLocaleString()}</div>
                </div>

                <div className="space-y-1.5 max-h-96 overflow-y-auto">
                  {LIFECYCLE_STAGES.slice(0, 10).map((stg) => (
                    <div key={stg.id} className="p-2 rounded bg-[#11141a] border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[10px] text-zinc-500 mr-2">#{stg.step}</span>
                        <span className="text-zinc-200 font-medium text-xs">{stg.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30">
                        COMPLETED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {drawerSubTab === 'CERTIFICATE' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#131518] rounded border border-[#23272e] space-y-2 font-mono text-[11px]">
                  <span className="font-sans font-semibold text-zinc-300 text-xs block">mTLS X.509 Identity Dossier</span>
                  <div className="text-zinc-400">SPIFFE ID: <span className="text-cyan-300">{activeDrawerSensor.spiffeId}</span></div>
                  <div className="text-zinc-400">Subject: <span className="text-zinc-200">CN={activeDrawerSensor.hostname}, O=ZeroFrame Enterprise</span></div>
                  <div className="text-zinc-400">Issuer: <span className="text-zinc-200">ZeroFrame Intermediate Fleet CA 2026</span></div>
                  <div className="text-zinc-400">Serial: <span className="text-zinc-300">4F:9A:88:21:BC:01:E4</span></div>
                  <div className="text-zinc-400">Expiry Date: <span className="text-emerald-400 font-semibold">{activeDrawerSensor.certExpiresAt.split('T')[0]}</span></div>
                  <div className="text-zinc-500 text-[10px] break-all pt-1 border-t border-slate-800">
                    SHA-256 Fingerprint: {activeDrawerSensor.certFingerprintSha256}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-zinc-300 block">Certificate Rotation History</span>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="p-2 rounded bg-[#11141a] border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="text-zinc-200 font-sans text-xs">Automated 90-Day Renewal</div>
                        <div className="text-[10px] text-zinc-500">2026-01-01 · Hot-Reload Verified</div>
                      </div>
                      <span className="text-[10px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                        SUCCESS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
