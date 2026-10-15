import type { SecurityState } from '../../types';

export interface CommandCenterMetrics {
  totalKnownEntities: number;
  knownSubnets: number;
  criticalProtectedAssets: number;
  otDevicesCount: number;

  observationCoveragePct: number;
  activeObservationPoints: number;
  captureState: SecurityState;
  sourceFidelityLevel: 'DEEP_PACKET' | 'WIRE_METADATA' | 'FLOW' | 'PARTIAL';
  asymmetricTrafficRatio: number;
  currentIngressThroughputBps: number;
  currentPacketRatePps: number;
  kernelDropPps: number;
  uninspectedBytesRatio: number;

  activeDetectorsTotal: number;
  detectorsHealthy: number;
  detectorsDegraded: number;
  detectorsUnavailable: number;
  liveAssuranceState: SecurityState;
  lastCanaryAuditTime: string;

  openIncidentsCount: number;
  criticalIncidentsCount: number;
  highIncidentsCount: number;
  containedTodayCount: number;

  sensorsOnline: number;
  sensorsTotal: number;
  witnessNodesHealthy: number;
  witnessNodesTotal: number;
  governedResponseKillSwitch: boolean;
}

export interface TelemetryPulsePayload {
  currentIngressThroughputBps: number;
  currentPacketRatePps: number;
  kernelDropPps: number;
  lastCanaryAuditTime?: string;
}

export const DEGRADED_CAPTURE_DROP_THRESHOLD_PPS = 50;

export function applyTelemetryPulse(metrics: CommandCenterMetrics, pulse: TelemetryPulsePayload): CommandCenterMetrics {
  return {
    ...metrics,
    currentIngressThroughputBps: pulse.currentIngressThroughputBps,
    currentPacketRatePps: pulse.currentPacketRatePps,
    kernelDropPps: pulse.kernelDropPps,
    lastCanaryAuditTime: pulse.lastCanaryAuditTime || metrics.lastCanaryAuditTime,
  };
}

export function applyThroughputSample(
  metrics: CommandCenterMetrics,
  bps: number,
  pps: number,
  drops: number,
): CommandCenterMetrics {
  return {
    ...metrics,
    currentIngressThroughputBps: bps,
    currentPacketRatePps: pps,
    kernelDropPps: drops,
    captureState: drops > DEGRADED_CAPTURE_DROP_THRESHOLD_PPS ? 'DEGRADED' : metrics.captureState,
  };
}
