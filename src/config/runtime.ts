export type TenantTier = 'PRODUCTION' | 'ISOLATED' | string;

export interface TenantDescriptor {
  id: string;
  name: string;
  tier: TenantTier;
  description?: string;
}

export const RUNTIME_CONFIG = {
  productName: 'ZeroFlash Enterprise',
  frontendVersion: __APP_VERSION__,
  buildId: import.meta.env.VITE_BUILD_ID || null,
  gitCommit: import.meta.env.VITE_GIT_COMMIT || null,
  apiBaseUrl: import.meta.env.VITE_ZEROFRAME_API_URL || '/api/v1',
  realtimePath: import.meta.env.VITE_ZEROFRAME_REALTIME_URL || '/ws/events',
};
