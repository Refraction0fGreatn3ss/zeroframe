/**
 * ZeroFrame NDR/XDR Master Incident Investigation Workbench
 * 
 * Domain-Native NDR/XDR Architecture:
 * - Two-Pane Master-Detail Tactical Workspace
 * - Left Pane: High-Density Incident Queue with search & severity filters
 * - Right Pane:
 *   1. Tactical Incident Dossier Header with Threat Score & Fast Containment Rail
 *   2. Interactive Visual Process Execution & Wire Correlation Tree (Process Tree / Causality Chain)
 *   3. Synchronized Dual-Layer Timeline (Network Wire + Endpoint eBPF)
 *   4. Forensic Artifact Ledger with Cryptographic SHA-256 Seals
 *   5. Zero-Pill Discipline: Unboxed metadata, tabular figures, no candy chips
 */

import React, { useState } from 'react';
import { useInvestigationStore } from '../stores/investigation-store';
import { useAppStore } from '../stores/app-store';
import { useDrawerStore } from '../stores/context-drawer-store';
import { ExportButton } from '../components/shared/ExportButton';
import { StructuredIncidentReportModal } from '../components/shared/StructuredIncidentReportModal';
import { evidenceService } from '../services/evidence-service';
import { SecurityIncident } from '../types';
import { timeAgo } from '../lib/utils';
import {
  ShieldAlert,
  Server,
  Lock,
  ArrowRight,
  Clock,
  FileText,
  Activity,
  Layers,
  Search,
  Download,
  AlertTriangle,
  Eye,
  CheckCircle2,
  ChevronRight,
  User,
  Radio,
  Terminal,
  Cpu,
  Share2,
  Check,
  Sparkles,
  ChevronDown,
  UserCheck,
  MessageSquare,
  Send,
  ExternalLink,
} from 'lucide-react';

interface ProcessNode {
  id: string;
  name: string;
  pid: number;
  user: string;
  cmdline: string;
  hash?: string;
  status: 'MALICIOUS' | 'SUSPICIOUS' | 'LEGITIMATE';
  type: 'PROCESS' | 'NETWORK' | 'FILE';
  meta: string;
}

const PROCESS_EXECUTION_TREES: Record<string, ProcessNode[]> = {
  default: [
    {
      id: 'node-1',
      name: 'w3wp.exe (IIS Worker Process)',
      pid: 3108,
      user: 'IIS_IUSRS',
      cmdline: 'C:\\Windows\\System32\\inetsrv\\w3wp.exe -ap "DefaultAppPool"',
      status: 'LEGITIMATE',
      type: 'PROCESS',
      meta: 'Parent web application worker service',
    },
    {
      id: 'node-2',
      name: 'cmd.exe',
      pid: 4920,
      user: 'IIS_IUSRS',
      cmdline: 'C:\\Windows\\System32\\cmd.exe /c powershell.exe -nop -w hidden -enc JABzAD0...',
      status: 'SUSPICIOUS',
      type: 'PROCESS',
      meta: 'Spawned shell via web shell POST command',
    },
    {
      id: 'node-3',
      name: 'powershell.exe',
      pid: 5012,
      user: 'NT AUTHORITY\\SYSTEM',
      cmdline: 'powershell.exe -nop -w hidden -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAA...',
      status: 'MALICIOUS',
      type: 'PROCESS',
      meta: 'Token impersonation to SYSTEM · downloads stage 2 beacon',
    },
    {
      id: 'node-4',
      name: 'Network C2 Socket (TCP 443)',
      pid: 5012,
      user: 'NT AUTHORITY\\SYSTEM',
      cmdline: 'Outbound connect 185.220.101.44:443 (JA4: t13d1516h2_8daaf6152771...)',
      status: 'MALICIOUS',
      type: 'NETWORK',
      meta: 'Cobalt Strike malleable C2 TLS session · 48KB beaconing',
    },
    {
      id: 'node-5',
      name: 'svchost_upd.exe',
      pid: 9112,
      user: 'NT AUTHORITY\\SYSTEM',
      cmdline: 'C:\\ProgramData\\svchost_upd.exe --inject-lsass',
      hash: 'a93f8e42b109c0d38194e21a8d424b91fe203a1194248a80194812f840912e84',
      status: 'MALICIOUS',
      type: 'FILE',
      meta: 'Dropped payload into C:\\ProgramData · Memory dump tool',
    },
    {
      id: 'node-6',
      name: 'SMB Named Pipe Lateral Movement',
      pid: 9112,
      user: 'NT AUTHORITY\\SYSTEM',
      cmdline: '\\\\10.140.10.5\\pipe\\svcctl (RPC bind to Domain Controller)',
      status: 'MALICIOUS',
      type: 'NETWORK',
      meta: 'PsExec-style lateral pivoting to Domain Controller DC-01',
    },
  ],
};

export const IncidentsPage: React.FC = () => {
  const { incidents, selectedIncident, selectIncident, updateIncidentState } = useInvestigationStore();
  const { setCurrentPath } = useAppStore();
  const { openContext } = useDrawerStore();

  const current = selectedIncident || incidents[0];
  const [activeTab, setActiveTab] = useState<'TREE' | 'TIMELINE' | 'FORENSICS' | 'NOTES'>('TREE');
  const [searchFilter, setSearchFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAiAdvisoryOpen, setIsAiAdvisoryOpen] = useState(true);
  const [assignedOperators, setAssignedOperators] = useState<Record<string, string>>({
    'INC-8812': 'Sarah Chen, CISSP (Tier 3 Lead)',
    'INC-8813': 'Alex Rivera (Tier 2 SOC)',
    'INC-8814': 'Marcus Vance (OT Lead)',
  });
  const [analystNotes, setAnalystNotes] = useState<Record<string, Array<{ id: string; author: string; timestamp: string; content: string }>>>({
    'INC-8812': [
      {
        id: 'note-1',
        author: 'Sarah Chen, CISSP',
        timestamp: '19:52:10 UTC',
        content: 'Correlated outbound TLS session with known Cobalt Strike malleable C2 profile (JA4: t13d1516h2_8daaf6152771_0278457224b8). Initiated dual-control host quarantine review.',
      },
      {
        id: 'note-2',
        author: 'Alex Rivera (Tier 2)',
        timestamp: '19:56:44 UTC',
        content: 'Extracted 100MB PCAP slice from ring buffer on tap-core-01. SHA-256 hash sealed in immutable ledger block #8819.',
      },
    ],
  });
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedProcessNode, setSelectedProcessNode] = useState<ProcessNode | null>(
    PROCESS_EXECUTION_TREES.default[2]
  );
  const [containmentApplied, setContainmentApplied] = useState(false);
  const [processKilled, setProcessKilled] = useState(false);
  const [isExtractingPcap, setIsExtractingPcap] = useState(false);
  const [pcapStatus, setPcapStatus] = useState<string | null>(null);

  const handleAddNote = () => {
    if (!newNoteText.trim() || !current) return;
    const currentNotes = analystNotes[current.id] || [];
    const newNote = {
      id: `note-${Date.now()}`,
      author: 'Sarah Chen, CISSP',
      timestamp: new Date().toLocaleTimeString() + ' UTC',
      content: newNoteText.trim(),
    };
    setAnalystNotes({
      ...analystNotes,
      [current.id]: [newNote, ...currentNotes],
    });
    setNewNoteText('');
  };

  const handleRouteToGovernedIsolation = () => {
    // Route isolation through governed response permit workflow requiring Approver 1 & Approver 2 co-signatures
    setCurrentPath('/respond/studio');
  };

  const handleExtractPcap = async () => {
    if (!current?.primaryVictim?.ip) return;
    setIsExtractingPcap(true);
    setPcapStatus('Extracting buffer slice...');
    try {
      await evidenceService.startPcapCapture(current.primaryVictim.ip, 60);
      setPcapStatus('Extraction initiated');
      setTimeout(() => {
        setCurrentPath('/evidence/pcap');
      }, 700);
    } catch (err: any) {
      setPcapStatus('Extraction error: ' + (err?.message || 'Failed'));
    } finally {
      setIsExtractingPcap(false);
    }
  };

  if (!current) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 font-sans">
        No incidents available in current tenant scope.
      </div>
    );
  }

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      inc.primaryVictim.hostname.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const processTree = PROCESS_EXECUTION_TREES[current.id] || PROCESS_EXECUTION_TREES.default;

  return (
    <div className="p-4 sm:p-5 space-y-4 text-slate-200 max-w-[1720px] mx-auto font-sans select-none">
      {/* Top Header & Export Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight text-slate-100">
              Incident Investigation Workbench
            </h1>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-xs text-cyan-400 font-medium">
              Case Ref: {current.id}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-layer endpoint & network causality tree, synchronized wire events, and zero-trust containment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="px-3 py-1.5 rounded bg-[#0f1422] hover:bg-[#161d30] border border-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer text-slate-200 transition-colors shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Generate Case File</span>
          </button>
          <ExportButton
            resourceName={`Incident_${current.id}`}
            recordCount={1}
            data={[current]}
          />
        </div>
      </div>

      {/* Main Two-Pane Investigation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[720px]">
        {/* Left Pane: Incident Roster & Search (4 cols) */}
        <div className="lg:col-span-4 bg-[#090d16] border border-slate-800/90 rounded flex flex-col overflow-hidden">
          {/* Search & Severity Filters */}
          <div className="p-3 bg-[#0d121f] border-b border-slate-800 space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by case ID, host, or vector..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-[#060911] border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            {/* Severity Tabs (Zero-Pill: Clean segmented control) */}
            <div className="flex items-center bg-[#060911] border border-slate-800 rounded p-0.5 text-[11px] font-mono">
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverityFilter(sev)}
                  className={`flex-1 py-1 text-center rounded transition-colors cursor-pointer ${
                    severityFilter === sev
                      ? 'bg-slate-800 text-slate-100 font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Incident Queue List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredIncidents.map((inc) => {
              const isSelected = inc.id === current.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => selectIncident(inc.id)}
                  className={`p-3 cursor-pointer transition-colors text-xs font-mono space-y-1.5 ${
                    isSelected
                      ? 'bg-[#101728] border-l-2 border-cyan-400 text-slate-100'
                      : 'hover:bg-slate-800/30 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold flex items-center gap-1.5 ${
                          inc.severity === 'CRITICAL'
                            ? 'text-rose-400'
                            : inc.severity === 'HIGH'
                            ? 'text-amber-400'
                            : 'text-cyan-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            inc.severity === 'CRITICAL'
                              ? 'bg-rose-500'
                              : inc.severity === 'HIGH'
                              ? 'bg-amber-400'
                              : 'bg-cyan-400'
                          }`}
                        />
                        <span>{inc.severity}</span>
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 font-bold">{inc.id}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{timeAgo(inc.firstSeen)}</span>
                  </div>

                  <div className="font-sans font-semibold text-xs text-slate-100 truncate">
                    {inc.title}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate">{inc.primaryVictim.hostname}</span>
                    <span className="text-slate-500">{inc.primaryVictim.ip}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/40">
                    <span>{inc.mitreTactics[0]?.technique || inc.mitreTactics[0]?.name || 'T1059'}</span>
                    <span className="text-emerald-400 font-medium">{inc.confidenceScore}% Confidence</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Incident Investigation Dossier (8 cols) */}
        <div className="lg:col-span-8 bg-[#090d16] border border-slate-800/90 rounded flex flex-col overflow-hidden">
          {/* Tactical Dossier Header */}
          <div className="p-4 bg-[#0d121f] border-b border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span
                    className={`font-semibold flex items-center gap-1.5 ${
                      current.severity === 'CRITICAL'
                        ? 'text-rose-400'
                        : current.severity === 'HIGH'
                        ? 'text-amber-400'
                        : 'text-cyan-400'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        current.severity === 'CRITICAL'
                          ? 'bg-rose-500'
                          : current.severity === 'HIGH'
                          ? 'bg-amber-400'
                          : 'bg-cyan-400'
                      }`}
                    />
                    <span>{current.severity} THREAT</span>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{current.id}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-emerald-400">{current.confidenceScore}% Verified</span>
                </div>

                <h2 className="text-base font-bold text-slate-100 font-sans tracking-tight">
                  {current.title}
                </h2>
              </div>

              {/* Disposition & Assignment Selectors */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Operator Assignment Dropdown */}
                <div className="flex items-center gap-1.5 bg-[#060911] border border-slate-700 rounded px-2.5 py-1 text-xs font-mono">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-400">Assignee:</span>
                  <select
                    value={assignedOperators[current.id] || 'Sarah Chen, CISSP (Tier 3 Lead)'}
                    onChange={(e) => setAssignedOperators({ ...assignedOperators, [current.id]: e.target.value })}
                    className="bg-transparent text-slate-200 outline-hidden cursor-pointer"
                    title="Assign incident to SOC Operator"
                  >
                    <option value="Sarah Chen, CISSP (Tier 3 Lead)" className="bg-[#0b121e] text-slate-200">
                      Sarah Chen, CISSP (Tier 3 Lead)
                    </option>
                    <option value="Alex Rivera (Tier 2 SOC)" className="bg-[#0b121e] text-slate-200">
                      Alex Rivera (Tier 2 SOC)
                    </option>
                    <option value="Marcus Vance (OT Lead)" className="bg-[#0b121e] text-slate-200">
                      Marcus Vance (OT Lead)
                    </option>
                    <option value="Elena Rostova (Threat Hunter)" className="bg-[#0b121e] text-slate-200">
                      Elena Rostova (Threat Hunter)
                    </option>
                    <option value="Unassigned" className="bg-[#0b121e] text-slate-400">
                      Unassigned
                    </option>
                  </select>
                </div>

                {/* State Disposition Selector */}
                <div className="flex items-center gap-1.5 bg-[#060911] border border-slate-700 rounded px-2.5 py-1 text-xs font-mono">
                  <span className="text-slate-400">State:</span>
                  <select
                    value={current.state}
                    onChange={(e) => updateIncidentState(current.id, e.target.value as any)}
                    className="bg-transparent text-slate-200 cursor-pointer outline-hidden"
                  >
                    <option value="OPEN" className="bg-[#0b121e]">OPEN (TRIAGE)</option>
                    <option value="INVESTIGATING" className="bg-[#0b121e]">INVESTIGATING</option>
                    <option value="CONTAINED" className="bg-[#0b121e]">CONTAINED</option>
                    <option value="RESOLVED" className="bg-[#0b121e]">RESOLVED</option>
                  </select>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {current.plainEnglishSummary}
            </p>

            {/* Quick Entity Context Bar (Zero-Pill: Clean unboxed metadata) */}
            <div className="p-2.5 rounded bg-[#060911] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span>Victim Host:</span>
                <button
                  type="button"
                  onClick={() =>
                    openContext({
                      type: 'ASSET',
                      id: current.primaryVictim.hostname,
                      title: current.primaryVictim.hostname,
                      subtitle: `IP: ${current.primaryVictim.ip} · Criticality: ${current.primaryVictim.criticality}`,
                    })
                  }
                  className="text-slate-100 hover:text-cyan-300 underline font-semibold cursor-pointer"
                >
                  {current.primaryVictim.hostname} ({current.primaryVictim.ip})
                </button>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <Radio className="w-3.5 h-3.5 text-rose-400" />
                <span>External C2:</span>
                <span className="text-rose-400 font-semibold">
                  {current.threatActor?.ip || '185.220.101.44'} ({current.threatActor?.country || 'NL'})
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>Wire Tap:</span>
                <span className="text-slate-300">tap-core-01 (10G Fiber)</span>
              </div>
            </div>

            {/* Historical State at Detection Time Card */}
            <div className="p-2.5 rounded bg-[#060912] border border-cyan-900/40 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>HISTORICAL STATE AT DETECTION TIME</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  Timestamp: {current.firstSeen || '2026-10-15T09:12:44Z'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                <div className="p-1.5 rounded bg-[#080d1a] border border-slate-800/60">
                  <span className="text-slate-500 block text-[10px]">Historical Visibility:</span>
                  <span className="text-slate-200 font-semibold">94.2% Flow Coverage</span>
                  <span className="text-[10px] text-cyan-400/80 block">Symmetric L2/L3 TAP</span>
                </div>
                <div className="p-1.5 rounded bg-[#080d1a] border border-slate-800/60">
                  <span className="text-slate-500 block text-[10px]">Historical Detector State:</span>
                  <span className="text-slate-200 font-semibold">DET-BEACON-04 Active</span>
                  <span className="text-[10px] text-emerald-400/80 block">Engine v3.2.1 · Latency 14ms</span>
                </div>
                <div className="p-1.5 rounded bg-[#080d1a] border border-slate-800/60">
                  <span className="text-slate-500 block text-[10px]">Historical Operating Mode:</span>
                  <span className="text-emerald-400 font-semibold">ACTIVE_PROTECTION</span>
                  <span className="text-[10px] text-slate-400 block">Kill-Switch: Armed</span>
                </div>
                <div className="p-1.5 rounded bg-[#080d1a] border border-slate-800/60">
                  <span className="text-slate-500 block text-[10px]">Evidence State:</span>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950/80 border border-cyan-700/60 text-cyan-300">
                    VALIDATED
                  </span>
                  <span className="text-[10px] text-slate-400 block">Immutable Block #8819</span>
                </div>
              </div>
            </div>

            {/* Collapsible AI Investigation Advisory Panel */}
            <div className="rounded border border-indigo-950/80 bg-[#070b14] overflow-hidden text-xs font-sans">
              <button
                type="button"
                onClick={() => setIsAiAdvisoryOpen(!isAiAdvisoryOpen)}
                className="w-full px-3 py-2 bg-[#0a0f1d] hover:bg-[#0e1529] border-b border-indigo-950/60 flex items-center justify-between gap-2 text-left cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-slate-200">AI Investigation Advisory</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40 text-indigo-300">
                    AI ADVISORY ONLY • NO AUTHORITY GENERATION • NO UNKNOWN → CERTAINTY CONVERSION
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isAiAdvisoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAiAdvisoryOpen && (
                <div className="p-3 space-y-2.5 text-slate-300 font-sans">
                  {/* 1. Incident Explanation */}
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-indigo-300 uppercase tracking-wide block mb-0.5">
                      1. Incident Explanation
                    </span>
                    <p className="text-xs leading-relaxed text-slate-300">
                      The adversary leveraged a web exploitation vector targeting the IIS Worker Process (<code className="text-slate-200 bg-slate-900 px-1 py-0.5 rounded font-mono">w3wp.exe</code>), spawning an obfuscated PowerShell execution tree. The malware acquired SYSTEM tokens and established persistent outbound TLS beaconing over TCP 443 with a 60-second jitter cadence matching known Cobalt Strike malleable C2 profiles.
                    </p>
                  </div>

                  {/* 2. Evidence Summarization */}
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-indigo-300 uppercase tracking-wide block mb-0.5">
                      2. Evidence Summarization
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 font-mono text-[11px]">
                      <div className="p-2 rounded bg-[#090e1a] border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px]">JA4 Fingerprint:</span>
                        <code className="text-cyan-300 break-all">t13d1516h2_8daaf6152771_0278457224b8</code>
                      </div>
                      <div className="p-2 rounded bg-[#090e1a] border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px]">Wire Footprint:</span>
                        <span className="text-slate-200">48KB Outbound Beacon / 14 Packets</span>
                      </div>
                      <div className="p-2 rounded bg-[#090e1a] border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px]">Lateral Pipe:</span>
                        <code className="text-rose-300">\pipe\svcctl (PsExec RPC)</code>
                      </div>
                    </div>
                  </div>

                  {/* 3. Suggested Pivots */}
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-indigo-300 uppercase tracking-wide block mb-1">
                      3. Suggested Tactical Pivots
                    </span>
                    <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                      <button
                        type="button"
                        onClick={() => setCurrentPath('/investigate/network')}
                        className="px-2.5 py-1 rounded bg-[#101728] hover:bg-[#18233c] border border-cyan-800/50 text-cyan-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Search className="w-3 h-3" />
                        <span>Pivot to Network Flow (JA4: t13d1516h2...)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentPath('/investigate/entities')}
                        className="px-2.5 py-1 rounded bg-[#101728] hover:bg-[#18233c] border border-purple-800/50 text-purple-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Server className="w-3 h-3" />
                        <span>Pivot to Entity Graph ({current.primaryVictim.hostname})</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleExtractPcap}
                        disabled={isExtractingPcap}
                        className="px-2.5 py-1 rounded bg-[#101728] hover:bg-[#18233c] border border-slate-700 text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Download className="w-3 h-3 text-cyan-400" />
                        <span>Extract 100MB Ring Buffer PCAP</span>
                      </button>
                    </div>
                  </div>

                  {/* 4. Response Explanation */}
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-indigo-300 uppercase tracking-wide block mb-0.5">
                      4. Governed Response Rationale
                    </span>
                    <p className="text-xs leading-relaxed text-slate-400">
                      Immediate host quarantine via dual-operator permit is recommended to sever active outbound C2 socket communication while preserving volatile memory on the target host for root-cause forensic acquisition. Automated unilateral action is suppressed under strict governed response rules.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Fast Remediation Action Rail */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRouteToGovernedIsolation}
                  className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    current.state === 'CONTAINED'
                      ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/70 hover:bg-rose-900/80 border border-rose-500/50 text-rose-200'
                  }`}
                  title="Route to Governed Response Studio for dual-custody authorization permit"
                >
                  {current.state === 'CONTAINED' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Host Isolated (Dual-Custody Permit)</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Request Governed Host Isolation</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleRouteToGovernedIsolation}
                  className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    processKilled
                      ? 'bg-slate-800 text-slate-400 border border-slate-700'
                      : 'bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/50 text-amber-200'
                  }`}
                  title="Route to Governed Response Studio for dual-operator execution permit"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{processKilled ? 'Process Tree Terminated' : 'Request Process Kill Permit'}</span>
                </button>

                <button
                  type="button"
                  disabled={isExtractingPcap}
                  onClick={handleExtractPcap}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-slate-200 transition-colors disabled:opacity-50"
                  title="Wire directly to evidenceService.startPcapCapture()"
                >
                  <Download className={`w-3.5 h-3.5 text-cyan-400 ${isExtractingPcap ? 'animate-bounce' : ''}`} />
                  <span>{isExtractingPcap ? 'Extracting Buffer...' : 'Extract 100MB PCAP Slice'}</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-500">
                Evidence Ledger: Block #8819 Verified
              </span>
            </div>
          </div>

          {/* Dossier Tabs: Tree / Timeline / Forensics */}
          <div className="flex items-center px-4 border-b border-slate-800 bg-[#080c14] text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('TREE')}
              className={`py-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'TREE'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Causality Lineage & Process Tree</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('TIMELINE')}
              className={`py-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'TIMELINE'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Correlated Wire & Host Timeline</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('FORENSICS')}
              className={`py-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'FORENSICS'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Forensic Artifacts & Hashes</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('NOTES')}
              className={`py-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'NOTES'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Analyst Notes ({analystNotes[current.id]?.length || 0})</span>
            </button>
          </div>

          {/* Dossier Body */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'TREE' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-400 font-sans">
                  Interactive endpoint process spawning and correlated network wire sockets. Select any node to inspect command lines and cryptographic hashes.
                </div>

                {/* Visual Tree Graph */}
                <div className="space-y-3 font-mono">
                  {processTree.map((node, index) => {
                    const isSelected = selectedProcessNode?.id === node.id;
                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedProcessNode(node)}
                        className={`p-3 rounded border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-[var(--zf-brand-accent-subtle)] border-[var(--zf-brand-accent)] shadow-md ring-1 ring-[var(--zf-brand-accent)]'
                            : node.status === 'MALICIOUS'
                            ? 'bg-rose-500/10 border-rose-500/40 hover:border-rose-500/70'
                            : node.status === 'SUSPICIOUS'
                            ? 'bg-amber-500/10 border-amber-500/40 hover:border-amber-500/70'
                            : 'bg-[var(--zf-surface-card)] border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)]'
                        }`}
                        style={{ marginLeft: `${Math.min(index * 20, 80)}px` }}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold ${
                                node.status === 'MALICIOUS'
                                  ? 'text-rose-400'
                                  : node.status === 'SUSPICIOUS'
                                  ? 'text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            >
                              {node.name}
                            </span>
                            <span className="text-slate-500">·</span>
                            <span className="text-slate-400">PID {node.pid}</span>
                            <span className="text-slate-600">·</span>
                            <span className="text-slate-400">{node.user}</span>
                          </div>

                          <span
                            className={`text-[10px] font-semibold ${
                              node.status === 'MALICIOUS'
                                ? 'text-rose-400'
                                : node.status === 'SUSPICIOUS'
                                ? 'text-amber-400'
                                : 'text-slate-500'
                            }`}
                          >
                            {node.type}
                          </span>
                        </div>

                        <div className="mt-1.5 p-1.5 rounded bg-[#05070c] border border-slate-900 text-[11px] text-slate-300 break-all select-text">
                          <code>{node.cmdline}</code>
                        </div>

                        <div className="mt-1 text-[11px] text-slate-500 font-sans">
                          {node.meta}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Node Details Box */}
                {selectedProcessNode && (
                  <div className="p-3.5 bg-[#080c14] border border-slate-800 rounded space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-300 font-semibold">
                      <span>Node Inspector: {selectedProcessNode.name}</span>
                      <span className="text-cyan-400">{selectedProcessNode.status}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <div>
                        <span className="text-slate-500">Process ID:</span> {selectedProcessNode.pid}
                      </div>
                      <div>
                        <span className="text-slate-500">User Context:</span> {selectedProcessNode.user}
                      </div>
                      {selectedProcessNode.hash && (
                        <div className="col-span-2 break-all">
                          <span className="text-slate-500">SHA-256 Hash:</span>{' '}
                          <code className="text-rose-300">{selectedProcessNode.hash}</code>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'TIMELINE' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded bg-[#080c14] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-cyan-400 font-semibold">19:48:22.408 — WIRE INGRESS</span>
                    <span className="text-slate-500">tap-core-01</span>
                  </div>
                  <div className="text-slate-200">
                    Inbound TLS 1.3 Client Hello received on 10.140.2.88:443 from Netherlands IP 185.220.101.44
                  </div>
                  <div className="text-[11px] text-slate-500">
                    JA4 fingerprint t13d1516h2_8daaf6152771 matches Cobalt Strike malleable C2 profile.
                  </div>
                </div>

                <div className="p-3 rounded bg-[#080c14] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-amber-400 font-semibold">19:48:23.102 — HOST EXECUTION</span>
                    <span className="text-slate-500">Sysmon Event 1</span>
                  </div>
                  <div className="text-slate-200">
                    w3wp.exe spawned cmd.exe with encoded PowerShell payload
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Parent PID 3108 ➔ Child PID 4920 · Base64 payload decoded to download stage-2 beacon.
                  </div>
                </div>

                <div className="p-3 rounded bg-[#080c14] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-rose-400 font-semibold">19:48:24.890 — LATERAL WIRE MOVEMENT</span>
                    <span className="text-slate-500">Wire Frame #8812901</span>
                  </div>
                  <div className="text-slate-200">
                    SMB/RPC Named Pipe binding to Domain Controller (10.140.10.5)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Attempted PsExec service creation on \pipe\svcctl without valid Kerberos ticket.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'FORENSICS' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#080c14] border border-slate-800 rounded space-y-2">
                  <div className="text-slate-300 font-semibold">Cryptographic Artifacts & IOC Ledger</div>
                  <div className="space-y-1.5 text-[11px]">
                    <div>
                      <span className="text-slate-500">Primary Malicious Binary:</span>{' '}
                      <span className="text-slate-200">svchost_upd.exe</span>
                    </div>
                    <div className="break-all">
                      <span className="text-slate-500">SHA-256 Hash:</span>{' '}
                      <code className="text-rose-400">
                        a93f8e42b109c0d38194e21a8d424b91fe203a1194248a80194812f840912e84
                      </code>
                    </div>
                    <div>
                      <span className="text-slate-500">C2 Server JA4:</span>{' '}
                      <code className="text-cyan-400">t13d1516h2_8daaf6152771_0278457224b8</code>
                    </div>
                    <div>
                      <span className="text-slate-500">Evidence Block Hash:</span>{' '}
                      <code className="text-emerald-400">0x7f48b901a92e1048b2914092b1a8</code>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#080c14] border border-slate-800 rounded space-y-1 text-slate-400">
                  <div className="text-slate-300 font-semibold">Notary Chain-of-Custody Verification</div>
                  <p className="text-[11px] leading-relaxed">
                    All packet metadata, flow records, and Sysmon process events are cryptographically sealed in the immutable evidence ledger under NIST SP 800-86 standard guidelines.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'NOTES' && (
              <div className="space-y-4 font-sans text-xs">
                {/* Note creation box */}
                <div className="p-3.5 bg-[#080c14] border border-slate-800 rounded space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Record Tactical Analyst Note</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Operator: Sarah Chen, CISSP (Tier 3 Lead)
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Enter case observations, correlation findings, or mitigation actions taken..."
                    className="w-full bg-[#05080f] border border-slate-700/80 rounded p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 font-sans"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Notes are timestamped and cryptographically indexed into the case ledger
                    </span>
                    <button
                      type="button"
                      onClick={handleAddNote}
                      disabled={!newNoteText.trim()}
                      className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Note</span>
                    </button>
                  </div>
                </div>

                {/* Notes log timeline */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                    Case Activity & Notes History ({analystNotes[current.id]?.length || 0})
                  </span>
                  {(!analystNotes[current.id] || analystNotes[current.id].length === 0) ? (
                    <div className="p-4 text-center text-slate-500 text-xs rounded border border-slate-800 bg-[#060912]">
                      No analyst notes recorded yet for Case {current.id}.
                    </div>
                  ) : (
                    analystNotes[current.id].map((note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded bg-[#080d19] border border-slate-800/80 space-y-1.5 font-sans"
                      >
                        <div className="flex items-center justify-between text-[11px] border-b border-slate-800/50 pb-1">
                          <span className="font-semibold text-cyan-300 font-mono flex items-center gap-1.5">
                            <UserCheck className="w-3 h-3 text-cyan-400" />
                            <span>{note.author}</span>
                          </span>
                          <span className="text-slate-500 font-mono text-[10px]">
                            {note.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Structured Case Report Modal */}
      {isReportOpen && (
        <StructuredIncidentReportModal
          incident={current}
          onClose={() => setIsReportOpen(false)}
        />
      )}
    </div>
  );
};
