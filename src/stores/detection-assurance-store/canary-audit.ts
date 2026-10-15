import type { DetectionCapability } from '../../types';

export interface CanaryAuditRecord {
  id: string;
  detectorKey: string;
  detectorName: string;
  timestamp: string;
  signedCanaryHash: string;
  syntheticPayloadType: string;
  result: 'VERIFIED' | 'FAILED' | 'TIMEOUT' | 'THROTTLED';
  latencyMs: number;
  witnessSignature: string;
}

const BACKGROUND_CANARY_LATENCY_MS = 12.8;
const MANUAL_CANARY_LATENCY_MS = 18.5;
const CAPABILITY_HASH_LENGTH = 8;
const AUDIT_HASH_LENGTH = 10;

function randomSha256Label(length: number): string {
  return (
    'sha256-' +
    Math.random()
      .toString(36)
      .substring(2, 2 + length)
  );
}

export function randomCapabilityHash(): string {
  return randomSha256Label(CAPABILITY_HASH_LENGTH);
}

export function buildBackgroundCanaryRecord(timestamp: string, signedHash: string): CanaryAuditRecord {
  return {
    id: `audit-${Date.now()}`,
    detectorKey: 'canary_runner.py',
    detectorName: 'Automated Continuous Canary Suite',
    timestamp,
    signedCanaryHash: signedHash,
    syntheticPayloadType: 'BACKGROUND_CANARY_SUITE',
    result: 'VERIFIED',
    latencyMs: BACKGROUND_CANARY_LATENCY_MS,
    witnessSignature: 'wit-sig-p256-consensus',
  };
}

export function buildManualCanaryRecord(
  detectorKey: string,
  detectorName: string,
  timestamp: string,
): CanaryAuditRecord {
  return {
    id: `audit-${Date.now()}`,
    detectorKey,
    detectorName,
    timestamp,
    signedCanaryHash: randomSha256Label(AUDIT_HASH_LENGTH),
    syntheticPayloadType: 'SAFE_OPERATOR_REQUESTED_CANARY',
    result: 'VERIFIED',
    latencyMs: MANUAL_CANARY_LATENCY_MS,
    witnessSignature: 'wit-sig-ecdsa-p256-verified-manual',
  };
}

function auditMatchesCapability(record: CanaryAuditRecord, capability: DetectionCapability): boolean {
  const recordKey = record.detectorKey.toLowerCase();
  const capabilityKey = capability.detectorKey.toLowerCase();
  return (
    recordKey.includes(capabilityKey) ||
    capabilityKey.includes(recordKey) ||
    record.detectorName.toLowerCase() === capability.name.toLowerCase()
  );
}

export function backfillLastCanary(
  capability: DetectionCapability,
  auditLog: CanaryAuditRecord[],
): DetectionCapability {
  if (capability.lastCanaryTimestamp) {
    return capability;
  }
  const match = auditLog.find((record) => auditMatchesCapability(record, capability));
  if (!match) {
    return capability;
  }
  return {
    ...capability,
    lastCanaryTimestamp: match.timestamp,
    lastCanarySignedHash: match.signedCanaryHash,
  };
}
