/**
 * Inspection Integrity Types for ZeroFlash Enterprise
 * Tracks full observation path: CAPTURE -> L2 -> L3 -> TRANSPORT -> SESSION -> CRYPTO -> APPLICATION
 */

import { InspectionStage, SecurityState, SourceFidelity } from './index';

export interface InspectionStageDetail {
  stage: InspectionStage;
  state: SecurityState;
  packetRate: number; // pps
  byteRate: number; // bps
  errorRate: number;
  uninspectedBytes: number;
  primaryCause?: string;
  notes: string;
}

export interface EncapsulationIntegrity {
  vlanTrunked: boolean;
  qinqDetected: boolean;
  qinqStripped: boolean;
  vxlanTunnels: number;
  geneveTunnels: number;
  mplsLabelsPresent: boolean;
  asymmetricFlowRatio: number; // percentage of half-open / unidirectional flows
  asymmetricAlert: boolean;
}

export interface CryptoInspectionMetrics {
  tls12Count: number;
  tls13Count: number;
  ja4FingerprintedFlows: number;
  echDetectedCount: number; // Encrypted Client Hello blind spot count
  dohTunnelCandidates: number; // DNS-over-HTTPS blind spots
  quicFlowsOpaque: number; // HTTP/3 QUIC flows
  decryptionAttempted: false; // Always false: ZeroFlash strictly avoids deceptive decryption claims
}

export interface QueueBackpressureMetrics {
  kernelBufferLossRate: number; // % dropped before kernel socket
  sensorOutboxQueueDepth: number; // pending durable IPC items
  serverIngestQueueDepth: number;
  maxQueueCapacity: number;
  backpressureState: 'NORMAL' | 'ELEVATED' | 'CRITICAL' | 'SATURATED';
  lastQueueDropTimestamp?: string;
}
