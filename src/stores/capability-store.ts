import { createStore, useStore } from '../lib/create-store';
import type { BackendCapability, CapabilityStatus } from '../services/capability-service';
import { capabilityService } from '../services/capability-service';
import { tenantRegistry } from './tenant-registry';

interface CapabilityStoreState {
  status: CapabilityStatus;
  manifestVersion: string;
  generatedAt: string;
  capabilities: BackendCapability[];
  isLoading: boolean;
}

const capabilityStore = createStore<CapabilityStoreState>({
  status: 'LOADING',
  manifestVersion: 'UNKNOWN',
  generatedAt: new Date().toISOString(),
  capabilities: [],
  isLoading: false,
});

async function loadCapabilities() {
  capabilityStore.setState({ isLoading: true });
  try {
    const manifest = await capabilityService.getCapabilities();
    capabilityStore.setState({
      status: manifest.status,
      manifestVersion: manifest.manifestVersion,
      generatedAt: manifest.generatedAt,
      capabilities: manifest.capabilities,
    });
  } catch {
    capabilityStore.setState({ status: 'FAILED' });
  } finally {
    capabilityStore.setState({ isLoading: false });
  }
}

loadCapabilities();

tenantRegistry.register(
  () => capabilityStore.setState({ status: 'STALE' }),
  () => loadCapabilities(),
);

export const capabilityActions = {
  refreshCapabilities: () => loadCapabilities(),
};

export function useCapabilityStore() {
  return { ...useStore(capabilityStore), ...capabilityActions };
}
