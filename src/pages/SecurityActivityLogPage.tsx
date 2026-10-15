/**
 * Security Activity Log Full Page View
 * Dedicated real-time monitoring operations console for system events, user logins, and threat alerts.
 */

import React from 'react';
import { useActivityLogStore } from '../stores/activity-log-store';
import { SecurityActivityLogPanel } from '../components/shared/SecurityActivityLogPanel';
import { ExportButton } from '../components/shared/ExportButton';
import {
  Activity,
  ShieldAlert,
  UserCheck,
  Cpu,
  Radio,
  Zap,
  PlusCircle,
  Clock,
  Download,
  Terminal,
} from 'lucide-react';

export const SecurityActivityLogPage: React.FC = () => {
  const {
    logs,
    counts,
    isStreaming,
    toggleStreaming,
    setCategoryFilter,
    addManualEvent,
  } = useActivityLogStore();

  const handleSimulateEvent = (type: 'threat' | 'auth' | 'system') => {
    if (type === 'threat') {
      addManualEvent({
        category: 'THREAT_ALERT',
        severity: 'CRITICAL',
        title: 'Manual Simulation: Encrypted JA4 C2 Beacon Injection',
        description: 'Simulated live adversary beacon trigger across port 443 with randomized jitter intervals.',
        actor: 'operator.simulation-suite',
        actorRole: 'Security Operator Test',
        sourceIp: '10.140.2.88',
        targetResource: 'c2-sim.zeroflash-lab.net',
        mitreTactic: 'T1071.001 (Web Protocols)',
        status: 'FLAGGED',
        payload: {
          simulated: true,
          jitterPct: 24,
          payloadBytes: 1048,
        },
      });
    } else if (type === 'auth') {
      addManualEvent({
        category: 'USER_LOGIN',
        severity: 'HIGH',
        title: 'Manual Simulation: Privileged Operator Role Assumption',
        description: 'Operator assumed Root Security Administrator role with temporary 30-minute privilege elevation lease.',
        actor: 'operator.admin@corp.zeroflash',
        actorRole: 'Root Security Admin',
        sourceIp: '10.140.0.102',
        targetResource: 'Console RBAC Policy Engine',
        status: 'WARNING',
        payload: {
          simulated: true,
          leaseDuration: '30m',
          elevationMethod: 'HARDWARE_U2F_TOKEN',
        },
      });
    } else {
      addManualEvent({
        category: 'SYSTEM_EVENT',
        severity: 'INFO',
        title: 'Manual Simulation: Optical Tap Laser Power Calibration',
        description: 'Calibrated optical receiver sensitivity on tap-sfp28-core-01; signal-to-noise ratio nominal.',
        actor: 'hardware.calibration-service',
        actorRole: 'Sensor Maintenance',
        sourceIp: '192.168.1.10',
        targetResource: 'tap-sfp28-core-01',
        status: 'SUCCESS',
        payload: {
          simulated: true,
          opticalPower: '-2.8 dBm',
          calibrationResult: 'PASS',
        },
      });
    }
  };

  return (
    <div className="p-4 sm:p-5 space-y-4 text-[var(--zf-text-primary)] max-w-[1720px] mx-auto font-sans select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--zf-border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight text-[var(--zf-text-primary)] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--zf-brand-accent)]" />
              <span>Real-Time Security Activity Log</span>
            </h1>
            <span className="text-[var(--zf-text-muted)]">·</span>
            <span className="text-xs font-mono text-[var(--zf-brand-accent)] font-medium">
              Live Ingestion & Unified Audit Trail
            </span>
          </div>
          <p className="text-xs text-[var(--zf-text-muted)] mt-0.5">
            Synchronized telemetry tracking system events, user logins, and threat alerts across network, endpoint, and physical taps.
          </p>
        </div>

        {/* Tactical Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Simulation Controls */}
          <div className="flex items-center bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] rounded p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => handleSimulateEvent('threat')}
              className="px-2 py-1 rounded text-[11px] text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Inject a simulated threat alert"
            >
              + Sim Threat
            </button>
            <span className="text-[var(--zf-border-subtle)]">|</span>
            <button
              type="button"
              onClick={() => handleSimulateEvent('auth')}
              className="px-2 py-1 rounded text-[11px] text-sky-400 hover:bg-sky-500/10 transition-colors cursor-pointer"
              title="Inject a simulated user login event"
            >
              + Sim Auth
            </button>
            <span className="text-[var(--zf-border-subtle)]">|</span>
            <button
              type="button"
              onClick={() => handleSimulateEvent('system')}
              className="px-2 py-1 rounded text-[11px] text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
              title="Inject a simulated system event"
            >
              + Sim Sys
            </button>
          </div>

          <ExportButton
            resourceName="Security_Activity_Log"
            recordCount={logs.length}
            data={logs}
          />
        </div>
      </div>

      {/* KPI Activity Counters Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Events */}
        <div
          onClick={() => setCategoryFilter('ALL')}
          className="p-3.5 bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] rounded flex flex-col justify-between cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[var(--zf-text-secondary)] font-medium">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[var(--zf-brand-accent)]" />
              <span>Total Activity Ingested</span>
            </span>
            <span className="font-mono text-[10px] text-[var(--zf-text-muted)]">Live Ring Buffer</span>
          </div>
          <div className="my-1.5 flex items-baseline gap-2">
            <div className="text-2xl font-mono font-bold text-[var(--zf-text-primary)] tabular-nums">
              {counts.all}
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Ingesting
            </span>
          </div>
          <div className="text-[11px] text-[var(--zf-text-muted)] font-mono">
            {counts.criticalCount} high-priority security exceptions flagged
          </div>
        </div>

        {/* Threat Alerts */}
        <div
          onClick={() => setCategoryFilter('THREAT_ALERT')}
          className="p-3.5 bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] hover:border-rose-500/40 rounded flex flex-col justify-between cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[var(--zf-text-secondary)] font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Threat Alerts</span>
            </span>
            <span className="font-mono text-[10px] text-rose-400 font-semibold">ATT&CK Aligned</span>
          </div>
          <div className="my-1.5 flex items-baseline gap-2">
            <div className="text-2xl font-mono font-bold text-rose-400 tabular-nums">
              {counts.threatAlerts}
            </div>
            <span className="text-[11px] font-mono text-[var(--zf-text-muted)]">Active Signals</span>
          </div>
          <div className="text-[11px] text-[var(--zf-text-muted)] font-mono">
            DNS tunnels, Modbus coil attacks, Kerberos anomalies
          </div>
        </div>

        {/* User Logins & Auth */}
        <div
          onClick={() => setCategoryFilter('USER_LOGIN')}
          className="p-3.5 bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] hover:border-sky-500/40 rounded flex flex-col justify-between cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[var(--zf-text-secondary)] font-medium">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>User Logins & Auth</span>
            </span>
            <span className="font-mono text-[10px] text-sky-400 font-semibold">SSO / SAML 2.0</span>
          </div>
          <div className="my-1.5 flex items-baseline gap-2">
            <div className="text-2xl font-mono font-bold text-sky-400 tabular-nums">
              {counts.userLogins}
            </div>
            <span className="text-[11px] font-mono text-[var(--zf-text-muted)]">Verified Sessions</span>
          </div>
          <div className="text-[11px] text-[var(--zf-text-muted)] font-mono">
            MFA challenges, SSO assertions, inactivity renewals
          </div>
        </div>

        {/* System & Kernel Events */}
        <div
          onClick={() => setCategoryFilter('SYSTEM_EVENT')}
          className="p-3.5 bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] hover:border-emerald-500/40 rounded flex flex-col justify-between cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[var(--zf-text-secondary)] font-medium">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>System & Optical Events</span>
            </span>
            <span className="font-mono text-[10px] text-emerald-400 font-semibold">Kernel AF_XDP</span>
          </div>
          <div className="my-1.5 flex items-baseline gap-2">
            <div className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
              {counts.systemEvents}
            </div>
            <span className="text-[11px] font-mono text-[var(--zf-text-muted)]">Hardware Diagnostics</span>
          </div>
          <div className="text-[11px] text-[var(--zf-text-muted)] font-mono">
            Canary verifications, diode heartbeats, tap synchronization
          </div>
        </div>
      </div>

      {/* Main Full-Bleed Security Activity Log Panel Component */}
      <SecurityActivityLogPanel maxHeight="620px" showHeader={true} />
    </div>
  );
};
