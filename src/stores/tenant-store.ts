/**
 * Tenant Store - Enforces Hard Tenant Isolation
 * Cross-tenant leakage is a release-blocking defect.
 * 
 * 11-Step Tenant Switch Lifecycle:
 * 1. Pause new tenant requests
 * 2. Abort old in-flight requests
 * 3. Disconnect old realtime WebSocket
 * 4. Clear tenant-scoped state
 * 5. Clear tenant caches
 * 6. Clear search results
 * 7. Clear sensitive notifications
 * 8. Establish new tenant scope
 * 9. Reconnect realtime
 * 10. Reload tenant data
 * 11. Mark switch complete
 */

import { useState, useEffect } from 'react';
import { RUNTIME_CONFIG } from '../config/runtime';
import { apiClient } from '../services/api-client';
import { realtimeClient } from '../services/realtime-client';
import { tenantRegistry } from './tenant-registry';

interface TenantState {
  currentTenantId: string;
  tenants: typeof RUNTIME_CONFIG.availableTenants;
  isSwitching: boolean;
  switchError: string | null;
}

let tenantState: TenantState = {
  currentTenantId: RUNTIME_CONFIG.defaultTenantId,
  tenants: RUNTIME_CONFIG.availableTenants,
  isSwitching: false,
  switchError: null,
};

const listeners = new Set<(state: TenantState) => void>();

function notify() {
  listeners.forEach((l) => l({ ...tenantState }));
}

export function useTenantStore() {
  const [state, setState] = useState<TenantState>(tenantState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const switchTenant = async (newTenantId: string) => {
    if (tenantState.currentTenantId === newTenantId || tenantState.isSwitching) {
      return;
    }

    if (!tenantState.tenants.some((t) => t.id === newTenantId)) {
      console.error(`Attempted switch to unauthorized tenant: ${newTenantId}`);
      return;
    }

    const oldTenantId = tenantState.currentTenantId;

    try {
      // Step 1: Pause new tenant requests & mark switching in progress
      tenantState.isSwitching = true;
      tenantState.switchError = null;
      notify();

      // Step 2: Abort old in-flight requests
      apiClient.abortTenantRequests(oldTenantId);

      // Step 3: Disconnect old realtime connection
      realtimeClient.disconnect();

      // Step 4, 5, 6, 7: Clear all tenant-scoped state, caches, search results, and notifications
      tenantRegistry.clearAll();

      // Step 8: Establish new tenant scope in API client
      apiClient.setTenantId(newTenantId);
      tenantState.currentTenantId = newTenantId;
      notify();

      // Step 9: Reconnect realtime scoped to new tenant
      realtimeClient.connect(newTenantId);

      // Step 10: Reload tenant data across all stores from authoritative backend
      await tenantRegistry.reloadAll(newTenantId);
    } catch (err: any) {
      console.error('[ZeroFrame Tenant Isolation] Error during tenant switch', err);
      tenantState.switchError = err.message || 'Tenant transition error';
    } finally {
      // Step 11: Mark switch complete
      tenantState.isSwitching = false;
      notify();
    }
  };

  const currentTenant = tenantState.tenants.find((t) => t.id === tenantState.currentTenantId) || tenantState.tenants[0];

  return {
    ...state,
    currentTenant,
    switchTenant,
  };
}
