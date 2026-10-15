import { apiClient } from './api-client';
import type { RequestContext } from './http-types';

export interface BackendCapability {
  id: string;
  name: string;
  status: string;
  details?: string;
}

export interface CapabilityManifest {
  status: string;
  manifestVersion: string;
  generatedAt: string;
  capabilities: BackendCapability[];
}

export const capabilityService = {
  async getManifest(context: RequestContext = {}): Promise<CapabilityManifest> {
    const res = await apiClient.get<CapabilityManifest>('/capabilities', { signal: context.signal });
    return { ...res.data, capabilities: res.data.capabilities ?? [] };
  },
};
