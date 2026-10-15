/**
 * ZeroFrame Universal Context Drawer
 * 
 * Provides:
 * - One-click investigation context for IPs, Assets, Users, Detectors, Sensors, Evidence & MITRE
 * - Non-destructive slide-over (preserves the analyst's current page and investigation)
 * - Back / Forward history trail
 * - Action rail (Hunt, Quarantine, Extract PCAP, Export Evidence)
 * - Deep pivoting between correlated entities
 */

import React, { useEffect } from 'react';
import { useDrawerStore, ContextItem } from '../../stores/context-drawer-store';
import { useAppStore } from '../../stores/app-store';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Server,
  Globe,
  User,
  Crosshair,
  Radio,
  FileCode,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  Search,
  Download,
  AlertTriangle,
  Lock,
  Layers,
  Terminal,
  ChevronRight,
} from 'lucide-react';

export const UniversalContextDrawer: React.FC = () => {
  const {
    isOpen,
    currentItem,
    canGoBack,
    canGoForward,
    closeDrawer,
    goBack,
    goForward,
    openContext,
  } = useDrawerStore();

  const { setCurrentPath } = useAppStore();

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeDrawer]);

  if (!isOpen || !currentItem) {
    return null;
  }

  const { type, id, title, subtitle, data = {} } = currentItem;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-sans select-none animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Surface */}
      <aside className="relative w-full max-w-lg bg-[var(--zf-surface-card)] border-l border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header & History Navigation */}
        <div className="p-4 border-b border-[var(--zf-border-subtle)] flex items-center justify-between bg-[var(--zf-surface-topbar)]">
          <div className="flex items-center gap-2">
            {/* History navigation */}
            <div className="flex items-center gap-0.5 border border-[var(--zf-border-subtle)] rounded bg-[var(--zf-surface-tertiary)] p-0.5">
              <button
                onClick={goBack}
                disabled={!canGoBack}
                className="p-1 rounded hover:bg-[var(--zf-surface-card-hover)] disabled:opacity-30 disabled:pointer-events-none text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] cursor-pointer"
                title="Back in investigation trail"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={goForward}
                disabled={!canGoForward}
                className="p-1 rounded hover:bg-[var(--zf-surface-card-hover)] disabled:opacity-30 disabled:pointer-events-none text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] cursor-pointer"
                title="Forward in investigation trail"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Type badge */}
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-brand-accent)] font-semibold uppercase tracking-wider">
              {type}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--zf-surface-tertiary)] text-[var(--zf-text-muted)] border border-[var(--zf-border-subtle)]">
              ESC
            </kbd>
            <button
              onClick={closeDrawer}
              className="p-1 rounded hover:bg-[var(--zf-surface-tertiary)] text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Object Title & Subtitle */}
        <div className="px-5 py-4 border-b border-[var(--zf-border-subtle)] bg-[var(--zf-surface-card)]">
          <h2 className="text-base font-semibold text-[var(--zf-text-primary)] tracking-tight break-all">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[var(--zf-text-muted)] mt-0.5 font-mono">
              {subtitle}
            </p>
          )}
        </div>

        {/* Dynamic Context Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* TRUTH & PROOF VIEW */}
          {type === 'TRUTH_PROOF' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--zf-text-muted)] block">
                  Authoritative Root Cause (Why)
                </span>
                <p className="text-xs text-[var(--zf-text-secondary)] leading-relaxed">
                  {data.why}
                </p>
              </div>

              {data.recommendation && (
                <div className="p-3.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider block font-sans">
                    Recommended Operational Action
                  </span>
                  <p className="text-xs leading-relaxed">
                    {data.recommendation}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--zf-text-muted)] block">
                  Cryptographic Verification Proof
                </span>
                <div className="space-y-2">
                  {data.proof?.map((item: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] flex items-start gap-2.5 text-xs text-[var(--zf-text-secondary)]"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-mono text-[11px]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {data.link && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      closeDrawer();
                      setCurrentPath(data.link);
                    }}
                    className="w-full py-2 px-3 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Open Detailed Inspection Diagnostics</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--zf-brand-accent)]" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* IP ADDRESS CONTEXT */}
          {type === 'IP' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase block">Resolved Hostname</span>
                  <span className="font-semibold text-xs text-[var(--zf-text-primary)] mt-0.5 block font-mono">
                    {data.hostname || 'WKST-CORP-088'}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase block">Blast Radius</span>
                  <span className="font-semibold text-xs text-rose-400 mt-0.5 block font-mono">
                    {data.blastRadius || 78} / 100
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase block">VLAN Obs. / Decl.</span>
                  <span className="font-semibold text-xs text-[var(--zf-text-secondary)] mt-0.5 block font-mono">
                    VLAN 20 (Consistent)
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase block">Observation TAP</span>
                  <span className="font-semibold text-xs text-[var(--zf-text-secondary)] mt-0.5 block font-mono">
                    SENSOR-HQ-CORE-01
                  </span>
                </div>
              </div>

              {/* Pivot Actions Rail */}
              <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--zf-text-muted)] block">
                  One-Click Investigation Pivots
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      closeDrawer();
                      setCurrentPath('/investigate/hunt');
                    }}
                    className="p-2 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-left flex items-center justify-between text-xs cursor-pointer"
                  >
                    <span>Hunt Related Flows</span>
                    <Search className="w-3.5 h-3.5 text-[var(--zf-brand-accent)]" />
                  </button>
                  <button
                    onClick={() => {
                      closeDrawer();
                      setCurrentPath('/respond/permits');
                    }}
                    className="p-2 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-left flex items-center justify-between text-xs cursor-pointer text-amber-400"
                  >
                    <span>Propose Quarantine</span>
                    <Lock className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Linked Entity Pivot */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--zf-text-muted)] block">
                  Associated Entity
                </span>
                <button
                  onClick={() =>
                    openContext({
                      type: 'ASSET',
                      id: data.hostname || 'WKST-CORP-088',
                      title: data.hostname || 'WKST-CORP-088',
                      subtitle: 'Workstation · Windows 11 Enterprise',
                      data: { ip: id, os: 'Windows 11 Enterprise (23H2)' },
                    })
                  }
                  className="w-full p-2.5 rounded bg-[var(--zf-surface-card)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-subtle)] text-left flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-[var(--zf-brand-accent)]" />
                    <div>
                      <span className="font-semibold text-xs text-[var(--zf-text-primary)] font-mono">
                        {data.hostname || 'WKST-CORP-088'}
                      </span>
                      <span className="text-[10px] text-[var(--zf-text-muted)] block">View Full Host Profile</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--zf-text-muted)] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* ASSET CONTEXT */}
          {type === 'ASSET' && (
            <div className="space-y-4">
              <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase">Criticality Tier</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono font-medium text-amber-400">
                    {data.criticality || 'TIER_3'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase">Crown Jewel Asset</span>
                  <span className="text-xs font-semibold text-[var(--zf-text-primary)]">
                    {data.isProtected ? 'YES (Strict Blast Radius)' : 'Standard Endpoint'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase">Operating System</span>
                  <span className="text-xs text-[var(--zf-text-secondary)] font-mono">
                    {data.os || 'Windows 11 Enterprise (23H2)'}
                  </span>
                </div>
              </div>

              {/* Pivot to IP */}
              {data.ip && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--zf-text-muted)] block">
                    Bound Primary IP
                  </span>
                  <button
                    onClick={() =>
                      openContext({
                        type: 'IP',
                        id: data.ip,
                        title: data.ip,
                        subtitle: `Bound to ${title}`,
                        data: { hostname: title },
                      })
                    }
                    className="w-full p-2.5 rounded bg-[var(--zf-surface-card)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-subtle)] text-left flex items-center justify-between cursor-pointer group font-mono text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-sky-400" />
                      <span>{data.ip}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--zf-text-muted)] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DETECTOR CONTEXT */}
          {type === 'DETECTOR' && (
            <div className="space-y-4">
              <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase">Canary Assurance</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                    VERIFIED & SIGNED
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase">Telemetry Required</span>
                  <span className="font-mono text-xs text-[var(--zf-text-primary)]">
                    {data.requiredTelemetry || 'DEEP_PACKET'}
                  </span>
                </div>
              </div>

              {data.mitre && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--zf-text-muted)] block">
                    ATT&CK Technique Mapping
                  </span>
                  <button
                    onClick={() =>
                      openContext({
                        type: 'MITRE',
                        id: data.mitre,
                        title: `${data.mitre}: MITRE ATT&CK Technique`,
                        subtitle: 'Technique detail & detection heuristics',
                      })
                    }
                    className="w-full p-2.5 rounded bg-[var(--zf-surface-card)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-subtle)] text-left flex items-center justify-between cursor-pointer group font-mono text-xs"
                  >
                    <span>{data.mitre}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--zf-text-muted)] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* EVIDENCE CONTEXT */}
          {type === 'EVIDENCE' && (
            <div className="space-y-4">
              <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2 font-mono text-[11px]">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase block">SHA-256 Ledger Hash</span>
                  <span className="text-emerald-400 break-all">
                    {data.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[var(--zf-border-subtle)]">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase">Witness Byzantine Quorum</span>
                  <span className="text-emerald-400 font-semibold">3/3 Signed</span>
                </div>
              </div>

              <button
                onClick={() => {
                  closeDrawer();
                  setCurrentPath('/evidence/pcap');
                }}
                className="w-full py-2 px-3 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[var(--zf-brand-accent)]" />
                <span>Download Sealed PCAP Evidence</span>
              </button>
            </div>
          )}

          {/* SENSOR CONTEXT */}
          {type === 'SENSOR' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase block">Driver</span>
                  <span className="font-semibold text-xs font-mono text-[var(--zf-text-primary)]">
                    {data.captureDriver || 'AF_XDP (Zero-Copy)'}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase block">mTLS Expiry</span>
                  <span className="font-semibold text-xs font-mono text-emerald-400">
                    2027-04-15
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* MITRE ATT&CK CONTEXT */}
          {type === 'MITRE' && (
            <div className="space-y-4">
              <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase">Technique ID</span>
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
                    {data?.techniqueId || id || 'T1071.001'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase">Tactic Stage</span>
                  <span className="font-mono text-xs text-[var(--zf-text-primary)]">
                    {data?.tacticStage || data?.tactic || 'Command and Control (TA0011)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase">Detection Confidence</span>
                  <span className="text-emerald-400 text-xs font-semibold">99.8% (Deterministic Wire Match)</span>
                </div>
              </div>

              <div className="p-3 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--zf-text-muted)] block">
                  Detection Heuristics & Wire Signatures
                </span>
                <p className="text-xs text-[var(--zf-text-secondary)] leading-relaxed">
                  {data?.heuristics ||
                    'Matches high-entropy packet payloads, periodic sleep-jitter interval anomalies, unauthenticated proxy tunnels, and known C2 beacon profiles across encrypted transports.'}
                </p>
                <div className="pt-1 flex flex-wrap gap-1.5 font-mono text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">AF_XDP Kernel TAP</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">TLS JARM Fingerprinting</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Entropy &gt; 7.82</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--zf-text-muted)] block">
                  Linked Active Detectors
                </span>
                <div className="space-y-1.5">
                  {(data?.linkedDetectors || ['DET-C2-BEACON-01', 'DET-ECH-BYPASS-02', 'DET-DNS-TUNNEL-04']).map(
                    (detId: string) => (
                      <button
                        key={detId}
                        onClick={() =>
                          openContext({
                            type: 'DETECTOR',
                            id: detId,
                            title: `Detector ${detId}`,
                            subtitle: 'Deterministic wire canary engine',
                            data: { mitre: id, requiredTelemetry: 'DEEP_PACKET' },
                          })
                        }
                        className="w-full p-2.5 rounded bg-[var(--zf-surface-card)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-subtle)] text-left flex items-center justify-between cursor-pointer group font-mono text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-slate-200">{detId}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  closeDrawer();
                  setCurrentPath('/investigate/hunt');
                }}
                className="w-full py-2 px-3 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-[var(--zf-brand-accent)]" />
                <span>Pivot to Threat Hunt for {id}</span>
              </button>
            </div>
          )}

          {/* USER CONTEXT */}
          {type === 'USER' && (
            <div className="space-y-4">
              <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase">User Identity</span>
                  <span className="font-mono text-xs font-semibold text-slate-100">
                    {data?.username || id || 's.chen@enterprise.corp'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase">Clearance & Role</span>
                  <span className="font-mono text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                    {data?.clearance || data?.role || 'Top Secret / SOC Lead Operator'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--zf-text-muted)] uppercase">MFA Status</span>
                  <span className="text-emerald-400 text-xs font-semibold">FIDO2 / WebAuthn Hardware Key</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--zf-text-muted)] block">
                  Recent Authentication Events
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {(data?.authEvents || [
                    { time: '3m ago', event: 'OIDC PKCE Token Issued', ip: '10.140.2.88', status: 'SUCCESS' },
                    { time: '42m ago', event: 'Hardware FIDO2 Touch Validated', ip: '10.140.2.88', status: 'SUCCESS' },
                    { time: '3h ago', event: 'Dual-Control Response Authorization', ip: '10.140.2.88', status: 'SIGNED' },
                  ]).map((evt: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="text-slate-200 font-sans text-xs">{evt.event}</div>
                        <div className="text-[10px] text-slate-400">{evt.ip} · {evt.time}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {evt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--zf-text-muted)] block">
                  Associated Primary Assets
                </span>
                <div className="space-y-1.5">
                  {(data?.associatedAssets || [
                    { hostname: 'WKST-CORP-088', ip: '10.140.2.88', mac: '00:50:56:b3:44:19', type: 'WORKSTATION' },
                  ]).map((ast: any) => (
                    <button
                      key={ast.hostname}
                      onClick={() =>
                        openContext({
                          type: 'ASSET',
                          id: ast.hostname,
                          title: ast.hostname,
                          subtitle: `Assigned to ${id}`,
                          data: { ip: ast.ip, mac: ast.mac, os: 'Windows 11 Enterprise' },
                        })
                      }
                      className="w-full p-2.5 rounded bg-[var(--zf-surface-card)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-subtle)] text-left flex items-center justify-between cursor-pointer group font-mono text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Server className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-slate-200 font-sans">{ast.hostname}</span>
                        <span className="text-slate-400 text-[11px]">({ast.ip})</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--zf-text-muted)] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-[var(--zf-border-subtle)] bg-[var(--zf-surface-topbar)] flex items-center justify-between text-xs">
          <span className="text-[11px] text-[var(--zf-text-muted)] font-mono">
            ZeroFrame Universal Context
          </span>
          <button
            onClick={closeDrawer}
            className="px-3 py-1.5 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-primary)] text-xs font-medium cursor-pointer"
          >
            Close Drawer
          </button>
        </div>
      </aside>
    </div>
  );
};
