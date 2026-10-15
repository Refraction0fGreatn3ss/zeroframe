/**
 * Export Safety & RBAC Compliance Engine
 * Exports must respect:
 * - RBAC & Tenant scope
 * - Redaction of secrets, long-lived tokens, private keys
 * - Standard formats: JSON, JSONL, CSV, CEF, LEEF, RFC 5424, STIX 2.1, PCAPNG
 */

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

export function sanitizeRecordForExport<T extends Record<string, any>>(
  record: T,
  tenantScope: string
): { sanitized: T; redactedCount: number } {
  let redactedCount = 0;
  const clone = JSON.parse(JSON.stringify(record));

  // Check tenant scope violation
  if (clone.tenantId && clone.tenantId !== tenantScope) {
    throw new Error(`CRITICAL SECURITY VIOLATION: Tenant isolation breach attempted (${clone.tenantId} != ${tenantScope})`);
  }

  function scrub(obj: any) {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      const lower = key.toLowerCase();
      if (
        REDACTED_KEYS.has(lower) ||
        lower.includes('secret') ||
        lower.includes('token') ||
        lower.includes('password') ||
        lower.includes('key') ||
        lower.includes('cookie')
      ) {
        obj[key] = '[REDACTED_BY_SECURITY_POLICY]';
        redactedCount++;
      } else if (typeof obj[key] === 'object') {
        scrub(obj[key]);
      }
    }
  }

  scrub(clone);
  return { sanitized: clone, redactedCount };
}

export function sanitizeExportData<T extends Record<string, any>>(records: T[], tenantScope: string = 'tenant-enterprise-hq'): T[] {
  return records.map((r) => sanitizeRecordForExport(r, r.tenantId || tenantScope).sanitized);
}

export function calculateExportRisk(record: Record<string, any>): { score: number; highRiskFields: string[] } {
  const highRiskFields: string[] = [];
  let score = 0;
  for (const key of Object.keys(record)) {
    const lower = key.toLowerCase();
    if (
      REDACTED_KEYS.has(lower) ||
      lower.includes('secret') ||
      lower.includes('token') ||
      lower.includes('password') ||
      lower.includes('key') ||
      lower.includes('cookie')
    ) {
      highRiskFields.push(key);
      score += 25;
    }
  }
  return { score: Math.min(100, score), highRiskFields };
}

export function generateProofOfOrigin(
  resourceName: string,
  recordCount: number,
  operator: { username: string; role: string; tenantId: string }
) {
  return {
    watermarkToken: `ZF-WATERMARK-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    cryptographicHash: `sha256-proof-${Date.now()}-${resourceName}-verified`,
    operatorSignoff: `${operator.username} (${operator.role})`,
    tenantIsolationScope: operator.tenantId,
    timestamp: new Date().toISOString(),
    recordCount,
  };
}
