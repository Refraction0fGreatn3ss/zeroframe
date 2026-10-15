import type { TenantDescriptor } from '../config/runtime';
import { createStore, useStore } from '../lib/create-store';
import { type LoadIssue, toLoadIssue } from '../lib/load-state';
import { apiClient } from '../services/api-client';
import { realtimeClient } from '../services/realtime-client';
import { tenantService } from '../services/tenant-service';
import { tenantRegistry } from './tenant-registry';

export type TenantResolution = 'UNRESOLVED' | 'RESOLVING' | 'RESOLVED' | 'FAILED';

interface TenantState {
  resolution: TenantResolution;
  currentTenantId: string | null;
  tenants: TenantDescriptor[];
  isSwitching: boolean;
  issue: LoadIssue | null;
}

const LAST_TENANT_STORAGE_KEY = 'zf_last_tenant';

const initialState = (): TenantState => ({
  resolution: 'UNRESOLVED',
  currentTenantId: null,
  tenants: [],
  isSwitching: false,
  issue: null,
});

export const tenantStore = createStore<TenantState>(initialState());

function readLastTenant(): string | null {
  try {
    return sessionStorage.getItem(LAST_TENANT_STORAGE_KEY);
  } catch {
    return null;
  }
}

function rememberTenant(tenantId: string | null): void {
  try {
    if (tenantId) sessionStorage.setItem(LAST_TENANT_STORAGE_KEY, tenantId);
    else sessionStorage.removeItem(LAST_TENANT_STORAGE_KEY);
  } catch {
    // Remembering the tenant is a convenience only.
  }
}

function chooseTenant(tenants: TenantDescriptor[], defaultTenantId: string | null): string | null {
  const remembered = readLastTenant();
  if (remembered && tenants.some((tenant) => tenant.id === remembered)) return remembered;
  if (defaultTenantId && tenants.some((tenant) => tenant.id === defaultTenantId)) return defaultTenantId;
  return tenants[0]?.id ?? null;
}

function activate(tenantId: string): void {
  apiClient.setTenantId(tenantId);
  rememberTenant(tenantId);
  tenantStore.setState({ currentTenantId: tenantId });
  realtimeClient.connect(tenantId);
}

export async function resolveTenant(): Promise<string | null> {
  tenantStore.setState({ resolution: 'RESOLVING', issue: null });
  try {
    const { tenants, defaultTenantId } = await tenantService.listTenants();
    const tenantId = chooseTenant(tenants, defaultTenantId);
    if (!tenantId) {
      tenantStore.setState({
        resolution: 'FAILED',
        tenants,
        issue: { kind: 'NOT_FOUND', message: 'No tenant is assigned to this operator.' },
      });
      return null;
    }
    tenantStore.setState({ tenants, resolution: 'RESOLVED' });
    activate(tenantId);
    return tenantId;
  } catch (error) {
    tenantStore.setState({ resolution: 'FAILED', issue: toLoadIssue(error) });
    return null;
  }
}

export function resetTenantContext(): void {
  realtimeClient.disconnect();
  apiClient.setTenantId(null);
  tenantStore.setState(initialState());
}

async function switchTenant(nextTenantId: string) {
  const { currentTenantId: previousTenantId, isSwitching, tenants } = tenantStore.getState();
  if (previousTenantId === nextTenantId || isSwitching) return;
  if (!tenants.some((tenant) => tenant.id === nextTenantId)) {
    console.error(`Attempted switch to unauthorized tenant: ${nextTenantId}`);
    return;
  }

  tenantStore.setState({ isSwitching: true, issue: null });
  try {
    if (previousTenantId) apiClient.abortTenantRequests(previousTenantId);
    realtimeClient.disconnect();
    tenantRegistry.clearAll();
    activate(nextTenantId);
    void tenantRegistry.reloadAll(nextTenantId);
  } catch (error) {
    tenantStore.setState({ issue: toLoadIssue(error) });
  } finally {
    tenantStore.setState({ isSwitching: false });
  }
}

export const tenantActions = {
  switchTenant,
};

export function currentTenantOf(state: TenantState): TenantDescriptor | null {
  return state.tenants.find((tenant) => tenant.id === state.currentTenantId) ?? null;
}

export function useTenantStore() {
  const state = useStore(tenantStore);
  return { ...state, currentTenant: currentTenantOf(state), ...tenantActions };
}
