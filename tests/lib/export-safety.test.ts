import { describe, expect, it } from 'vitest';
import { calculateExportRisk, generateProofOfOrigin, sanitizeExportData } from '../../src/lib/export-safety';

describe('export safety', () => {
  const sensitiveRecord = {
    id: 'INC-TEST-001',
    token: 'bearer-token-value',
    password: 'SuperSecretEnterprisePassword123!',
    privateKey: '-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----',
    normalField: 'Normal telemetry value',
  };

  it('redacts credentials, tokens and private keys but keeps safe fields', () => {
    const [item] = sanitizeExportData([sensitiveRecord], 'tenant-test');
    expect(item.token).toContain('REDACTED');
    expect(item.password).toContain('REDACTED');
    expect(item.privateKey).toContain('REDACTED');
    expect(item.normalField).toBe('Normal telemetry value');
  });

  it('flags high-risk fields', () => {
    const risk = calculateExportRisk(sensitiveRecord);
    expect(risk.score).toBeGreaterThanOrEqual(50);
    expect(risk.highRiskFields.length).toBeGreaterThanOrEqual(3);
  });

  it('builds a proof of origin scoped to the operator tenant', () => {
    const proof = generateProofOfOrigin('Incident_Dossier', 10, {
      username: 'analyst',
      role: 'Lead',
      tenantId: 'tenant-a',
    });
    expect(proof.operatorSignoff).toBe('analyst (Lead)');
    expect(proof.tenantIsolationScope).toBe('tenant-a');
  });
});
