import { MINUTE_MS } from '../config.ts';
import type { TenantContext } from '../types/tenant.ts';

const SCADA_TENANT_ID = 'tenant-scada-grid';

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * MINUTE_MS).toISOString();
}

export function buildTenantNotifications({ id: tenantId, db }: TenantContext) {
  const captureDegraded = db.metrics.captureState === 'DEGRADED';

  return [
    {
      id: `notif-${tenantId}-1`,
      category: 'INCIDENT',
      severity: 'CRITICAL',
      title: tenantId === SCADA_TENANT_ID ? 'OT Protocol FC05 Coil Override' : 'Adversary Lateral Movement Cluster',
      message: db.incidents[0]?.plainEnglishSummary || 'Active security threat detected',
      timestamp: minutesAgo(3),
      read: false,
      acknowledged: false,
      deepLink: '/investigate/incidents',
      fingerprintHash: `hash-inc-${tenantId}-01`,
      tenantId,
    },
    {
      id: `notif-${tenantId}-2`,
      category: 'DETECTION',
      severity: 'HIGH',
      title: 'Detection Assurance Canary Health',
      message:
        db.metrics.detectorsDegraded > 0
          ? 'Canary for detector c2_beaconing.py reports queue drop jitter'
          : 'All detection canaries passed signed validation',
      timestamp: minutesAgo(12),
      read: false,
      acknowledged: false,
      deepLink: '/system/assurance',
      fingerprintHash: `hash-det-${tenantId}-02`,
      tenantId,
    },
    {
      id: `notif-${tenantId}-3`,
      category: 'VISIBILITY',
      severity: captureDegraded ? 'MEDIUM' : 'LOW',
      title: 'Network Visibility Status',
      message: captureDegraded
        ? 'Core-Switch-02 reports 18% unidirectional flows. Asymmetric return path uninspected.'
        : 'Passive TAP observation fidelity nominal at 99.8%.',
      timestamp: minutesAgo(34),
      read: true,
      acknowledged: false,
      deepLink: '/system/inspection',
      fingerprintHash: `hash-vis-${tenantId}-03`,
      tenantId,
    },
    {
      id: `notif-${tenantId}-4`,
      category: 'RESPONSE',
      severity: 'HIGH',
      title: 'Governed Response Permit Awaiting Approver 2',
      message: 'Dual-control permit for isolating 10.140.2.88 approved by Approver 1. Approver 2 pending.',
      timestamp: minutesAgo(120),
      read: false,
      acknowledged: false,
      deepLink: '/respond/permits',
      fingerprintHash: `hash-resp-${tenantId}-04`,
      tenantId,
    },
  ];
}
