export type AnomalySignalType = 'JA4_FINGERPRINT' | 'DNS_ENTROPY' | 'SMB_NAMED_PIPE' | 'BEACON_CADENCE';

export type AnomalyRisk = 'CRITICAL' | 'HIGH' | 'ELEVATED';

export interface AnomalySignal {
  id: string;
  type: AnomalySignalType;
  indicator: string;
  detail: string;
  sourceIp: string;
  destination: string;
  risk: AnomalyRisk;
  timestamp: string;
}

export interface ProtocolShare {
  name: string;
  pct: number;
  color: string;
}

export type KillChainSeverity = 'CRITICAL' | 'ELEVATED' | 'NOMINAL';

export interface KillChainStage {
  stage: string;
  technique: string;
  hits: number;
  severity: KillChainSeverity;
}

export type TimeRange = '15m' | '1h' | '6h' | '24h';
