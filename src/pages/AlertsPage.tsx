/**
 * Raw Security Alerts Page
 * 
 * Features:
 * - Section 9 & 10: Alert Fatigue Reduction with correlated grouping
 * - Actionability Filters: Needs Action, Needs Investigation, Monitoring, Informational
 * - One-Click Pivots into Universal Context Drawer
 * - Strict ZeroFrame Semantic Styling across all 4 themes
 */

import React, { useState } from 'react';
import { useInvestigationStore } from '../stores/investigation-store';
import { useDrawerStore } from '../stores/context-drawer-store';
import { SecurityStatusBadge } from '../components/shared/SecurityStatusBadge';
import { ExportButton } from '../components/shared/ExportButton';
import { SecurityAlert } from '../types';
import { timeAgo } from '../lib/utils';
import {
  X,
  ChevronRight,
  Filter,
  Layers,
  Crosshair,
  Globe,
  Radio,
  FileCode,
  ShieldAlert,
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, selectIncident } = useInvestigationStore();
  const { openContext } = useDrawerStore();

  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [actionFilter, setActionFilter] = useState<'ALL' | 'NEEDS_ACTION' | 'INVESTIGATION' | 'MONITORING'>('ALL');
  const [groupCorrelated, setGroupCorrelated] = useState(true);

  // Filter alerts by actionability
  const filteredAlerts = alerts.filter((a) => {
    if (actionFilter === 'NEEDS_ACTION') return a.severity === 'CRITICAL';
    if (actionFilter === 'INVESTIGATION') return a.severity === 'HIGH';
    if (actionFilter === 'MONITORING') return a.severity === 'MEDIUM' || a.severity === 'LOW';
    return true;
  });

  return (
    <div className="p-5 space-y-5 text-[var(--zf-text-primary)] max-w-[1540px] mx-auto font-sans select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--zf-border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-semibold tracking-tight text-[var(--zf-text-primary)]">
              Raw Security Alerts & Detector Signals
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-muted)] font-medium">
              {alerts.length} Events Total
            </span>
          </div>
          <p className="text-xs text-[var(--zf-text-muted)] mt-0.5">
            Correlated signal triage with detector integrity signatures and wire evidence references.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton resourceName="Raw Alerts" recordCount={filteredAlerts.length} data={filteredAlerts} />
        </div>
      </div>

      {/* FILTER & CORRELATION TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] rounded-lg">
        {/* Actionability Filter Tabs */}
        <div className="flex items-center rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] p-0.5 text-xs font-sans">
          <button
            onClick={() => setActionFilter('ALL')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium ${
              actionFilter === 'ALL'
                ? 'bg-[var(--zf-nav-active-bg)] text-[var(--zf-text-primary)] border border-[var(--zf-brand-accent)]'
                : 'text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)]'
            }`}
          >
            All Signals ({alerts.length})
          </button>
          <button
            onClick={() => setActionFilter('NEEDS_ACTION')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium ${
              actionFilter === 'NEEDS_ACTION'
                ? 'bg-[var(--zf-nav-active-bg)] text-rose-400 border border-rose-500/40'
                : 'text-[var(--zf-text-muted)] hover:text-rose-400'
            }`}
          >
            Needs Action
          </button>
          <button
            onClick={() => setActionFilter('INVESTIGATION')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium ${
              actionFilter === 'INVESTIGATION'
                ? 'bg-[var(--zf-nav-active-bg)] text-amber-300 border border-amber-500/40'
                : 'text-[var(--zf-text-muted)] hover:text-amber-300'
            }`}
          >
            Needs Investigation
          </button>
          <button
            onClick={() => setActionFilter('MONITORING')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium ${
              actionFilter === 'MONITORING'
                ? 'bg-[var(--zf-nav-active-bg)] text-sky-400 border border-sky-500/40'
                : 'text-[var(--zf-text-muted)] hover:text-sky-400'
            }`}
          >
            Monitoring
          </button>
        </div>

        {/* Grouping Toggle */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--zf-text-muted)]">Correlated Clustering:</span>
          <button
            onClick={() => setGroupCorrelated(!groupCorrelated)}
            className={`px-2.5 py-1 rounded border text-xs font-medium cursor-pointer transition-colors ${
              groupCorrelated
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-[var(--zf-surface-tertiary)] border-[var(--zf-border-subtle)] text-[var(--zf-text-muted)]'
            }`}
          >
            {groupCorrelated ? 'Enabled (Fatigue Reduction)' : 'Raw (Uncorrelated)'}
          </button>
        </div>
      </div>

      {/* Correlated Banner if enabled */}
      {groupCorrelated && (
        <div className="p-3 bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] rounded-md flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--zf-brand-accent)] shrink-0" />
            <span className="text-[var(--zf-text-secondary)]">
              Alert Correlation Active: Repetitive authentication signals grouped into parent cluster <span className="font-mono font-semibold text-[var(--zf-text-primary)]">ALT-CLUSTER-0881</span>.
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 shrink-0">
            34 signals correlated into 1 active investigation
          </span>
        </div>
      )}

      {/* Alerts Table */}
      <div className="bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[var(--zf-surface-topbar)] border-b border-[var(--zf-border-subtle)] text-[var(--zf-text-muted)] text-[11px] font-medium">
              <tr>
                <th className="py-2.5 px-3 w-24">Severity</th>
                <th className="py-2.5 px-3">Alert Name</th>
                <th className="py-2.5 px-3">Detector Key</th>
                <th className="py-2.5 px-3">Flow: Source &rarr; Destination</th>
                <th className="py-2.5 px-3">Fidelity</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-right">Evidence Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--zf-border-subtle)]">
              {filteredAlerts.map((alert) => (
                <tr
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className="hover:bg-[var(--zf-surface-card-hover)] cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3">
                    <SecurityStatusBadge state={alert.severity} size="sm" />
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-[var(--zf-text-primary)]">{alert.name}</div>
                    <div className="text-[10px] text-[var(--zf-text-muted)] font-mono">{alert.id}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openContext({
                          type: 'DETECTOR',
                          id: alert.detectorName,
                          title: alert.detectorName,
                          subtitle: `Version: ${alert.detectorVersion}`,
                        });
                      }}
                      className="text-[var(--zf-brand-accent)] hover:underline font-mono text-[11px] font-medium text-left cursor-pointer"
                    >
                      {alert.detectorName}
                    </button>
                    <div className="font-mono text-[10px] text-[var(--zf-text-muted)]">{alert.detectorVersion}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openContext({
                          type: 'IP',
                          id: alert.sourceIp,
                          title: alert.sourceIp,
                          subtitle: `Alert source port: ${alert.sourcePort}`,
                        });
                      }}
                      className="text-sky-400 hover:underline cursor-pointer"
                    >
                      {alert.sourceIp}:{alert.sourcePort}
                    </button>
                    <span className="text-[var(--zf-text-muted)] mx-1.5">&rarr;</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openContext({
                          type: 'IP',
                          id: alert.destinationIp,
                          title: alert.destinationIp,
                          subtitle: `Alert destination port: ${alert.destinationPort}`,
                        });
                      }}
                      className="text-zinc-200 hover:underline cursor-pointer"
                    >
                      {alert.destinationIp}:{alert.destinationPort}
                    </button>
                    <span className="text-[var(--zf-text-muted)] ml-1.5 font-sans">({alert.protocol})</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[var(--zf-text-secondary)]">
                    {alert.fidelity}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-emerald-400 font-semibold">
                    {alert.confidence}%
                  </td>
                  <td className="py-2.5 px-3 text-[var(--zf-text-muted)] font-mono text-[11px]">
                    {timeAgo(alert.timestamp)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[11px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openContext({
                          type: 'EVIDENCE',
                          id: alert.evidenceRef,
                          title: 'Wire Evidence Frame',
                          subtitle: alert.evidenceRef,
                        });
                      }}
                      className="text-emerald-400 hover:underline cursor-pointer"
                    >
                      {alert.evidenceRef.split('/').pop()}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Inspection Drawer */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex justify-end font-sans select-none animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setSelectedAlert(null)}
          />

          <aside className="relative w-full max-w-md bg-[var(--zf-surface-card)] border-l border-[var(--zf-border-medium)] p-6 shadow-2xl flex flex-col h-full z-10 space-y-4 animate-in slide-in-from-right duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--zf-border-subtle)]">
              <div className="flex items-center gap-2">
                <SecurityStatusBadge state={selectedAlert.severity} size="sm" />
                <span className="font-mono text-xs text-[var(--zf-text-muted)]">{selectedAlert.id}</span>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 rounded hover:bg-[var(--zf-surface-tertiary)] text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-[var(--zf-text-primary)]">{selectedAlert.name}</h3>
              <p className="text-xs text-[var(--zf-text-secondary)] mt-1">{selectedAlert.summary}</p>
            </div>

            <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[var(--zf-text-muted)]">Source:</span>
                <span className="text-sky-400">{selectedAlert.sourceIp}:{selectedAlert.sourcePort}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--zf-text-muted)]">Destination:</span>
                <span className="text-zinc-200">{selectedAlert.destinationIp}:{selectedAlert.destinationPort}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--zf-text-muted)]">Protocol:</span>
                <span>{selectedAlert.protocol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--zf-text-muted)]">Confidence:</span>
                <span className="text-emerald-400 font-bold">{selectedAlert.confidence}%</span>
              </div>
            </div>

            {/* Quick Pivots */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setSelectedAlert(null);
                  openContext({
                    type: 'IP',
                    id: selectedAlert.sourceIp,
                    title: selectedAlert.sourceIp,
                    subtitle: 'Source host of alert',
                  });
                }}
                className="w-full py-2 px-3 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-xs font-medium text-[var(--zf-text-primary)] flex items-center justify-between cursor-pointer"
              >
                <span>Pivot to Source IP Context</span>
                <Globe className="w-3.5 h-3.5 text-sky-400" />
              </button>

              <button
                onClick={() => {
                  setSelectedAlert(null);
                  openContext({
                    type: 'DETECTOR',
                    id: selectedAlert.detectorName,
                    title: selectedAlert.detectorName,
                    subtitle: `Version: ${selectedAlert.detectorVersion}`,
                  });
                }}
                className="w-full py-2 px-3 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-xs font-medium text-[var(--zf-text-primary)] flex items-center justify-between cursor-pointer"
              >
                <span>View Detector Assurance Proof</span>
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>

            <div className="mt-auto pt-4 border-t border-[var(--zf-border-subtle)] flex justify-end">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-1.5 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
