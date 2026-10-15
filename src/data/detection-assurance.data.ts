import { secondsAgo } from '../lib/relative-time';
import type { CanaryAuditRecord } from '../stores/detection-assurance-store/canary-audit';

export const DEFAULT_CANARY_AUDIT: CanaryAuditRecord[] = [
  {
    id: 'audit-1',
    detectorKey: 'lateral_movement.py',
    detectorName: 'Lateral Movement (RPC/PsExec/WMI/SSH)',
    timestamp: secondsAgo(25),
    signedCanaryHash: 'sha256-e8f01a39...42bd',
    syntheticPayloadType: 'SAFE_SYNTHETIC_RPC_BIND_CANARY',
    result: 'VERIFIED',
    latencyMs: 14.2,
    witnessSignature: 'wit-sig-ecdsa-p256-verified-8891',
  },
  {
    id: 'audit-2',
    detectorKey: 'c2_beaconing.py',
    detectorName: 'C2 Periodic Beaconing (FFT / Autocorrelation)',
    timestamp: secondsAgo(45),
    signedCanaryHash: 'sha256-3c78b10e...88ab',
    syntheticPayloadType: 'SAFE_SYNTHETIC_JITTER_INTERVAL_FRAME',
    result: 'TIMEOUT',
    latencyMs: 350.0,
    witnessSignature: 'wit-sig-ecdsa-p256-verified-8892',
  },
];
