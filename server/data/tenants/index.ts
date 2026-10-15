import type { TenantSeed } from '../../types/tenant.ts';
import { emeaFinanceSeed } from './emea-finance.ts';
import { enterpriseHqSeed } from './enterprise-hq/index.ts';
import { scadaGridSeed } from './scada-grid.ts';

export interface TenantSeedEntry {
  seed: TenantSeed;
  initialSeq: number;
}

export const TENANT_SEEDS: Record<string, TenantSeedEntry> = {
  'tenant-enterprise-hq': { seed: enterpriseHqSeed, initialSeq: 100 },
  'tenant-emea-finance': { seed: emeaFinanceSeed, initialSeq: 40 },
  'tenant-scada-grid': { seed: scadaGridSeed, initialSeq: 15 },
};
