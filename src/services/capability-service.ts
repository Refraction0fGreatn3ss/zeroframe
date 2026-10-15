/**
 * ZeroFrame Capability Negotiation Service
 * Connects frontend to the authoritative backend capability manifest.
 * States: UNKNOWN | LOADING | FRESH | STALE | UNAVAILABLE | FAILED
 */

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

export const capabilityService = {
  async getCapabilities(): Promise<CapabilityManifest> {
    try {
      const res = await apiClient.get<CapabilityManifest>('/capabilities');
      return res.data;
    } catch (err: any) {
      return {
        status: 'FAILED',
        manifestVersion: 'UNKNOWN',
        generatedAt: new Date().toISOString(),
        capabilities: [],
      };
    }
  },
};
