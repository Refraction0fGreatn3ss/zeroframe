import { INITIAL_AUDIT_LOGS, INITIAL_INTEGRATIONS, INITIAL_LICENSE } from '../data/admin.data';
import { createStore, useStore } from '../lib/create-store';
import { systemService } from '../services/system-service';
import type { AuditLogEntry, EnterpriseIntegration, EnterpriseLicense } from '../types/admin';
import { tenantRegistry } from './tenant-registry';

interface AdminState {
  integrations: EnterpriseIntegration[];
  license: EnterpriseLicense;
  auditLogs: AuditLogEntry[];
  isLoading: boolean;
}

const SIMULATED_SYNC_MIN_LATENCY_MS = 40;
const SIMULATED_SYNC_LATENCY_JITTER_MS = 60;

const adminStore = createStore<AdminState>({
  integrations: INITIAL_INTEGRATIONS,
  license: INITIAL_LICENSE,
  auditLogs: INITIAL_AUDIT_LOGS,
  isLoading: false,
});

function withFallback<T>(value: T | undefined, fallback: T): T {
  return value !== undefined ? value : fallback;
}

async function loadAdminData() {
  adminStore.setState({ isLoading: true });
  try {
    const [integrations, auditLogs, license]: [
      EnterpriseIntegration[] | undefined,
      AuditLogEntry[] | undefined,
      EnterpriseLicense | undefined,
    ] = await Promise.all([
      systemService.getIntegrations(),
      systemService.getAuditLogs(),
      systemService.getLicensing(),
    ]);

    adminStore.setState({
      integrations: withFallback(integrations, INITIAL_INTEGRATIONS),
      auditLogs: withFallback(auditLogs, INITIAL_AUDIT_LOGS),
      license: withFallback(license, INITIAL_LICENSE),
    });
  } catch (err) {
    console.warn('[Admin Store] Failed to load authoritative admin data', err);
  } finally {
    adminStore.setState({ isLoading: false });
  }
}

loadAdminData();

tenantRegistry.register(
  () => adminStore.setState({ integrations: [], auditLogs: [] }),
  async () => {
    await loadAdminData();
  },
);

function simulateSyncLatencyMs(): number {
  return Math.floor(SIMULATED_SYNC_MIN_LATENCY_MS + Math.random() * SIMULATED_SYNC_LATENCY_JITTER_MS);
}

function testIntegrationSync(id: string) {
  adminStore.setState((state) => ({
    integrations: state.integrations.map(
      (integration): EnterpriseIntegration =>
        integration.id === id
          ? {
              ...integration,
              lastSyncTimestamp: new Date().toISOString(),
              apiCallLatencyMs: simulateSyncLatencyMs(),
              status: 'HEALTHY',
            }
          : integration,
    ),
  }));
}

export const adminActions = {
  testIntegrationSync,
  reload: loadAdminData,
};

export function useAdminStore() {
  return { ...useStore(adminStore), ...adminActions };
}
