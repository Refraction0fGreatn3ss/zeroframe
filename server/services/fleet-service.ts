import type { FleetSensorSeed } from '../types/tenant.ts';

type Value = unknown;

function text(...candidates: Value[]): string | undefined {
  return candidates.find((candidate): candidate is string => typeof candidate === 'string' && candidate !== '');
}

function numeric(...candidates: Value[]): number | undefined {
  return candidates.find((candidate): candidate is number => typeof candidate === 'number');
}

function flag(value: Value, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function packetRateOf(sensor: FleetSensorSeed): number {
  const explicit = numeric(sensor.packetRatePps);
  if (explicit !== undefined) return explicit;
  const kpps = numeric(sensor.packetRateKpps);
  return kpps ? kpps * 1000 : 260000;
}

export function normalizeSensor(sensor: FleetSensorSeed, tenantId: string) {
  const lowerId = sensor.id.toLowerCase();
  return {
    id: sensor.id,
    name: text(sensor.name) ?? sensor.id,
    hostname: text(sensor.hostname) ?? `${lowerId}.corp.internal`,
    site: text(sensor.site, sensor.location) ?? 'HQ Datacenter Core Switch',
    managementIp: text(sensor.managementIp) ?? '10.140.0.11',
    architecture: text(sensor.architecture) ?? 'x86_64',
    version: text(sensor.version) ?? 'ZeroFrame-Sensor-v1.4.1',
    kernelVersion: text(sensor.kernelVersion) ?? 'Linux 6.5.0-44-generic',
    captureDriver: text(sensor.captureDriver) ?? 'AF_XDP',
    queueCount: numeric(sensor.queueCount) ?? 16,
    activeQueue: numeric(sensor.activeQueue) ?? 0,
    lifecycle: text(sensor.lifecycle) ?? 'ACTIVE',
    connectivity: text(sensor.connectivity) ?? 'CONNECTED',
    health: text(sensor.health, sensor.status) ?? 'HEALTHY',
    observation: text(sensor.observation) ?? 'OBSERVING_FULL',
    trust: text(sensor.trust) ?? 'TRUSTED_MTLS',
    spiffeId: text(sensor.spiffeId) ?? `spiffe://zeroframe.internal/sensor/${lowerId}`,
    certFingerprintSha256: text(sensor.certFingerprintSha256) ?? 'e8f01a39b22a44cc...9911',
    certExpiresAt: text(sensor.certExpiresAt, sensor.mTLSExpiry) ?? '2027-04-15T00:00:00Z',
    caIssuer: text(sensor.caIssuer) ?? 'ZeroFrame Internal CA (Offline Root)',
    interfaceName: text(sensor.interfaceName) ?? 'enp4s0f0',
    promiscuousEnabled: flag(sensor.promiscuousEnabled, true),
    wireThroughputMbps: numeric(sensor.wireThroughputMbps, sensor.ingressThroughputMbps) ?? 1850,
    packetRatePps: packetRateOf(sensor),
    kernelDropsPps: numeric(sensor.kernelDropsPps, sensor.kernelDropPps) ?? 0,
    outboxPendingEvents: numeric(sensor.outboxPendingEvents) ?? 0,
    lastHeartbeat: text(sensor.lastHeartbeat) ?? new Date().toISOString(),
    lastConfigSync: text(sensor.lastConfigSync) ?? '2026-10-12T08:00:00Z',
    configVersion: text(sensor.configVersion) ?? 'v3.2.1-prod',
    rollbackReady: flag(sensor.rollbackReady, true),
    tenantId: text(sensor.tenantId) ?? tenantId,
  };
}
