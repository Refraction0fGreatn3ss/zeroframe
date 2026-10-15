import type { TenantDescriptor } from '../config/runtime';
import { RUNTIME_CONFIG } from '../config/runtime';
import { createStore, useStore } from '../lib/create-store';
import { getErrorMessage } from '../lib/error-message';
import { apiClient } from '../services/api-client';
import { realtimeClient } from '../services/realtime-client';
import { tenantRegistry } from './tenant-registry';

interface TenantState {
  currentTenantId: string;
  tenants: TenantDescriptor[];
  isSwitching: boolean;
  switchError: string | null;
}

const tenantStore = createStore<TenantState>({
  currentTenantId: RUNTIME_CONFIG.defaultTenantId,
  tenants: RUNTIME_CONFIG.availableTenants,
  isSwitching: false,
  switchError: null,
});

function isKnownTenant(tenantId: string): boolean {
  return tenantStore.getState().tenants.some((tenant) => tenant.id === tenantId);
}

function getCurrentTenant(state: TenantState): TenantDescriptor {
  return state.tenants.find((tenant) => tenant.id === state.currentTenantId) || state.tenants[0];
}

// Order matters for hard tenant isolation: nothing from the old tenant may survive into the new scope.
async function switchTenant(nextTenantId: string) {
  const { currentTenantId: previousTenantId, isSwitching } = tenantStore.getState();
  if (previousTenantId === nextTenantId || isSwitching) {
    return;
  }

  if (!isKnownTenant(nextTenantId)) {
    console.error(`Attempted switch to unauthorized tenant: ${nextTenantId}`);
    return;
  }

  try {
    tenantStore.setState({ isSwitching: true, switchError: null });

    apiClient.abortTenantRequests(previousTenantId);
    realtimeClient.disconnect();
    tenantRegistry.clearAll();

    apiClient.setTenantId(nextTenantId);
    tenantStore.setState({ currentTenantId: nextTenantId });

    realtimeClient.connect(nextTenantId);
    await tenantRegistry.reloadAll(nextTenantId);
  } catch (err) {
    console.error('[ZeroFrame Tenant Isolation] Error during tenant switch', err);
    tenantStore.setState({ switchError: getErrorMessage(err, 'Tenant transition error') });
  } finally {
    tenantStore.setState({ isSwitching: false });
  }
}

export const tenantActions = {
  switchTenant,
};

export function useTenantStore() {
  const state = useStore(tenantStore);
  return {
    ...state,
    currentTenant: getCurrentTenant(state),
    ...tenantActions,
  };
}
