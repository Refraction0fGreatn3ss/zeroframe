import { HEARTBEAT_INTERVAL_MS } from '../config.ts';
import { tenantStore } from '../stores/tenant-store.ts';
import type { TenantMetrics } from '../types/tenant.ts';
import { broadcastTenantEvent } from './event-broadcaster.ts';

const MIN_THROUGHPUT_BPS = 10_000_000;
const MIN_PACKET_RATE_PPS = 1_000;

let started = false;

function randomJitter(amplitude: number): number {
  return Math.floor((Math.random() - 0.5) * amplitude);
}

function applyTrafficJitter(metrics: TenantMetrics): void {
  metrics.currentIngressThroughputBps = Math.max(
    MIN_THROUGHPUT_BPS,
    metrics.currentIngressThroughputBps + randomJitter(50_000_000),
  );
  metrics.currentPacketRatePps = Math.max(MIN_PACKET_RATE_PPS, metrics.currentPacketRatePps + randomJitter(8_000));
}

function pulseAllTenants(): void {
  for (const [tenantId, db] of tenantStore.entries()) {
    applyTrafficJitter(db.metrics);
    broadcastTenantEvent(tenantId, 'TELEMETRY_PULSE', {
      currentIngressThroughputBps: db.metrics.currentIngressThroughputBps,
      currentPacketRatePps: db.metrics.currentPacketRatePps,
      kernelDropPps: db.metrics.kernelDropPps,
      lastCanaryAuditTime: db.metrics.lastCanaryAuditTime,
    });
  }
}

export function startHeartbeatSimulation(): void {
  if (started) return;
  started = true;
  setInterval(pulseAllTenants, HEARTBEAT_INTERVAL_MS).unref();
}
