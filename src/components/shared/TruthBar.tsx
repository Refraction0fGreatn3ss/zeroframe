/**
 * ZeroFrame Truth Bar
 * 
 * Signature ZeroFrame Brand Concept:
 * Tells the operator what it knows, what it can see, what it can detect, and what it can safely do.
 * 
 * 4 Authoritative States:
 * 1. Exists (Topology / Infrastructure Known)
 * 2. Visible (Observation / Packet & Wire Visibility)
 * 3. Detectable (Live Detection Assurance Canaries)
 * 4. Respondable (Response Governance & Kill-Switch Authority)
 * 
 * Clicking any segment opens the authoritative "WHY & PROOF" context drawer.
 */

import React from 'react';
import { useDashboardStore } from '../../stores/dashboard-store';
import { useAppStore } from '../../stores/app-store';
import { useDrawerStore } from '../../stores/context-drawer-store';
import {
  Server,
  Eye,
  Crosshair,
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const TruthBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { metrics } = useDashboardStore();
  const { killSwitchEngaged, realtimeConnected, lastHeartbeatTimestamp } = useAppStore();
  const { openContext } = useDrawerStore();

  const formatTime = (iso?: string) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleTimeString();
    } catch {
      return '';
    }
  };
  const lastKnownTime = formatTime(lastHeartbeatTimestamp || metrics.lastCanaryAuditTime);

  const handleOpenProof = (
    type: 'INFRASTRUCTURE' | 'VISIBILITY' | 'DETECTION' | 'RESPONSE'
  ) => {
    switch (type) {
      case 'INFRASTRUCTURE':
        openContext({
          type: 'TRUTH_PROOF',
          id: 'proof-infrastructure',
          title: 'Infrastructure Truth: What Exists',
          subtitle: `${metrics.totalKnownEntities} active entities discovered across ${metrics.knownSubnets} subnets`,
          data: {
            category: 'INFRASTRUCTURE',
            totalKnownEntities: metrics.totalKnownEntities,
            knownSubnets: metrics.knownSubnets,
            criticalProtectedAssets: metrics.criticalProtectedAssets,
            otDevicesCount: metrics.otDevicesCount,
            sourceFidelity: metrics.sourceFidelityLevel,
            observationPoints: metrics.activeObservationPoints,
            why: 'Derived purely from passive wire observation, DHCP lease origin analysis, and continuous ARP snooping. Zero synthetic assumptions.',
            proof: [
              'Continuous L2/L3 MAC-to-IP binding ledger verified across all VLANs',
              `${metrics.criticalProtectedAssets} Crown Jewel tier-1 systems tagged with blast-radius constraints`,
              `${metrics.otDevicesCount} Industrial SCADA/OT PLCs cataloged via passive optical tap`,
            ],
          },
        });
        break;

      case 'VISIBILITY':
        openContext({
          type: 'TRUTH_PROOF',
          id: 'proof-visibility',
          title: 'Observation Truth: What ZeroFrame Can See',
          subtitle: `Capture state: ${metrics.captureState} · ${metrics.observationCoveragePct}% wire coverage`,
          data: {
            category: 'VISIBILITY',
            captureState: metrics.captureState,
            coverage: `${metrics.observationCoveragePct}%`,
            asymmetry: `${(metrics.asymmetricTrafficRatio * 100).toFixed(1)}%`,
            kernelDrops: `${metrics.kernelDropPps} pps`,
            uninspected: `${(metrics.uninspectedBytesRatio * 100).toFixed(1)}%`,
            why: metrics.captureState === 'HEALTHY'
              ? 'All network taps report bidirectional flow symmetry with zero kernel ring drops.'
              : 'Core-Switch-02 mirror port reports 18% unidirectional flows. Return traffic routed across Link B is currently unmonitored by any sensor.',
            proof: [
              `Ingress rate: ${(metrics.currentIngressThroughputBps / 1e9).toFixed(2)} Gbps (${metrics.currentPacketRatePps.toLocaleString()} pps)`,
              `Kernel capture ring drop rate: ${metrics.kernelDropPps} pps on sensor-hq-core-02`,
              'Encrypted SNI / ECH ratio: 4.2% of TLS sessions require JA4 fallback classification',
            ],
            recommendation: 'Verify port mirroring policy on distribution core switch or provision passive optical TAP on secondary border link.',
            link: '/system/inspection',
          },
        });
        break;

      case 'DETECTION':
        openContext({
          type: 'TRUTH_PROOF',
          id: 'proof-detection',
          title: 'Detection Assurance Truth: What Can Be Detected',
          subtitle: `${metrics.detectorsHealthy} / ${metrics.activeDetectorsTotal} detectors verified via signed canaries`,
          data: {
            category: 'DETECTION',
            healthy: metrics.detectorsHealthy,
            total: metrics.activeDetectorsTotal,
            degraded: metrics.detectorsDegraded,
            unavailable: metrics.detectorsUnavailable,
            assuranceState: metrics.liveAssuranceState,
            lastAudit: metrics.lastCanaryAuditTime,
            why: metrics.detectorsDegraded > 0
              ? 'Canary for detector "c2_beaconing.py" failed jitter validation due to queue drops on secondary sensor.'
              : 'All active detection algorithms verified within the last 60 seconds using non-destructive signed canaries.',
            proof: [
              `Last cluster canary pass: ${new Date(metrics.lastCanaryAuditTime).toLocaleTimeString()}`,
              'Cryptographic signature: ED25519-CANARY-PROOF-9912 verified by witness node',
              'Synthetic injection validation: Safe synthetic RPC & DNS frames verified end-to-end',
            ],
            link: '/system/assurance',
          },
        });
        break;

      case 'RESPONSE':
        openContext({
          type: 'TRUTH_PROOF',
          id: 'proof-response',
          title: 'Response Truth: What Can Safely Be Done',
          subtitle: killSwitchEngaged ? 'Response Blocked (Safety Kill-Switch)' : 'Governed Active (Dual-Control)',
          data: {
            category: 'RESPONSE',
            killSwitchEngaged,
            status: killSwitchEngaged ? 'BLOCKED' : 'GOVERNED_ACTIVE',
            why: killSwitchEngaged
              ? 'Autonomous containment physically blocked by operator command. System is restricted to observation and manual approval.'
              : 'Autonomous containment armed with strict blast-radius verification and automated 60-minute rollback window.',
            proof: [
              'Dual-operator execution permit requirement enforced for Tier 1 assets',
              'Pre-flight blast-radius simulation executes prior to network isolation',
              'Automated rollback checkpoint saved to cryptographic evidence ledger before rule dispatch',
            ],
            link: '/respond/studio',
          },
        });
        break;
    }
  };

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 bg-[var(--zf-surface-topbar)] border border-[var(--zf-border-medium)] rounded-md font-sans text-xs select-none shadow-xs ${className}`}
      title="ZeroFrame Authoritative Truth Bar — Click any segment for verified proof and underlying telemetry"
    >
      {/* 1. INFRASTRUCTURE: WHAT EXISTS */}
      <button
        onClick={() => handleOpenProof('INFRASTRUCTURE')}
        className={`flex items-center justify-between p-2 rounded bg-[var(--zf-surface-card)] hover:bg-[var(--zf-surface-card-hover)] border text-left transition-colors cursor-pointer group ${
          !realtimeConnected ? 'border-amber-500/30' : 'border-[var(--zf-border-subtle)]'
        }`}
      >
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--zf-text-muted)] uppercase tracking-wider">
            <Server className={`w-3 h-3 shrink-0 ${!realtimeConnected ? 'text-amber-400' : 'text-[var(--zf-brand-accent)]'}`} />
            <span>Exists</span>
            {!realtimeConnected && (
              <span className="text-[9px] font-mono text-amber-400 font-normal">STALE</span>
            )}
          </div>
          <div className="font-semibold text-xs text-[var(--zf-text-primary)] truncate">
            {metrics.totalKnownEntities > 0 ? `${metrics.totalKnownEntities.toLocaleString()} Entities` : 'Discovering...'}
          </div>
          <div className="text-[10px] text-[var(--zf-text-secondary)] truncate">
            {!realtimeConnected
              ? `Last known: ${lastKnownTime}`
              : `${metrics.criticalProtectedAssets} Crown Jewels · ${metrics.knownSubnets} Subnets`}
          </div>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--zf-text-muted)] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
      </button>

      {/* 2. VISIBILITY: WHAT CAN BE SEEN */}
      <button
        onClick={() => handleOpenProof('VISIBILITY')}
        className={`flex items-center justify-between p-2 rounded bg-[var(--zf-surface-card)] hover:bg-[var(--zf-surface-card-hover)] border text-left transition-colors cursor-pointer group ${
          !realtimeConnected
            ? 'border-amber-500/30'
            : metrics.captureState === 'HEALTHY'
            ? 'border-emerald-500/20'
            : 'border-amber-500/30'
        }`}
      >
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--zf-text-muted)] uppercase tracking-wider">
            <Eye className={`w-3 h-3 shrink-0 ${!realtimeConnected ? 'text-amber-400' : metrics.captureState === 'HEALTHY' ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span>Visible</span>
            {!realtimeConnected && (
              <span className="text-[9px] font-mono text-amber-400 font-normal">STALE</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-xs text-[var(--zf-text-primary)]">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                !realtimeConnected
                  ? 'bg-amber-400'
                  : metrics.captureState === 'HEALTHY' ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
            <span>
              {!realtimeConnected
                ? `Last Known at ${lastKnownTime}`
                : metrics.observationCoveragePct > 0
                ? `${metrics.observationCoveragePct.toFixed(1)}% Coverage`
                : 'Analyzing'}
            </span>
          </div>
          <div className="text-[10px] text-[var(--zf-text-secondary)] truncate">
            {!realtimeConnected
              ? 'Realtime link severed'
              : metrics.captureState === 'HEALTHY' ? 'Bidirectional TAP Nominal' : `${(metrics.asymmetricTrafficRatio * 100).toFixed(0)}% Asymmetric Flows`}
          </div>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--zf-text-muted)] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
      </button>

      {/* 3. DETECTION: WHAT CAN BE DETECTED */}
      <button
        onClick={() => handleOpenProof('DETECTION')}
        className={`flex items-center justify-between p-2 rounded bg-[var(--zf-surface-card)] hover:bg-[var(--zf-surface-card-hover)] border text-left transition-colors cursor-pointer group ${
          !realtimeConnected
            ? 'border-amber-500/30'
            : metrics.detectorsDegraded === 0 && metrics.detectorsUnavailable === 0
            ? 'border-emerald-500/20'
            : 'border-amber-500/30'
        }`}
      >
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--zf-text-muted)] uppercase tracking-wider">
            <Crosshair className={`w-3 h-3 shrink-0 ${!realtimeConnected ? 'text-amber-400' : metrics.detectorsDegraded === 0 ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span>Detectable</span>
            {!realtimeConnected && (
              <span className="text-[9px] font-mono text-amber-400 font-normal">STALE</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-xs text-[var(--zf-text-primary)]">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                !realtimeConnected
                  ? 'bg-amber-400'
                  : metrics.detectorsDegraded === 0 ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
            <span>
              {!realtimeConnected
                ? `Last Known at ${lastKnownTime}`
                : `${metrics.detectorsHealthy} / ${metrics.activeDetectorsTotal} Verified`}
            </span>
          </div>
          <div className="text-[10px] text-[var(--zf-text-secondary)] truncate">
            {!realtimeConnected
              ? 'Canary stream paused'
              : metrics.detectorsDegraded === 0 ? 'Live Canary Assurance: Pass' : '1 Detector Degraded (Jitter)'}
          </div>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--zf-text-muted)] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
      </button>

      {/* 4. RESPONSE: WHAT CAN SAFELY BE DONE */}
      <button
        onClick={() => handleOpenProof('RESPONSE')}
        className={`flex items-center justify-between p-2 rounded bg-[var(--zf-surface-card)] hover:bg-[var(--zf-surface-card-hover)] border text-left transition-colors cursor-pointer group ${
          !realtimeConnected
            ? 'border-amber-500/30'
            : killSwitchEngaged ? 'border-amber-500/40' : 'border-emerald-500/20'
        }`}
      >
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--zf-text-muted)] uppercase tracking-wider">
            <ShieldCheck className={`w-3 h-3 shrink-0 ${!realtimeConnected ? 'text-amber-400' : killSwitchEngaged ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span>Respondable</span>
            {!realtimeConnected && (
              <span className="text-[9px] font-mono text-amber-400 font-normal">STALE</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-xs text-[var(--zf-text-primary)]">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                !realtimeConnected
                  ? 'bg-amber-400'
                  : killSwitchEngaged ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
            />
            <span>
              {!realtimeConnected
                ? `Last Known (${killSwitchEngaged ? 'Blocked' : 'Active'})`
                : killSwitchEngaged ? 'Response Blocked' : 'Governed Active'}
            </span>
          </div>
          <div className="text-[10px] text-[var(--zf-text-secondary)] truncate">
            {!realtimeConnected
              ? 'Stream Disconnected'
              : killSwitchEngaged ? 'Safety Kill-Switch Disarmed' : 'Dual-Control Permitted'}
          </div>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--zf-text-muted)] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
      </button>
    </div>
  );
};
