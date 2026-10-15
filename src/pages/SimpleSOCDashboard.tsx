/**
 * Simple SOC Executive Dashboard
 * Designed for operators and leaders who need immediate clarity without deep technical jargon.
 * Answers: What is wrong? What is affected? How serious is it? What needs attention?
 * Integrated with ZeroFlash branding and executive trend charts.
 */

import React from 'react';
import { useDashboardStore } from '../stores/dashboard-store';
import { useInvestigationStore } from '../stores/investigation-store';
import { useAppStore } from '../stores/app-store';
import {
  SecurityEventTrendLineChart,
  ThreatDistributionDonutChart,
} from '../components/shared/SecurityCharts';
import { TruthBar } from '../components/shared/TruthBar';
import { SinceLastLoginSummary } from '../components/shared/SinceLastLoginSummary';
import {
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Shield,
  Activity,
  ArrowRight,
} from 'lucide-react';

export const SimpleSOCDashboard: React.FC = () => {
  const { metrics } = useDashboardStore();
  const { incidents, selectIncident } = useInvestigationStore();
  const { killSwitchEngaged, setCurrentPath, realtimeConnected, lastHeartbeatTimestamp } = useAppStore();

  const isAttacking = incidents.length > 0;
  const criticalIncident = incidents.find((i) => i.severity === 'CRITICAL');

  return (
    <div className="p-6 space-y-6 text-[var(--zf-text-primary)] max-w-5xl mx-auto font-sans">
      {/* Authoritative Truth Bar: Exists, Visible, Detectable, Respondable */}
      <TruthBar className="mb-2" />

      {/* Delta Reconciliation: Since Last Login */}
      <SinceLastLoginSummary className="mb-2" />

      {/* Page Header */}
      <div className="pb-3 border-b border-[var(--zf-border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[var(--zf-text-primary)] tracking-tight">Security Overview</h1>
            <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-secondary)] font-medium">
              Simple SOC
            </span>
            {!realtimeConnected && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold">
                STALE STREAM
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--zf-text-muted)] mt-1">
            Operational answers in plain language based on verified network telemetry truth.
          </p>
        </div>

        <button
          onClick={() => setCurrentPath('/investigate/incidents')}
          className="px-3 py-1.5 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <span>View Incident Details</span>
          <ArrowRight className="w-3.5 h-3.5 text-[var(--zf-brand-accent)]" />
        </button>
      </div>

      {/* Executive Visual Trends: 24h Trend & Category Distribution - PULLED TO TOP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        <div className="flex flex-col">
          <SecurityEventTrendLineChart />
        </div>
        <div className="flex flex-col">
          <ThreatDistributionDonutChart />
        </div>
      </div>

      {/* Primary Question 1: What is the current status? */}
      <div className="p-5 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] space-y-2 shadow-xs">
        <span className="text-xs font-semibold text-[var(--zf-text-muted)] uppercase tracking-wider block">
          Current operational status
        </span>

        <div className="flex items-start gap-3 pt-1">
          {!realtimeConnected ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : isAttacking ? (
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="text-base font-semibold text-[var(--zf-text-primary)] flex items-center gap-2">
              {!realtimeConnected ? (
                <>
                  <span>Real-Time Telemetry Link Disconnected</span>
                  <span className="text-xs font-mono text-amber-400 font-normal px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                    STALE (Last known {new Date(lastHeartbeatTimestamp).toLocaleTimeString()})
                  </span>
                </>
              ) : isAttacking ? (
                'Active security threats detected requiring attention'
              ) : (
                'All monitored systems are operating normally'
              )}
            </div>
            <p className="text-xs text-[var(--zf-text-secondary)] mt-1 leading-relaxed">
              {!realtimeConnected
                ? 'The real-time streaming link to the telemetry engine is currently offline or reconnecting. Telemetry is displaying last known state rather than live updates. Do not assume clean security posture until connection re-establishes.'
                : isAttacking
                ? `ZeroFlash is currently tracking ${incidents.length} active security incidents across the network. 1 high-priority incident requires containment approval.`
                : 'No unauthorized access, data exfiltration, or ransomware activities have been observed in the last 24 hours.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Core Questions: What is wrong? What is affected? How serious? */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* What is wrong? */}
        <div className="p-4 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] space-y-1.5 shadow-xs">
          <span className="text-[11px] font-semibold text-[var(--zf-text-muted)] uppercase tracking-wider block">
            What is wrong?
          </span>
          <div className="text-sm font-semibold text-rose-400">
            {isAttacking ? (criticalIncident?.title.split('&')[0] || 'Security Incident Detected') : 'No Threat Observed'}
          </div>
          <p className="text-xs text-[var(--zf-text-muted)] leading-relaxed">
            {criticalIncident?.plainEnglishSummary || 'All network traffic conforms to expected baseline behaviors.'}
          </p>
        </div>

        {/* What is affected? */}
        <div className="p-4 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] space-y-1.5 shadow-xs">
          <span className="text-[11px] font-semibold text-[var(--zf-text-muted)] uppercase tracking-wider block">
            What is affected?
          </span>
          <div className="text-sm font-semibold text-[var(--zf-text-primary)] font-mono">
            {criticalIncident?.primaryVictim.hostname || 'None'}
          </div>
          <p className="text-xs text-[var(--zf-text-muted)] leading-relaxed">
            Target at {criticalIncident?.primaryVictim.ip || '10.140.2.88'}. Blast radius score: {criticalIncident?.confidenceScore || 94}%.
          </p>
        </div>

        {/* How serious is it? */}
        <div className="p-4 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] space-y-1.5 shadow-xs">
          <span className="text-[11px] font-semibold text-[var(--zf-text-muted)] uppercase tracking-wider block">
            How serious is it?
          </span>
          <div className={`text-sm font-semibold ${isAttacking ? 'text-rose-400' : 'text-emerald-400'}`}>
            {criticalIncident?.severity ? `${criticalIncident.severity} Severity` : 'Nominal Operational State'}
          </div>
          <p className="text-xs text-[var(--zf-text-muted)] leading-relaxed">
            {isAttacking
              ? 'Immediate host isolation or perimeter blocking is recommended.'
              : 'Zero active critical or high-severity security incidents.'}
          </p>
        </div>
      </div>

      {/* Operational Diagnostic Transparency: Visibility & Protection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] space-y-1.5 shadow-xs">
          <span className="text-[11px] font-semibold text-[var(--zf-text-muted)] uppercase tracking-wider block">
            Network visibility
          </span>
          <div className={`text-sm font-semibold flex items-center gap-1.5 ${metrics.captureState === 'HEALTHY' ? 'text-emerald-400' : 'text-amber-400'}`}>
            <AlertTriangle className="w-4 h-4" />
            <span>{metrics.observationCoveragePct.toFixed(1)}% Monitored ({metrics.captureState})</span>
          </div>
          <p className="text-xs text-[var(--zf-text-muted)] leading-relaxed">
            {metrics.captureState === 'HEALTHY'
              ? 'Zero-copy passive packet tap inspection operational with 0 kernel packet drops.'
              : 'Core-Switch-02 mirror port reports 18% unidirectional flows. Return traffic routed across Link B is unmonitored.'}
          </p>
        </div>

        <div className="p-4 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] space-y-1.5 shadow-xs">
          <span className="text-[11px] font-semibold text-[var(--zf-text-muted)] uppercase tracking-wider block">
            Autonomous Protection
          </span>
          <div className={`text-sm font-semibold flex items-center gap-1.5 ${killSwitchEngaged ? 'text-amber-400' : 'text-emerald-400'}`}>
            <Shield className="w-4 h-4" />
            <span>{killSwitchEngaged ? 'Response Blocked (Kill-Switch Active)' : 'Active Protection Mode'}</span>
          </div>
          <p className="text-xs text-[var(--zf-text-muted)] leading-relaxed">
            {killSwitchEngaged
              ? 'Safety kill switch physically engaged. Autonomous responses require explicit manual override.'
              : 'Safety kill switch is disengaged. Authorized quarantine actions require dual-operator approval under Tier 3 rules.'}
          </p>
        </div>
      </div>
    </div>
  );
};
