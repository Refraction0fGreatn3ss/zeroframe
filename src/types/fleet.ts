/**
 * Sensor Fleet & Trust Types for ZeroFlash Enterprise
 * CRITICAL RULE: Never collapse lifecycle, connectivity, health, observation, and trust into one badge.
 */

import { SecurityState, SourceFidelity } from './index';

export type SensorLifecycle = 'PROVISIONED' | 'ENROLLED' | 'ACTIVE' | 'DRAINING' | 'DECOMMISSIONED';
export type SensorConnectivity = 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING' | 'STALE_HEARTBEAT';
export type SensorHealth = 'HEALTHY' | 'DEGRADED' | 'CRITICAL' | 'UNRESPONSIVE';
export type SensorObservation = 'OBSERVING_FULL' | 'OBSERVING_PARTIAL' | 'TAP_UNVERIFIED' | 'NO_TRAFFIC';
export type SensorTrust = 'TRUSTED_MTLS' | 'CERT_EXPIRING_SOON' | 'CERT_EXPIRED' | 'UNTRUSTED_REVOKED';

export interface SensorNode {
  id: string;
  name: string;
  hostname: string;
  site: string;
  managementIp: string;
  architecture: 'x86_64' | 'aarch64';
  version: string;
  kernelVersion: string;
  captureDriver: 'AF_XDP' | 'AF_PACKET' | 'DPDK';
  queueCount: number;
  activeQueue: number;

  // Separate Authoritative States
  lifecycle: SensorLifecycle;
  connectivity: SensorConnectivity;
  health: SensorHealth;
  observation: SensorObservation;
  trust: SensorTrust;

  // Trust & mTLS Details
  spiffeId: string;
  certFingerprintSha256: string;
  certExpiresAt: string;
  caIssuer: string;

  // Observation Metrics
  interfaceName: string;
  promiscuousEnabled: boolean;
  wireThroughputMbps: number;
  packetRatePps: number;
  kernelDropsPps: number;
  outboxPendingEvents: number;

  lastHeartbeat: string;
  lastConfigSync: string;
  configVersion: string;
  rollbackReady: boolean;
  tenantId: string;
}
