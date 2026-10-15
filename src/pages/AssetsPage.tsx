/**
 * Enterprise Living Identity & Asset Inventory
 * High-density inventory table with IoT/OT classification, discovered protocols,
 * and dual-tab inspection drawer (Current Identity Context & Bitemporal Identity History).
 */

import React, { useState } from 'react';
import { useInvestigationStore } from '../stores/investigation-store';
import { useAppStore } from '../stores/app-store';
import { ExportButton } from '../components/shared/ExportButton';
import { LivingEntity, EntityType, BitemporalHistoryRecord } from '../types';
import { timeAgo } from '../lib/utils';
import {
  Server,
  Laptop,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  X,
  ChevronRight,
  Camera,
  Printer,
  Phone,
  KeyRound,
  Tv,
  Radio,
  Clock,
  History,
  Tag,
  User,
  Cloud,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const AssetsPage: React.FC = () => {
  const { entities } = useInvestigationStore();
  const { setCurrentPath } = useAppStore();
  const [activeDrawerEntity, setActiveDrawerEntity] = useState<LivingEntity | null>(null);
  const [drawerTab, setDrawerTab] = useState<'CONTEXT' | 'BITEMPORAL'>('CONTEXT');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'IT' | 'IOT_OT' | 'SERVERS' | 'CRITICAL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case 'CAMERA':
        return <Camera className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case 'PRINTER':
        return <Printer className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'VOIP':
        return <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
      case 'ACCESS_CONTROL':
        return <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'DISPLAY':
        return <Tv className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      case 'OT_PLC':
        return <Cpu className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
      case 'SERVER':
        return <Server className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case 'WORKSTATION':
        return <Laptop className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'GATEWAY':
        return <Radio className="w-3.5 h-3.5 text-teal-400 shrink-0" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  const isIotOt = (type: EntityType) =>
    ['CAMERA', 'PRINTER', 'VOIP', 'ACCESS_CONTROL', 'DISPLAY', 'OT_PLC'].includes(type);

  const filteredEntities = entities.filter((ent) => {
    if (categoryFilter === 'IT' && isIotOt(ent.entityType)) return false;
    if (categoryFilter === 'IOT_OT' && !isIotOt(ent.entityType)) return false;
    if (categoryFilter === 'SERVERS' && ent.entityType !== 'SERVER') return false;
    if (categoryFilter === 'CRITICAL' && !ent.isProtected && ent.blastRadiusScore < 80) return false;

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchHost = ent.hostname.toLowerCase().includes(q);
      const matchIp = ent.currentIp.includes(q);
      const matchMac = ent.mac.toLowerCase().includes(q);
      const matchType = ent.entityType.toLowerCase().includes(q);
      const matchProto = ent.discoveredProtocols?.some((p) => p.toLowerCase().includes(q));
      const matchOwner = ent.owner?.toLowerCase().includes(q);
      if (!matchHost && !matchIp && !matchMac && !matchType && !matchProto && !matchOwner) return false;
    }
    return true;
  });

  return (
    <div className="p-5 space-y-4 text-[#e6edf3] max-w-[1720px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-zinc-100 tracking-tight">Living Identity & Asset Inventory</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium">
              Bitemporal Truth Graph
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Authoritative asset graph tracking IT, IoT, and OT infrastructure, discovered wire protocols, DHCP churn, and bitemporal ledger provenance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton resourceName="Living Entities" recordCount={entities.length} data={entities} />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0d1014] p-2.5 rounded border border-[#20242a]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              { id: 'ALL', label: `All Assets (${entities.length})` },
              { id: 'IT', label: 'Enterprise IT' },
              { id: 'IOT_OT', label: 'IoT & OT Field' },
              { id: 'SERVERS', label: 'Critical Servers' },
              { id: 'CRITICAL', label: 'Tier-1 High Blast' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                categoryFilter === tab.id
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                  : 'bg-transparent text-zinc-400 hover:text-zinc-200 border border-transparent hover:border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter hostname, IP, MAC, protocol (e.g. Modbus, ONVIF)..."
            className="w-full sm:w-72 bg-[#14171d] border border-slate-800 rounded px-2.5 py-1 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>
      </div>

      {/* High-Density Assets Table */}
      <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#14171c] border-b border-[#20242a] text-zinc-400 text-[11px] font-medium">
              <tr>
                <th className="py-2.5 px-3">Hostname & Identity</th>
                <th className="py-2.5 px-3">Current IP</th>
                <th className="py-2.5 px-3">Hardware MAC</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Discovered Protocols</th>
                <th className="py-2.5 px-3">VLAN Status</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Protection</th>
                <th className="py-2.5 px-3 text-right">Last Observed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181b20] text-zinc-300">
              {filteredEntities.map((ent) => {
                const hasVlanConflict =
                  ent.vlanDeclared !== undefined &&
                  ent.vlanObserved !== undefined &&
                  ent.vlanDeclared !== ent.vlanObserved;

                return (
                  <tr
                    key={ent.id}
                    onClick={() => {
                      setActiveDrawerEntity(ent);
                      setDrawerTab('CONTEXT');
                    }}
                    className="hover:bg-[#15181e] cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-zinc-100 flex items-center gap-2">
                        {getEntityIcon(ent.entityType)}
                        <span className="font-semibold text-zinc-200">{ent.hostname}</span>
                        {ent.isProtected && (
                          <span title="Tier-1 Protected Asset">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          </span>
                        )}
                        {ent.activeIncidents && ent.activeIncidents.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Active Incident Involved" />
                        )}
                      </div>
                      <div className="font-mono text-[10px] text-zinc-500 pl-5">{ent.id}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-200">{ent.currentIp}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-400 text-[11px]">{ent.mac}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 font-mono text-slate-300">
                        {ent.entityType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {ent.discoveredProtocols && ent.discoveredProtocols.length > 0 ? (
                          ent.discoveredProtocols.map((p) => (
                            <span
                              key={p}
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                                ['Modbus/TCP', 'BACnet/IP'].includes(p)
                                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                                  : ['ONVIF', 'RTSP'].includes(p)
                                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              {p}
                            </span>
                          ))
                        ) : (
                          <span className="text-zinc-600 text-[10px] font-mono">Standard L4</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {hasVlanConflict ? (
                        <span className="text-amber-400 font-mono text-[11px] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span>Conflict: Declared {ent.vlanDeclared} / Observed {ent.vlanObserved}</span>
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-zinc-400">
                          VLAN {ent.vlanObserved || 'Default'}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">
                      <span className="text-emerald-400 font-medium">{ent.identityConfidence || 95}%</span>
                    </td>
                    <td className="py-2.5 px-3">
                      {ent.isProtected ? (
                        <span className="text-[11px] text-emerald-400 font-medium">Tier-1 Hardened</span>
                      ) : (
                        <span className="text-[11px] text-zinc-500">Standard</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[11px] text-zinc-500">
                      {timeAgo(ent.lastSeen)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Asset Detail Drawer */}
      {activeDrawerEntity && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveDrawerEntity(null)}
          />

          <div className="relative w-full max-w-xl bg-[#0b0e13] border-l border-[#20242a] text-[#e6edf3] p-5 flex flex-col h-full shadow-2xl z-10 overflow-y-auto font-sans">
            {/* Drawer Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#20242a]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-slate-800 border border-slate-700">
                  {getEntityIcon(activeDrawerEntity.entityType)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-100">{activeDrawerEntity.hostname}</h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {activeDrawerEntity.entityType}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-400">{activeDrawerEntity.currentIp}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveDrawerEntity(null)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[#20242a] pt-3 pb-2 text-xs">
              <button
                onClick={() => setDrawerTab('CONTEXT')}
                className={`pb-1 px-2 font-medium border-b-2 transition-colors cursor-pointer ${
                  drawerTab === 'CONTEXT'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Current Identity & Context
              </button>
              <button
                onClick={() => setDrawerTab('BITEMPORAL')}
                className={`pb-1 px-2 font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  drawerTab === 'BITEMPORAL'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Bitemporal Identity History</span>
              </button>
            </div>

            {/* TAB 1: Current Identity & Context */}
            {drawerTab === 'CONTEXT' && (
              <div className="space-y-4 pt-4 text-xs">
                {/* Identity Confidence & Blast Radius */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#11141a] rounded border border-[#20242a] space-y-1">
                    <div className="flex justify-between text-zinc-400 text-[11px]">
                      <span>Identity Confidence:</span>
                      <span className="text-emerald-400 font-mono font-semibold">
                        {activeDrawerEntity.identityConfidence || 95}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{ width: `${activeDrawerEntity.identityConfidence || 95}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Multi-sensor wire correlation: {activeDrawerEntity.provenance}
                    </span>
                  </div>

                  <div className="p-3 bg-[#11141a] rounded border border-[#20242a] space-y-1">
                    <div className="flex justify-between text-zinc-400 text-[11px]">
                      <span>Blast Radius Score:</span>
                      <span
                        className={`font-mono font-semibold ${
                          activeDrawerEntity.blastRadiusScore > 70 ? 'text-rose-400' : 'text-zinc-200'
                        }`}
                      >
                        {activeDrawerEntity.blastRadiusScore} / 100
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          activeDrawerEntity.blastRadiusScore > 70 ? 'bg-rose-500' : 'bg-cyan-400'
                        }`}
                        style={{ width: `${activeDrawerEntity.blastRadiusScore}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {activeDrawerEntity.isProtected ? 'Tier-1 Enclave Protection Active' : 'Standard Exposure Profile'}
                    </span>
                  </div>
                </div>

                {/* Identity Metadata Box */}
                <div className="p-3.5 bg-[#11141a] rounded border border-[#20242a] space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Hardware MAC:</span>
                    <span className="text-zinc-200">{activeDrawerEntity.mac}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Operating System / Firmware:</span>
                    <span className="text-zinc-300 font-sans">{activeDrawerEntity.os || 'Linux Embedded RT'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Asset Owner:</span>
                    <span className="text-zinc-300 font-sans">{activeDrawerEntity.owner || 'Corporate IT Services'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Observation Source:</span>
                    <span className="text-zinc-200">{activeDrawerEntity.observationSource}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Provenance Method:</span>
                    <span className="text-cyan-400">{activeDrawerEntity.provenance}</span>
                  </div>
                </div>

                {/* Bound Users & Service Accounts */}
                {activeDrawerEntity.users && activeDrawerEntity.users.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="font-semibold text-zinc-300 block text-xs flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>Associated Identities & Service Principals</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDrawerEntity.users.map((u) => (
                        <span
                          key={u}
                          className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 font-mono text-[11px]"
                        >
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cloud & Fabric IDs */}
                {activeDrawerEntity.cloudIds && activeDrawerEntity.cloudIds.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="font-semibold text-zinc-300 block text-xs flex items-center gap-1.5">
                      <Cloud className="w-3.5 h-3.5 text-blue-400" />
                      <span>Cloud ARNs & Fabric IDs</span>
                    </span>
                    <div className="space-y-1">
                      {activeDrawerEntity.cloudIds.map((cid) => (
                        <div
                          key={cid}
                          className="p-1.5 rounded bg-[#11141a] border border-[#20242a] font-mono text-[10px] text-blue-300 break-all"
                        >
                          {cid}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Discovered Wire Protocols */}
                {activeDrawerEntity.discoveredProtocols && activeDrawerEntity.discoveredProtocols.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="font-semibold text-zinc-300 block text-xs flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Discovered Wire Protocols & Signatures</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDrawerEntity.discoveredProtocols.map((p) => (
                        <span
                          key={p}
                          className="px-2 py-1 rounded bg-[#151922] text-cyan-300 border border-cyan-500/30 font-mono text-[11px]"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Asset Tags */}
                {activeDrawerEntity.tags && activeDrawerEntity.tags.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="font-semibold text-zinc-300 block text-xs flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Classification Tags</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDrawerEntity.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Incident Associations */}
                {activeDrawerEntity.activeIncidents && activeDrawerEntity.activeIncidents.length > 0 && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded space-y-1.5">
                    <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Linked Active Security Incidents</span>
                    </div>
                    {activeDrawerEntity.activeIncidents.map((incId) => (
                      <div key={incId} className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-rose-300 font-bold">{incId}</span>
                        <button
                          onClick={() => {
                            setActiveDrawerEntity(null);
                            setCurrentPath('/investigate/incidents');
                          }}
                          className="text-xs text-rose-400 underline hover:text-rose-200 cursor-pointer flex items-center gap-1"
                        >
                          <span>Pivot to Dossier</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Historical DHCP Leases */}
                <div className="space-y-2 pt-2 border-t border-[#20242a]">
                  <span className="font-semibold text-zinc-300 block text-xs">Historical DHCP Leases</span>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    {activeDrawerEntity.historicalIps.map((lease, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-[#131518] rounded border border-[#20242a] flex justify-between items-center"
                      >
                        <div>
                          <span className="text-zinc-200 font-medium">{lease.ip}</span>
                          <span className="text-zinc-500 ml-2">({lease.leaseOrigin})</span>
                        </div>
                        <span className="text-zinc-500 text-[10px]">{timeAgo(lease.lastSeen)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Bitemporal Identity History */}
            {drawerTab === 'BITEMPORAL' && (
              <div className="space-y-4 pt-4 text-xs">
                {/* Bitemporal Constitution Callout */}
                <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded text-[11px] text-cyan-200 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5 text-cyan-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Bitemporal Ledger Reconciliation</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed font-sans">
                    Every asset attribute transition preserves two temporal dimensions: <strong className="text-slate-200">Valid Time</strong> (when the event occurred on the wire) and <strong className="text-slate-200">Transaction Time</strong> (when it was committed into the immutable cryptographic audit ledger).
                  </p>
                </div>

                {/* Timeline Records */}
                <div className="space-y-3">
                  {(
                    activeDrawerEntity.bitemporalHistory || [
                      {
                        id: `BTH-${activeDrawerEntity.id}-01`,
                        field: 'IP' as const,
                        oldValue: '0.0.0.0',
                        newValue: activeDrawerEntity.currentIp,
                        validTime: activeDrawerEntity.firstSeen,
                        transactionTime: new Date(new Date(activeDrawerEntity.firstSeen).getTime() + 1200).toISOString(),
                        provenance: activeDrawerEntity.provenance,
                        recordedBy: activeDrawerEntity.observationSource,
                      },
                      {
                        id: `BTH-${activeDrawerEntity.id}-02`,
                        field: 'SITE_VLAN' as const,
                        oldValue: 'UNASSIGNED',
                        newValue: `VLAN ${activeDrawerEntity.vlanObserved || 104}`,
                        validTime: activeDrawerEntity.firstSeen,
                        transactionTime: new Date(new Date(activeDrawerEntity.firstSeen).getTime() + 2500).toISOString(),
                        provenance: 'DISCOVERED',
                        recordedBy: 'ZeroFrame Autonomous Tap Inspector',
                      },
                      {
                        id: `BTH-${activeDrawerEntity.id}-03`,
                        field: 'PROTECTED_STATE' as const,
                        oldValue: 'STANDARD',
                        newValue: activeDrawerEntity.isProtected ? 'PROTECTED_TIER_1' : 'STANDARD',
                        validTime: activeDrawerEntity.firstSeen,
                        transactionTime: new Date(new Date(activeDrawerEntity.firstSeen).getTime() + 3000).toISOString(),
                        provenance: 'DECLARED',
                        recordedBy: 'Security Policy Engine',
                      },
                    ]
                  ).map((record) => (
                    <div
                      key={record.id}
                      className="p-3 bg-[#11141a] rounded border border-[#20242a] space-y-2 font-mono text-[11px]"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
                            {record.field}
                          </span>
                          <span className="text-zinc-500 text-[10px]">{record.id}</span>
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded border ${
                            record.provenance === 'DISCOVERED'
                              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                              : record.provenance === 'DECLARED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : record.provenance === 'IMPORTED'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {record.provenance}
                        </span>
                      </div>

                      {/* Transition */}
                      <div className="flex items-center gap-2 text-xs font-sans">
                        <span className="text-zinc-500 font-mono line-through">{record.oldValue}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-emerald-300 font-mono font-semibold">{record.newValue}</span>
                      </div>

                      {/* Bitemporal Stamps */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 pt-1 border-t border-slate-800/60">
                        <div>
                          <span className="text-zinc-500 block">Valid Time (Physical Reality):</span>
                          <span className="text-zinc-300">{new Date(record.validTime).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Transaction Time (Ledger Commit):</span>
                          <span className="text-zinc-300">{new Date(record.transactionTime).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-zinc-500">
                        Recorded by: <span className="text-zinc-300">{record.recordedBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
