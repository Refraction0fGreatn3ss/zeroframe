export type TenantTier = 'PRODUCTION' | 'ISOLATED';

export interface TenantDescriptor {
  id: string;
  name: string;
  tier: TenantTier;
}

const AVAILABLE_TENANTS: TenantDescriptor[] = [
  { id: 'tenant-enterprise-hq', name: 'Global Enterprise HQ', tier: 'PRODUCTION' },
  { id: 'tenant-emea-finance', name: 'EMEA Financial Operations', tier: 'PRODUCTION' },
  { id: 'tenant-scada-grid', name: 'Critical Infrastructure SCADA / OT', tier: 'ISOLATED' },
];

export const RUNTIME_CONFIG = {
  productName: 'ZeroFlash Enterprise',
  version: '1.0.0-PROD',
  buildHash: 'b29d32797860d94f2e2c419b36b9961233968666',
  databaseSchemaVersion: 51,
  canonicalEventSchema: 'zeroflash.canonical-event.v1',
  apiBaseUrl: '/api/v1',
  websocketUrl: '/ws/events',
  availableTenants: AVAILABLE_TENANTS,
  defaultTenantId: 'tenant-enterprise-hq',
  canaryIntervalSeconds: 60,
  maxAllowedQueueLossPps: 10,
};
