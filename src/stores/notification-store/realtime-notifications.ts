import type { RealtimeEvent } from '../../services/realtime-client';
import type { ZeroFlashNotification } from '../../types/notifications';

export function buildNotificationFromEvent(event: RealtimeEvent): ZeroFlashNotification | null {
  const timestamp = new Date().toISOString();

  if (event.type === 'PERMIT_ISSUED') {
    const permit = event.payload;
    return {
      id: `notif-${Date.now()}`,
      category: 'RESPONSE',
      severity: 'HIGH',
      title: 'New Governed Response Permit Issued',
      message: `Permit ${permit.id} for ${permit.targetResource} requires dual-control approval.`,
      timestamp,
      read: false,
      acknowledged: false,
      deepLink: '/respond/permits',
      fingerprintHash: `hash-${permit.id}`,
      tenantId: permit.tenantId,
    };
  }

  if (event.type === 'KILL_SWITCH_CHANGED') {
    return {
      id: `notif-${Date.now()}`,
      category: 'RESPONSE',
      severity: 'CRITICAL',
      title: 'Response Kill Switch Engaged',
      message: `Autonomous response engine blocked by operator ${event.payload.operator}.`,
      timestamp,
      read: false,
      acknowledged: false,
      deepLink: '/respond/studio',
      fingerprintHash: `hash-kill-switch-${Date.now()}`,
      tenantId: event.payload.tenantId ?? event.tenantId,
    };
  }

  return null;
}
