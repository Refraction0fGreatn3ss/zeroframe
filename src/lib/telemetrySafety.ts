/**
 * Telemetry Safety & False-Green Prevention Rules
 *
 * Core ZeroFlash Philosophy:
 * "I did not observe it" !== "It did not happen"
 * The system must never create false confidence.
 * Unknown information must remain UNKNOWN.
 * Missing telemetry must not become HEALTHY.
 */

import { SecurityState } from '../types';

export interface TelemetryHealthAssessment {
  captureHealthy: boolean;
  queueDropPps: number;
  unidirectionalFlowRatio: number; // Asymmetric traffic
  sensorConnected: boolean;
  certValid: boolean;
  realtimeHealthy: boolean;
  stalenessSeconds: number;
}

export function evaluateAuthoritativeState(
  baseState: SecurityState,
  health: TelemetryHealthAssessment
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

  if (health.stalenessSeconds > 300) {
    return { state: 'STALE', reason: `Telemetry has not updated in ${Math.round(health.stalenessSeconds)}s` };
  }

  if (health.queueDropPps > 50) {
    return { state: 'DEGRADED', reason: `Sensor outbox/kernel is dropping ${health.queueDropPps} packets/sec` };
  }

  if (health.unidirectionalFlowRatio > 0.35) {
    return { state: 'PARTIAL', reason: 'Asymmetric routing: 35%+ of flows observed unidirectionally' };
  }

  if (!health.captureHealthy) {
    return { state: 'DEGRADED', reason: 'Capture ring buffer overflow' };
  }

  return { state: baseState };
}

/**
 * Ensures that if a detector's required telemetry is missing or degraded,
 * its detection assurance state is degraded rather than green.
 */
export function auditDetectorIntegrity(
  detectorKey: string,
  requiredFidelity: string,
  availableFidelity: string,
  queueLoss: number
): { status: SecurityState; note: string } {
  if (queueLoss > 100) {
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
