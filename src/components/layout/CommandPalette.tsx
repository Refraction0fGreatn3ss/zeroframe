/**
 * Enterprise Command Palette (Cmd+K)
 * Clean, fast operational search across incidents, assets, detectors, and quick actions.
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../stores/app-store';
import { useInvestigationStore } from '../../stores/investigation-store';
import { Search, Shield, Laptop, Terminal, X, ChevronRight, Activity, Radio, Cpu, FileCheck, User, Network, Key, FileText, Lock, Globe } from 'lucide-react';

const INDEXED_NETWORK_FLOWS = [
  { flowId: 'FLW-098241', src: '10.140.2.88:52194', dst: '185.220.101.44:443', proto: 'TCP', verdict: 'MALICIOUS', desc: 'Cobalt Strike Malleable TLS C2 beacon' },
  { flowId: 'FLW-098242', src: '10.140.10.14:59301', dst: '1.1.1.1:53', proto: 'UDP', verdict: 'MALICIOUS', desc: 'High-Entropy DNS Exfiltration Tunnel' },
  { flowId: 'FLW-098243', src: '10.140.2.88:51240', dst: '10.140.10.5:445', proto: 'SMB', verdict: 'SUSPICIOUS', desc: 'SMB Named Pipe PsExec binding (\\pipe\\svcctl)' },
  { flowId: 'FLW-098245', src: '10.140.2.88:49811', dst: '142.250.190.46:443', proto: 'QUIC', verdict: 'ANOMALOUS', desc: 'QUIC / ECH Encrypted Channel Bypass' },
  { flowId: 'FLW-098246', src: '192.168.10.42:50201', dst: '192.168.10.100:502', proto: 'Modbus/TCP', verdict: 'MALICIOUS', desc: 'Modbus Write Single Coil 0x05 unauthorized PLC write' },
];

const INDEXED_SENSOR_INTERFACES = [
  { id: 'eth0:tap-core-01', site: 'SITE-HQ-EAST', type: '10G Fiber Switched TAP', status: 'ACTIVE', rate: '2.45 Gbps' },
  { id: 'eth1:tap-dmz-02', site: 'SITE-HQ-EAST', type: '1G DMZ Gateway Mirror', status: 'ACTIVE', rate: '420 Mbps' },
  { id: 'tap-scada-ot-01', site: 'SITE-GRID-SUB04', type: 'Unidirectional Optical Diode', status: 'PROTECTED', rate: '12 Mbps' },
  { id: 'sfp28-tap-prod-03', site: 'SITE-DC-WEST', type: '25G High-Speed Optical TAP', status: 'ACTIVE', rate: '8.9 Gbps' },
];

const INDEXED_WITNESS_TRANSACTIONS = [
  { txId: 'WITNESS-TX-8819', blockNumber: 8819, status: 'BYZANTINE_CONSENSUS_SEALED', hash: '0x7f48b901a92e1048b2914092b1a8', type: 'Evidence Sealing Notary' },
  { txId: 'WITNESS-TX-8820', blockNumber: 8820, status: 'BYZANTINE_CONSENSUS_SEALED', hash: '0x3c99a140f021e048bb74921ca801', type: 'Response Execution Permit Notary' },
  { txId: 'WITNESS-PROOF-ROOT-2026', blockNumber: 8821, status: 'ROOT_MERKLE_VALIDATED', hash: '0x8841da92fe0184b2c0194812f840', type: 'Consensus Merkle Proof' },
];

const INDEXED_EVIDENCE_PCAPS = [
  { evidenceId: 'EVD-2026-9901', pcapId: 'PCAP-HQ-2026-0491', sha256: '7f9a2b84e019f91a92e1048b2914092b1a80', desc: 'Cobalt Strike C2 Beacon Packet Capture', site: 'SITE-HQ-EAST' },
  { evidenceId: 'EVD-2026-9902', pcapId: 'PCAP-DMZ-2026-0492', sha256: '3c81e048bb74921ca801a92e1048b2914092', desc: 'Encrypted Client Hello (ECH) TLS Handshake', site: 'SITE-HQ-EAST' },
  { evidenceId: 'EVD-2026-9903', pcapId: 'PCAP-SCADA-2026-0495', sha256: '99bf21a0da92fe0184b2c0194812f840a12e', desc: 'Modbus Unauthorized Coil Modification PCAP', site: 'SITE-GRID-SUB04' },
];

const INDEXED_PERMITS = [
  { permitId: 'PMT-2026-0814', action: 'HOST_ISOLATE_MAC', target: '00:50:56:b3:44:19', status: 'ACTIVE_ENFORCED', approver: 'Dual-Control Quorum' },
  { permitId: 'PMT-2026-0815', action: 'BGP_RTBH_DROP', target: '185.220.101.44/32', status: 'AUTHORIZED', approver: 'Automated Playbook' },
  { permitId: 'PMT-2026-0816', action: 'TCP_RST_TEARDOWN', target: '10.140.2.88 <-> 185.220.101.44', status: 'APPLIED', approver: 'SecOps Lead' },
];

const INDEXED_VLANS_SUBNETS = [
  { vlan: 'VLAN 104', subnet: '10.140.2.0/24', name: 'Corporate Workstation Enclave', site: 'SITE-HQ-EAST', qinq: 'Outer: 104 / Inner: 12' },
  { vlan: 'VLAN 208', subnet: '10.140.10.0/24', name: 'Critical Core Infrastructure & Domain Controllers', site: 'SITE-HQ-EAST', qinq: 'Outer: 208 / Inner: 5' },
  { vlan: 'VLAN 350', subnet: '192.168.10.0/24', name: 'OT / SCADA ICS Field Network', site: 'SITE-GRID-SUB04', qinq: 'Outer: 350 / Inner: 1' },
  { vlan: 'VLAN 99', subnet: '172.16.0.0/20', name: 'Isolated Quarantine Network', site: 'GLOBAL-VIRTUAL', qinq: 'Outer: 99 / Inner: 99' },
];

const INDEXED_USERS = [
  { username: 's.chen', email: 's.chen@enterprise.corp', name: 'Sarah Chen', role: 'Lead Tier 3 SOC Operator', assignedIp: '10.140.2.88' },
  { username: 'm.vance', email: 'm.vance@enterprise.corp', name: 'Marcus Vance', role: 'SecOps Incident Commander', assignedIp: '10.140.2.92' },
  { username: 'd.ross', email: 'd.ross@enterprise.corp', name: 'David Ross', role: 'OT/SCADA Systems Engineer', assignedIp: '192.168.10.42' },
  { username: 'svc-backup', email: 'svc-backup@enterprise.corp', name: 'Enterprise Backup Service Account', role: 'Automated Ingestion', assignedIp: '10.140.10.5' },
];

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, setCurrentPath, setViewMode } = useAppStore();
  const { incidents, entities } = useInvestigationStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const qLower = query.toLowerCase();

  const filteredIncidents = incidents.filter(
    (inc) =>
      inc.title.toLowerCase().includes(qLower) ||
      inc.id.toLowerCase().includes(qLower) ||
      inc.primaryVictim.ip.includes(query) ||
      inc.severity.toLowerCase().includes(qLower) ||
      inc.state.toLowerCase().includes(qLower)
  );

  const filteredEntities = entities.filter(
    (ent) =>
      ent.hostname.toLowerCase().includes(qLower) ||
      ent.currentIp.includes(query) ||
      ent.mac.toLowerCase().includes(qLower) ||
      (ent.owner && ent.owner.toLowerCase().includes(qLower)) ||
      (ent.entityType && ent.entityType.toLowerCase().includes(qLower))
  );

  const filteredUsers = INDEXED_USERS.filter(
    (u) =>
      u.username.toLowerCase().includes(qLower) ||
      u.email.toLowerCase().includes(qLower) ||
      u.name.toLowerCase().includes(qLower) ||
      u.role.toLowerCase().includes(qLower) ||
      u.assignedIp.includes(query)
  );

  const filteredFlows = INDEXED_NETWORK_FLOWS.filter(
    (flw) =>
      flw.flowId.toLowerCase().includes(qLower) ||
      flw.src.includes(query) ||
      flw.dst.includes(query) ||
      flw.proto.toLowerCase().includes(qLower) ||
      flw.desc.toLowerCase().includes(qLower)
  );

  const filteredSensors = INDEXED_SENSOR_INTERFACES.filter(
    (s) =>
      s.id.toLowerCase().includes(qLower) ||
      s.site.toLowerCase().includes(qLower) ||
      s.type.toLowerCase().includes(qLower)
  );

  const filteredVlans = INDEXED_VLANS_SUBNETS.filter(
    (v) =>
      v.vlan.toLowerCase().includes(qLower) ||
      v.subnet.includes(query) ||
      v.name.toLowerCase().includes(qLower) ||
      v.site.toLowerCase().includes(qLower) ||
      v.qinq.toLowerCase().includes(qLower)
  );

  const filteredEvidencePcaps = INDEXED_EVIDENCE_PCAPS.filter(
    (e) =>
      e.evidenceId.toLowerCase().includes(qLower) ||
      e.pcapId.toLowerCase().includes(qLower) ||
      e.sha256.toLowerCase().includes(qLower) ||
      e.desc.toLowerCase().includes(qLower) ||
      e.site.toLowerCase().includes(qLower)
  );

  const filteredPermits = INDEXED_PERMITS.filter(
    (p) =>
      p.permitId.toLowerCase().includes(qLower) ||
      p.action.toLowerCase().includes(qLower) ||
      p.target.toLowerCase().includes(qLower) ||
      p.approver.toLowerCase().includes(qLower) ||
      p.status.toLowerCase().includes(qLower)
  );

  const filteredWitness = INDEXED_WITNESS_TRANSACTIONS.filter(
    (w) =>
      w.txId.toLowerCase().includes(qLower) ||
      w.hash.toLowerCase().includes(qLower) ||
      w.type.toLowerCase().includes(qLower)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/70 font-sans">
      <div className="bg-[#0e1013] border border-[#23272e] rounded-lg max-w-lg w-full text-[#e6edf3] shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-[#20242a] flex items-center gap-2.5">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search IP, MAC, hostname, user, email, incident, alert, sensor, VLAN, subnet, PCAP, or permit..."
            className="w-full bg-transparent text-xs text-zinc-100 focus:outline-hidden placeholder:text-zinc-500 font-sans"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-1.5 divide-y divide-[#181b20] text-xs">
          {/* Incidents */}
          {filteredIncidents.length > 0 && (
            <div className="py-1">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                Security Incidents
              </div>
              {filteredIncidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => {
                    setCurrentPath('/investigate/incidents');
                    setCommandPaletteOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded hover:bg-[#15181e] cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Shield className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="font-mono text-[11px] text-zinc-400">{inc.id}</span>
                    <span className="truncate">{inc.title}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Living Entities */}
          {filteredEntities.length > 0 && (
            <div className="py-1">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                Assets & Hostnames ({filteredEntities.length})
              </div>
              {filteredEntities.map((ent) => (
                <div
                  key={ent.id}
                  onClick={() => {
                    setCurrentPath('/investigate/assets');
                    setCommandPaletteOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded hover:bg-[#15181e] cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Laptop className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="font-medium text-zinc-200">{ent.hostname}</span>
                    <span className="font-mono text-[11px] text-zinc-400">{ent.currentIp}</span>
                    <span className="font-mono text-[10px] text-zinc-500">{ent.mac}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Users & Emails */}
          {filteredUsers.length > 0 && query.trim() !== '' && (
            <div className="py-1">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span>Enterprise Users & Identities</span>
                <span className="font-mono">{filteredUsers.length} matches</span>
              </div>
              {filteredUsers.map((u) => (
                <div
                  key={u.username}
                  onClick={() => {
                    setCurrentPath('/admin/system');
                    setCommandPaletteOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded hover:bg-[#15181e] cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-medium text-amber-300">{u.name}</span>
                    <span className="font-mono text-[11px] text-zinc-400">{u.email}</span>
                    <span className="text-[10px] text-zinc-500">[{u.role}]</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Network Flows */}
          {filteredFlows.length > 0 && query.trim() !== '' && (
            <div className="py-1">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                <span>Network Wire Flows</span>
                <span className="font-mono">{filteredFlows.length} matches</span>
              </div>
              {filteredFlows.map((flw) => (
                <div
                  key={flw.flowId}
                  onClick={() => {
                    setCurrentPath('/investigate/hunt');
                    setCommandPaletteOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded hover:bg-[#15181e] cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-mono text-[11px] text-cyan-300 font-semibold">{flw.flowId}</span>
                    <span className="font-mono text-[10px] text-zinc-400">{flw.proto}</span>
                    <span className="truncate text-zinc-300">{flw.src} &rarr; {flw.dst}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Sensor Interfaces */}
          {filteredSensors.length > 0 && query.trim() !== '' && (
            <div className="py-1">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                <span>Sensor Interfaces & Fleet TAPs</span>
                <span className="font-mono">{filteredSensors.length} matches</span>
              </div>
              {filteredSensors.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setCurrentPath('/fleet/sensors');
                    setCommandPaletteOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded hover:bg-[#15181e] cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-mono text-[11px] text-emerald-300 font-semibold">{s.id}</span>
                    <span className="text-zinc-400 text-[10px]">[{s.site}]</span>
                    <span className="truncate text-zinc-300">{s.type}</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500">{s.rate}</span>
                </div>
              ))}
            </div>
          )}

          {/* VLANs & Subnets */}
          {filteredVlans.length > 0 && query.trim() !== '' && (
            <div className="py-1">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-sky-400 uppercase tracking-wider flex items-center justify-between">
                <span>VLAN Enclaves & Subnets</span>
                <span className="font-mono">{filteredVlans.length} matches</span>
              </div>
              {filteredVlans.map((v) => (
                <div
                  key={v.vlan}
                  onClick={() => {
                    setCurrentPath('/investigate/hunt');
                    setCommandPaletteOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded hover:bg-[#15181e] cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Network className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="font-mono text-[11px] text-sky-300 font-semibold">{v.vlan}</span>
                    <span className="font-mono text-[11px] text-zinc-300">{v.subnet}</span>
                    <span className="text-[10px] text-zinc-400">[{v.site}]</span>
                    <span className="text-[10px] text-zinc-500 truncate">{v.qinq}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Evidence IDs & Sealed PCAPs */}
          {filteredEvidencePcaps.length > 0 && query.trim() !== '' && (
            <div className="py-1">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-rose-400 uppercase tracking-wider flex items-center justify-between">
                <span>Evidence Records & Sealed PCAPs</span>
                <span className="font-mono">{filteredEvidencePcaps.length} matches</span>
              </div>
              {filteredEvidencePcaps.map((e) => (
                <div
                  key={e.evidenceId}
                  onClick={() => {
                    setCurrentPath('/evidence/vault');
                    setCommandPaletteOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded hover:bg-[#15181e] cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="font-mono text-[11px] text-rose-300 font-semibold">{e.evidenceId}</span>
                    <span className="font-mono text-[11px] text-zinc-300">{e.pcapId}</span>
                    <span className="text-[10px] text-zinc-400 truncate">{e.desc}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Response Execution Permits */}
          {filteredPermits.length > 0 && query.trim() !== '' && (
            <div className="py-1">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-orange-400 uppercase tracking-wider flex items-center justify-between">
                <span>Governed Response Permits & Quarantine</span>
                <span className="font-mono">{filteredPermits.length} matches</span>
              </div>
              {filteredPermits.map((p) => (
                <div
                  key={p.permitId}
                  onClick={() => {
                    setCurrentPath('/respond/permits');
                    setCommandPaletteOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded hover:bg-[#15181e] cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Lock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="font-mono text-[11px] text-orange-300 font-semibold">{p.permitId}</span>
                    <span className="font-mono text-[10px] text-zinc-300 font-medium">{p.action}</span>
                    <span className="font-mono text-[10px] text-zinc-400 truncate">Target: {p.target}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Witness Consensus Transactions */}
          {filteredWitness.length > 0 && query.trim() !== '' && (
            <div className="py-1">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-purple-400 uppercase tracking-wider flex items-center justify-between">
                <span>Witness Consensus Transactions</span>
                <span className="font-mono">{filteredWitness.length} matches</span>
              </div>
              {filteredWitness.map((w) => (
                <div
                  key={w.txId}
                  onClick={() => {
                    setCurrentPath('/evidence/witness');
                    setCommandPaletteOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded hover:bg-[#15181e] cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="font-mono text-[11px] text-purple-300 font-semibold">{w.txId}</span>
                    <span className="text-[10px] text-zinc-400 truncate">{w.type}</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500">Block #{w.blockNumber}</span>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="py-1">
            <div className="px-2.5 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
              Quick Actions
            </div>
            <div
              onClick={() => {
                setViewMode('SIMPLE_SOC');
                setCurrentPath('/overview');
                setCommandPaletteOpen(false);
              }}
              className="px-2.5 py-1.5 rounded hover:bg-[#15181e] cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Switch to Simple SOC Executive Mode</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            </div>

            <div
              onClick={() => {
                setCurrentPath('/respond/studio');
                setCommandPaletteOpen(false);
              }}
              className="px-2.5 py-1.5 rounded hover:bg-[#15181e] cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Open Governed Response Studio</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            </div>

            <div
              onClick={() => {
                setCurrentPath('/overview/activity-log');
                setCommandPaletteOpen(false);
              }}
              className="px-2.5 py-1.5 rounded hover:bg-[#15181e] cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Security Activity Log (Real-Time Ingestion)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            </div>

            <div
              onClick={() => {
                setCurrentPath('/investigate/scada-ot');
                setCommandPaletteOpen(false);
              }}
              className="px-2.5 py-1.5 rounded hover:bg-[#15181e] cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>SCADA / OT Grid Defense & Air-Gap Diode</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-[#0a0c0e] border-t border-[#20242a] text-[10px] text-zinc-500 flex items-center justify-between">
          <span>Search assets, incidents, and detection controls</span>
          <span>ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
