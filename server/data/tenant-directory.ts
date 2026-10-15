import { DEFAULT_TENANT_ID } from '../config.ts';

export const TENANT_DIRECTORY = {
  tenants: [
    {
      id: 'tenant-enterprise-hq',
      name: 'Global Enterprise HQ',
      tier: 'PRODUCTION',
      description: 'Primary enterprise network with full NDR & Live Assurance',
    },
    {
      id: 'tenant-emea-finance',
      name: 'EMEA Financial Operations',
      tier: 'PRODUCTION',
      description: 'High-assurance PCI-DSS segregated trading & settlement environment',
    },
    {
      id: 'tenant-scada-grid',
      name: 'Critical Infrastructure SCADA / OT',
      tier: 'ISOLATED',
      description: 'Air-gapped industrial grid with Modbus/DNP3 passive monitoring',
    },
  ],
  defaultTenantId: DEFAULT_TENANT_ID,
};
