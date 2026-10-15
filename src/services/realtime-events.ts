import type { SecurityIncident } from '../types';
import type { RollbackPayload } from '../types/api-payloads';
import type { PcapCaptureRecord } from './evidence-service';
import type { ExecutionPermitRecord } from './response-service';

export type RealtimeConnectionState =
  | 'CONNECTING'
  | 'CONNECTED'
  | 'STALE'
  | 'RECONNECTING'
  | 'DEGRADED'
  | 'DISCONNECTED'
  | 'AUTH_REVOKED';

export interface RealtimeEnvelope<TType extends string, TPayload> {
  seq: number;
  tenantId: string;
  timestamp: string;
  type: TType;
  payload: TPayload;
}

export type RealtimeMessage<T = unknown> = RealtimeEnvelope<string, T>;

export interface TelemetryPulsePayload {
  currentIngressThroughputBps: number;
  currentPacketRatePps: number;
  kernelDropPps: number;
  lastCanaryAuditTime?: string;
}

export interface KillSwitchChangedPayload {
  governedResponseKillSwitch: boolean;
  reason: string;
  operator: string;
  timestamp: string;
  tenantId?: string;
}

export interface IncidentStateChangedPayload {
  incidentId: string;
  state: SecurityIncident['state'];
}

export interface CanaryValidationCompletedPayload {
  timestamp: string;
  canaryPassCount: number;
  signedHash: string;
}

export interface RealtimeEventPayloads {
  TELEMETRY_PULSE: TelemetryPulsePayload;
  KILL_SWITCH_CHANGED: KillSwitchChangedPayload;
  INCIDENT_STATE_CHANGED: IncidentStateChangedPayload;
  INCIDENT_CREATED: unknown;
  ALERT_INGESTED: unknown;
  CANARY_VALIDATION_COMPLETED: CanaryValidationCompletedPayload;
  PERMIT_ISSUED: ExecutionPermitRecord;
  PERMIT_APPROVED: ExecutionPermitRecord;
  ROLLBACK_EXECUTED: RollbackPayload;
  PCAP_EXTRACTION_COMPLETED: PcapCaptureRecord;
}

export type RealtimeEventType = keyof RealtimeEventPayloads;

export type RealtimeEvent = {
  [TType in RealtimeEventType]: RealtimeEnvelope<TType, RealtimeEventPayloads[TType]>;
}[RealtimeEventType];

export type RealtimeControlFrame =
  | { type: 'PONG' }
  | { type: 'CONNECTED'; seq?: number }
  | { type: 'SESSION_REVOKED'; reason?: string }
  | { type: 'SESSION_EXPIRED'; reason?: string };

export type RealtimeFrame = RealtimeControlFrame | RealtimeEvent;

export interface RealtimeResyncResponse {
  missedEvents?: RealtimeEvent[];
}
