import { TENANT_SEEDS } from '../data/tenants/index.ts';
import type { TenantDatabase } from '../types/tenant.ts';

const tenantDatabases: Record<string, TenantDatabase> = Object.fromEntries(
  Object.entries(TENANT_SEEDS).map(([tenantId, { seed, initialSeq }]) => [
    tenantId,
    { ...seed, seqCounter: initialSeq, eventLog: [] },
  ]),
);

export const tenantStore = {
  find(tenantId: string | undefined): TenantDatabase | undefined {
    if (!tenantId || !Object.hasOwn(tenantDatabases, tenantId)) return undefined;
    return tenantDatabases[tenantId];
  },

  exists(tenantId: string): boolean {
    return Object.hasOwn(tenantDatabases, tenantId);
  },

  entries(): Array<[string, TenantDatabase]> {
    return Object.entries(tenantDatabases);
  },
};
