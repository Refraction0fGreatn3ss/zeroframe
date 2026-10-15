import { RUNTIME_CONFIG } from '../config/runtime';

export interface ExportManifest {
  exportId: string;
  tenantId: string;
  requestedBy: string;
  format: 'JSON' | 'CSV' | 'CEF' | 'LEEF' | 'RFC_5424' | 'STIX_2_1' | 'PCAPNG';
  schemaVersion: string;
  recordCount: number;
  evidenceValidity: string;
  redactedFieldsCount: number;
  checksumSha256: string;
  generatedAt: string;
}

export interface ExportOperator {
  username: string;
  role: string;
  tenantId: string;
}

export interface ProofOfOrigin {
  watermarkToken: string;
  cryptographicHash: string;
  operatorSignoff: string;
  tenantIsolationScope: string;
  timestamp: string;
  recordCount: number;
}

const REDACTION_PLACEHOLDER = '[REDACTED_BY_SECURITY_POLICY]';
const RISK_POINTS_PER_SENSITIVE_FIELD = 25;
const MAX_RISK_SCORE = 100;

const REDACTED_KEYS = new Set([
  'token',
  'jwt',
  'api_key',
  'apikey',
  'password',
  'secret',
  'private_key',
  'privkey',
  'authorization',
  'session_cookie',
]);

const SENSITIVE_KEY_FRAGMENTS = ['secret', 'token', 'password', 'key', 'cookie'];

function isSensitiveKey(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return REDACTED_KEYS.has(lowerKey) || SENSITIVE_KEY_FRAGMENTS.some((fragment) => lowerKey.includes(fragment));
}

function readTenantId(record: object): unknown {
  return (record as { tenantId?: unknown }).tenantId;
}

function redactInPlace(node: unknown, onRedacted: () => void): void {
  if (!node || typeof node !== 'object') return;
  const container = node as Record<string, unknown>;
  for (const key of Object.keys(container)) {
    if (isSensitiveKey(key)) {
      container[key] = REDACTION_PLACEHOLDER;
      onRedacted();
    } else if (typeof container[key] === 'object') {
      redactInPlace(container[key], onRedacted);
    }
  }
}

export function sanitizeRecordForExport<T extends object>(
  record: T,
  tenantScope: string,
): { sanitized: T; redactedCount: number } {
  const clone = JSON.parse(JSON.stringify(record)) as T;

  const recordTenantId = readTenantId(clone);
  if (recordTenantId && recordTenantId !== tenantScope) {
    throw new Error(
      `CRITICAL SECURITY VIOLATION: Tenant isolation breach attempted (${String(recordTenantId)} != ${tenantScope})`,
    );
  }

  let redactedCount = 0;
  redactInPlace(clone, () => {
    redactedCount++;
  });
  return { sanitized: clone, redactedCount };
}

export function sanitizeExportData<T extends object>(
  records: T[],
  tenantScope: string = RUNTIME_CONFIG.defaultTenantId,
): T[] {
  return records.map((record) => {
    const recordTenantId = readTenantId(record);
    const scope = typeof recordTenantId === 'string' && recordTenantId ? recordTenantId : tenantScope;
    return sanitizeRecordForExport(record, scope).sanitized;
  });
}

export function calculateExportRisk(record: object): { score: number; highRiskFields: string[] } {
  const highRiskFields = Object.keys(record).filter(isSensitiveKey);
  const score = highRiskFields.length * RISK_POINTS_PER_SENSITIVE_FIELD;
  return { score: Math.min(MAX_RISK_SCORE, score), highRiskFields };
}

export function generateProofOfOrigin(
  resourceName: string,
  recordCount: number,
  operator: ExportOperator,
): ProofOfOrigin {
  return {
    watermarkToken: `ZF-WATERMARK-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    cryptographicHash: `sha256-proof-${Date.now()}-${resourceName}-verified`,
    operatorSignoff: `${operator.username} (${operator.role})`,
    tenantIsolationScope: operator.tenantId,
    timestamp: new Date().toISOString(),
    recordCount,
  };
}
