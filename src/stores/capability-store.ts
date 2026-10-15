/**
 * Capability Negotiation Store
 * Connects frontend to the authoritative backend capability manifest.
 * States: UNKNOWN | LOADING | FRESH | STALE | UNAVAILABLE | FAILED
 */

import { useState, useEffect } from 'react';
import { capabilityService, CapabilityManifest, BackendCapability, CapabilityStatus } from '../services/capability-service';
import { tenantRegistry } from './tenant-registry';

interface CapabilityStoreState {
  status: CapabilityStatus;
  manifestVersion: string;
  generatedAt: string;
  capabilities: BackendCapability[];
  isLoading: boolean;
}

let capabilityState: CapabilityStoreState = {
  status: 'LOADING',
  manifestVersion: 'UNKNOWN',
  generatedAt: new Date().toISOString(),
  capabilities: [],
  isLoading: false,
};

const listeners = new Set<(state: CapabilityStoreState) => void>();

function notify() {
  listeners.forEach((l) => l({ ...capabilityState }));
}

async function loadCapabilities() {
  capabilityState.isLoading = true;
  notify();
  try {
    const manifest = await capabilityService.getCapabilities();
    capabilityState.status = manifest.status;
    capabilityState.manifestVersion = manifest.manifestVersion;
    capabilityState.generatedAt = manifest.generatedAt;
    capabilityState.capabilities = manifest.capabilities;
  } catch {
    capabilityState.status = 'FAILED';
  } finally {
    capabilityState.isLoading = false;
    notify();
  }
}

// Initial load
loadCapabilities();

// Register with tenant isolation registry
tenantRegistry.register(
  () => {
    capabilityState.status = 'STALE';
    notify();
  },
  async () => {
    await loadCapabilities();
  }
);

export function useCapabilityStore() {
  const [state, setState] = useState<CapabilityStoreState>(capabilityState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const refreshCapabilities = () => loadCapabilities();

  return {
    ...state,
    refreshCapabilities,
  };
}
