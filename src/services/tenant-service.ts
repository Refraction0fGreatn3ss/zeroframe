import type { TenantDescriptor } from '../config/runtime';
import { apiClient } from './api-client';
import type { RequestContext } from './http-types';

export interface TenantDirectory {
  tenants: TenantDescriptor[];
  defaultTenantId: string | null;
}

export const tenantService = {
  async listTenants(context: RequestContext = {}): Promise<TenantDirectory> {
    const res = await apiClient.get<TenantDirectory>('/tenants', { signal: context.signal, tenantId: undefined });
    return { tenants: res.data.tenants ?? [], defaultTenantId: res.data.defaultTenantId ?? null };
  },
};
