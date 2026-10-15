import { apiClient } from '../services/api-client';
import { realtimeClient } from '../services/realtime-client';
import { authStore, revokeLocalSession } from '../stores/auth-store';
import { capabilityResource } from '../stores/capability-store';
import { drawerActions } from '../stores/context-drawer-store';
import { tenantRegistry } from '../stores/tenant-registry';
import { resetTenantContext, resolveTenant } from '../stores/tenant-store';

let sessionActive = false;

async function startSession(): Promise<void> {
  sessionActive = true;
  const tenantId = await resolveTenant();
  if (!tenantId || !sessionActive) return;
  await Promise.allSettled([capabilityResource.actions.load(), tenantRegistry.reloadAll(tenantId)]);
}

function endSession(): void {
  sessionActive = false;
  apiClient.abortAll();
  resetTenantContext();
  tenantRegistry.clearAll();
  drawerActions.reset();
}

/** Wires auth → tenant → realtime ordering. Realtime never connects before auth and tenant are both resolved. */
export function startSessionLifecycle(): () => void {
  let previousStatus = authStore.getState().status;

  const unsubscribeAuth = authStore.subscribe(() => {
    const { status } = authStore.getState();
    if (status === previousStatus) return;
    previousStatus = status;
    if (status === 'AUTHENTICATED') void startSession();
    if (status === 'UNAUTHENTICATED') endSession();
  });

  const unsubscribeRevocation = realtimeClient.onAuthRevoked((reason) => {
    if (authStore.getState().isAuthenticated) revokeLocalSession(reason, true);
  });

  const unsubscribeResync = realtimeClient.onResyncRequired(() => {
    const tenantId = apiClient.getTenantId();
    if (tenantId) void tenantRegistry.reloadAll(tenantId);
  });

  if (authStore.getState().status === 'AUTHENTICATED') void startSession();

  return () => {
    unsubscribeAuth();
    unsubscribeRevocation();
    unsubscribeResync();
  };
}
