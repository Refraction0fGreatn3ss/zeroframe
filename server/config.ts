export const API_BASE_PATH = '/api/v1';
export const WEBSOCKET_PATH = '/ws/events';
export const DEFAULT_TENANT_ID = 'tenant-enterprise-hq';
export const AUDIT_TENANT_ID = DEFAULT_TENANT_ID;

export const MINUTE_MS = 60 * 1000;
export const HOUR_MS = 60 * MINUTE_MS;

export const DEFAULT_INACTIVITY_POLICY = '15m';
export const DEFAULT_INACTIVITY_TIMEOUT_MS = 15 * MINUTE_MS;
export const INACTIVITY_POLICY_MS: Record<string, number> = {
  '5m': 5 * MINUTE_MS,
  '10m': 10 * MINUTE_MS,
  '15m': 15 * MINUTE_MS,
};

export const STEP_UP_DURATION_MS = 30 * MINUTE_MS;
export const EVENT_LOG_CAPACITY = 200;
export const HEARTBEAT_INTERVAL_MS = 8000;
export const PCAP_EXTRACTION_DELAY_MS = 3000;
export const WEBSOCKET_AUTH_TIMEOUT_MS = 5000;
export const WEBSOCKET_MAX_PAYLOAD_BYTES = 65536;
export const JSON_BODY_LIMIT = '1mb';

export const isProduction = (): boolean => process.env.NODE_ENV === 'production';

export function resolvePort(): number {
  return process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
}
