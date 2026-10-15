import { EVENT_LOG_CAPACITY } from '../config.ts';
import { tenantStore } from '../stores/tenant-store.ts';
import type { TenantEvent } from '../types/tenant.ts';
import { clientRegistry } from './client-registry.ts';

export function broadcastTenantEvent(tenantId: string, type: string, payload: unknown): void {
  const db = tenantStore.find(tenantId);
  if (!db) return;

  db.seqCounter += 1;
  const event: TenantEvent = {
    seq: db.seqCounter,
    tenantId,
    timestamp: new Date().toISOString(),
    type,
    payload,
  };

  db.eventLog.push(event);
  if (db.eventLog.length > EVENT_LOG_CAPACITY) {
    db.eventLog.shift();
  }

  const message = JSON.stringify(event);
  for (const client of clientRegistry.openClientsForTenant(tenantId)) {
    try {
      client.ws.send(message);
    } catch (err) {
      console.error('Failed to send websocket message', err);
    }
  }
}
