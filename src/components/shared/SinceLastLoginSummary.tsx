/**
 * Since-Last-Login Delta Summary Bar
 * Provides SOC operators with an immediate delta of security posture changes
 * since their prior session: new incidents, visibility drops, assurance state changes,
 * and top affected enterprise assets.
 */

import React, { useState } from 'react';
import { useInvestigationStore } from '../../stores/investigation-store';
import { useDashboardStore } from '../../stores/dashboard-store';
import { useAppStore } from '../../stores/app-store';
import {
  Clock,
  ShieldAlert,
  EyeOff,
  Activity,
  Server,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const SinceLastLoginSummary: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [dismissed, setDismissed] = useState(false);
  const { incidents, setCurrentPath } = useInvestigationStore() as any;
  const { metrics } = useDashboardStore();
  const { setCurrentPath: setAppPath } = useAppStore();

  if (dismissed) return null;

  const navigateTo = (path: string) => {
    if (setAppPath) setAppPath(path);
  };

  const newIncidentsCount = metrics.openIncidentsCount || (incidents ? incidents.length : 2);
  const criticalCount = metrics.criticalIncidentsCount || 1;

  return (
    <div
      className={`rounded-lg border border-cyan-900/50 bg-[#09111c]/95 p-3 shadow-lg backdrop-blur-md font-sans text-xs ${className}`}
      role="region"
      aria-label="Since Last Login Summary"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pb-2 border-b border-cyan-950/80">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-cyan-950/70 border border-cyan-800/40 text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-slate-100 tracking-tight text-xs">
              Since Last Session Summary
            </span>
            <span className="text-slate-400 font-mono text-[11px] ml-2">
              Delta: 2h 45m ago · Operator sess-8841 (Sarah Chen, CISSP)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
            SESSION RECONCILIATION
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Dismiss delta summary"
            aria-label="Dismiss delta summary"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Delta Grid Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
        {/* Delta 1: New Incidents */}
        <div
          onClick={() => navigateTo('/investigate/incidents')}
          className="p-2 rounded bg-[#0b1626]/80 border border-slate-800/80 hover:border-rose-900/60 transition-colors cursor-pointer group flex items-start gap-2"
        >
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <span className="text-rose-400 font-bold font-mono">+{newIncidentsCount} New</span>
              <span>Incidents</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate">
              {criticalCount} Critical (Active C2 Cobalt Strike)
            </p>
          </div>
        </div>

        {/* Delta 2: Visibility Drop */}
        <div
          onClick={() => navigateTo('/investigate/network')}
          className="p-2 rounded bg-[#0b1626]/80 border border-slate-800/80 hover:border-amber-900/60 transition-colors cursor-pointer group flex items-start gap-2"
        >
          <EyeOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <span className="text-amber-400 font-bold font-mono">1 Visibility Drop</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate">
              Sensor SENS-HQ-03: Asymmetric tap
            </p>
          </div>
        </div>

        {/* Delta 3: Assurance State Change */}
        <div
          onClick={() => navigateTo('/assurance/canaries')}
          className="p-2 rounded bg-[#0b1626]/80 border border-slate-800/80 hover:border-cyan-900/60 transition-colors cursor-pointer group flex items-start gap-2"
        >
          <Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <span className="text-cyan-400 font-bold font-mono">Assurance:</span>
              <span className="text-amber-300 font-semibold">{metrics.liveAssuranceState}</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate">
              Canary Jitter: 24ms ({metrics.detectorsHealthy}/{metrics.activeDetectorsTotal} online)
            </p>
          </div>
        </div>

        {/* Delta 4: Top Affected Assets */}
        <div
          onClick={() => navigateTo('/investigate/entities')}
          className="p-2 rounded bg-[#0b1626]/80 border border-slate-800/80 hover:border-purple-900/60 transition-colors cursor-pointer group flex items-start gap-2"
        >
          <Server className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <span className="text-purple-300 font-bold">Top Assets</span>
            </div>
            <p className="text-[11px] text-purple-200 font-mono truncate">
              ENT-CORP-088, ENT-SWIFT-GW-01
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
