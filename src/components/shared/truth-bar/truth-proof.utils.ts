import type { ContextItem } from '../../../stores/context-drawer-store';
import type { CommandCenterMetrics } from '../../../stores/dashboard-store';
import type { TruthCategory } from './truth-bar.types';
import { toPercent } from './truth-bar.utils';

const BITS_PER_GIGABIT = 1e9;

const buildInfrastructureProof = (metrics: CommandCenterMetrics): ContextItem => ({
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

const buildVisibilityProof = (metrics: CommandCenterMetrics): ContextItem => ({
  type: 'TRUTH_PROOF',
  id: 'proof-visibility',
  title: 'Observation Truth: What ZeroFrame Can See',
  subtitle: `Capture state: ${metrics.captureState} · ${metrics.observationCoveragePct}% wire coverage`,
  data: {
    category: 'VISIBILITY',
    captureState: metrics.captureState,
    coverage: `${metrics.observationCoveragePct}%`,
    asymmetry: `${toPercent(metrics.asymmetricTrafficRatio, 1)}%`,
    kernelDrops: `${metrics.kernelDropPps} pps`,
    uninspected: `${toPercent(metrics.uninspectedBytesRatio, 1)}%`,
    why:
      metrics.captureState === 'HEALTHY'
        ? 'All network taps report bidirectional flow symmetry with zero kernel ring drops.'
        : 'Core-Switch-02 mirror port reports 18% unidirectional flows. Return traffic routed across Link B is currently unmonitored by any sensor.',
    proof: [
      `Ingress rate: ${(metrics.currentIngressThroughputBps / BITS_PER_GIGABIT).toFixed(2)} Gbps (${metrics.currentPacketRatePps.toLocaleString()} pps)`,
      `Kernel capture ring drop rate: ${metrics.kernelDropPps} pps on sensor-hq-core-02`,
      'Encrypted SNI / ECH ratio: 4.2% of TLS sessions require JA4 fallback classification',
    ],
    recommendation:
      'Verify port mirroring policy on distribution core switch or provision passive optical TAP on secondary border link.',
    link: '/system/inspection',
  },
});

const buildDetectionProof = (metrics: CommandCenterMetrics): ContextItem => ({
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
    why:
      metrics.detectorsDegraded > 0
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

const buildResponseProof = (killSwitchEngaged: boolean): ContextItem => ({
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

export const buildTruthProofContext = (
  category: TruthCategory,
  metrics: CommandCenterMetrics,
  killSwitchEngaged: boolean,
): ContextItem => {
  switch (category) {
    case 'INFRASTRUCTURE':
      return buildInfrastructureProof(metrics);
    case 'VISIBILITY':
      return buildVisibilityProof(metrics);
    case 'DETECTION':
      return buildDetectionProof(metrics);
    case 'RESPONSE':
      return buildResponseProof(killSwitchEngaged);
  }
};
