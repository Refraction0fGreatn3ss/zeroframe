export type SensorLifecycle = 'PROVISIONED' | 'ENROLLED' | 'ACTIVE' | 'DRAINING' | 'DECOMMISSIONED';
export type SensorConnectivity = 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING' | 'STALE_HEARTBEAT';
export type SensorHealth = 'HEALTHY' | 'DEGRADED' | 'CRITICAL' | 'UNRESPONSIVE';
export type SensorObservation = 'OBSERVING_FULL' | 'OBSERVING_PARTIAL' | 'TAP_UNVERIFIED' | 'NO_TRAFFIC';
export type SensorTrust = 'TRUSTED_MTLS' | 'CERT_EXPIRING_SOON' | 'CERT_EXPIRED' | 'UNTRUSTED_REVOKED';

// Lifecycle, connectivity, health, observation and trust are separate axes; never collapse them into one badge.
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

  lifecycle: SensorLifecycle;
  connectivity: SensorConnectivity;
  health: SensorHealth;
  observation: SensorObservation;
  trust: SensorTrust;

  spiffeId: string;
  certFingerprintSha256: string;
  certExpiresAt: string;
  caIssuer: string;

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
