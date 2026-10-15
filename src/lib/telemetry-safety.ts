import type { SecurityState } from '../types';

// "I did not observe it" is not "it did not happen": missing telemetry must never render as HEALTHY.

const STALE_TELEMETRY_SECONDS = 300;
const DEGRADED_QUEUE_DROP_PPS = 50;
const PARTIAL_UNIDIRECTIONAL_FLOW_RATIO = 0.35;
const DETECTOR_QUEUE_LOSS_LIMIT = 100;

export interface TelemetryHealthAssessment {
  captureHealthy: boolean;
  queueDropPps: number;
  unidirectionalFlowRatio: number;
  sensorConnected: boolean;
  certValid: boolean;
  realtimeHealthy: boolean;
  stalenessSeconds: number;
}

export function evaluateAuthoritativeState(
  baseState: SecurityState,
  health: TelemetryHealthAssessment,
): { state: SecurityState; reason?: string } {
  if (!health.sensorConnected) {
    return { state: 'DISCONNECTED', reason: 'Sensor node offline or heartbeat missing' };
  }

  if (!health.realtimeHealthy) {
    return { state: 'UNAVAILABLE', reason: 'Real-time WebSocket event link broken' };
  }

  if (!health.certValid) {
    return { state: 'FAILED', reason: 'mTLS certificate revoked or expired' };
  }

  if (health.stalenessSeconds > STALE_TELEMETRY_SECONDS) {
    return { state: 'STALE', reason: `Telemetry has not updated in ${Math.round(health.stalenessSeconds)}s` };
  }

  if (health.queueDropPps > DEGRADED_QUEUE_DROP_PPS) {
    return { state: 'DEGRADED', reason: `Sensor outbox/kernel is dropping ${health.queueDropPps} packets/sec` };
  }

  if (health.unidirectionalFlowRatio > PARTIAL_UNIDIRECTIONAL_FLOW_RATIO) {
    return { state: 'PARTIAL', reason: 'Asymmetric routing: 35%+ of flows observed unidirectionally' };
  }

  if (!health.captureHealthy) {
    return { state: 'DEGRADED', reason: 'Capture ring buffer overflow' };
  }

  return { state: baseState };
}

// A detector whose required telemetry is missing or degraded must not report green assurance.
export function auditDetectorIntegrity(
  _detectorKey: string,
  requiredFidelity: string,
  availableFidelity: string,
  queueLoss: number,
): { status: SecurityState; note: string } {
  if (queueLoss > DETECTOR_QUEUE_LOSS_LIMIT) {
    return {
      status: 'DEGRADED',
      note: 'Significant packet drops on mirror port prevent full signature match',
    };
  }

  if (requiredFidelity === 'DEEP_PACKET' && availableFidelity === 'FLOW') {
    return {
      status: 'UNAVAILABLE',
      note: 'Detector requires deep L7 dissection, but only NetFlow/IPFIX is available',
    };
  }

  if (requiredFidelity === 'ENDPOINT_CORROBORATED' && availableFidelity !== 'ENDPOINT_CORROBORATED') {
    return {
      status: 'PARTIAL',
      note: 'Waiting for EDR/XDR host corroboration; network observation alone is non-authoritative',
    };
  }

  return {
    status: 'AVAILABLE',
    note: 'Observation path verified; continuous live canary assurance active',
  };
}
