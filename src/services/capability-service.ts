import { apiClient } from './api-client';

export type CapabilityStatus = 'UNKNOWN' | 'LOADING' | 'FRESH' | 'STALE' | 'UNAVAILABLE' | 'FAILED';

export interface BackendCapability {
  id: string;
  name: string;
  status: CapabilityStatus;
  details: string;
}

export interface CapabilityManifest {
  status: CapabilityStatus;
  manifestVersion: string;
  generatedAt: string;
  capabilities: BackendCapability[];
}

function buildFailedManifest(): CapabilityManifest {
  return {
    status: 'FAILED',
    manifestVersion: 'UNKNOWN',
    generatedAt: new Date().toISOString(),
    capabilities: [],
  };
}

export const capabilityService = {
  async getCapabilities(): Promise<CapabilityManifest> {
    try {
      const res = await apiClient.get<CapabilityManifest>('/capabilities');
      return res.data;
    } catch {
      return buildFailedManifest();
    }
  },
};
