/**
 * ZeroFlash Runtime Configuration
 * Distinguishes between Production Backend vs Air-Gapped Simulation Mode
 */

export const RUNTIME_CONFIG = {
  productName: 'ZeroFlash Enterprise',
  version: '1.0.0-PROD',
  buildHash: 'b29d32797860d94f2e2c419b36b9961233968666',
  databaseSchemaVersion: 51,
  canonicalEventSchema: 'zeroflash.canonical-event.v1',

  // API & WebSocket defaults
  apiBaseUrl: '/api/v1',
  websocketUrl: '/ws/events',

  // Default Tenant & Organizations
  availableTenants: [
    { id: 'tenant-enterprise-hq', name: 'Global Enterprise HQ', tier: 'PRODUCTION' },
    { id: 'tenant-emea-finance', name: 'EMEA Financial Operations', tier: 'PRODUCTION' },
    { id: 'tenant-scada-grid', name: 'Critical Infrastructure SCADA / OT', tier: 'ISOLATED' },
  ],
  defaultTenantId: 'tenant-enterprise-hq',

  // Detection assurance parameters
  canaryIntervalSeconds: 60,
  maxAllowedQueueLossPps: 10,
};
