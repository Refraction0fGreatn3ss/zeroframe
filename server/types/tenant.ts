export type TenantId = string;

export type SeedRecord = Record<string, unknown>;

export interface TenantMetrics {
  captureState: string;
  currentIngressThroughputBps: number;
  currentPacketRatePps: number;
  kernelDropPps: number;
  detectorsDegraded: number;
  lastCanaryAuditTime: string;
  governedResponseKillSwitch: boolean;
  [key: string]: unknown;
}

export interface ChartData {
  hourlyTrend: SeedRecord[];
  threatDistribution: SeedRecord[];
  severityBreakdown: SeedRecord[];
  assetCriticality: SeedRecord[];
}

export interface Incident {
  id: string;
  state: string;
  plainEnglishSummary?: string;
  [key: string]: unknown;
}

export interface ExecutionPermit {
  id: string;
  actionType: string;
  targetResource: string;
  reason: string;
  status: string;
  requestedBy: string;
  requestedAt: string;
  approver1: string;
  approver1Signature: string;
  approver2: string | null;
  blastRadiusValidated: boolean;
  compensatingControl: string;
  rollbackWindowSeconds: number;
  tenantId: TenantId;
}

export interface QuarantineRecord {
  id: string;
  targetIp: string;
  hostname: string;
  isolatedAt?: string;
  [key: string]: unknown;
}

export interface RollbackRecord {
  id: string;
  actionType: string;
  targetIp: string;
  hostname: string;
  appliedAt: string;
  rolledBackAt: string;
  initiatedBy: string;
  reason: string;
  status: string;
  tenantId: TenantId;
}

export interface PcapCapture {
  id: string;
  title: string;
  status: string;
  framesCaptured: number;
  totalBytes: number;
  startedAt: string;
  completedAt: string | null;
  sha256: string;
  downloadUrl: string;
  tenantId: TenantId;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  targetResource: string;
  ipAddress: string;
  status: string;
  details: string;
  signatureHash: string;
  tenantId: TenantId;
}

export interface FleetSensorSeed {
  id: string;
  [key: string]: unknown;
}

export interface TenantEvent {
  seq: number;
  tenantId: TenantId;
  timestamp: string;
  type: string;
  payload: unknown;
}

export interface TenantSeed {
  metrics: TenantMetrics;
  chartData: ChartData;
  incidents: Incident[];
  alerts: SeedRecord[];
  entities: SeedRecord[];
  permits: ExecutionPermit[];
  quarantine: QuarantineRecord[];
  rollbacks: RollbackRecord[];
  evidenceLedger: SeedRecord[];
  pcapCaptures: PcapCapture[];
  witnessNodes: SeedRecord[];
  fleetSensors: FleetSensorSeed[];
  inspectionPipeline: SeedRecord;
  detectionCapabilities: SeedRecord[];
  complianceFrameworks: SeedRecord[];
  integrations: SeedRecord[];
  auditLogs: AuditLogEntry[];
}

export interface TenantDatabase extends TenantSeed {
  seqCounter: number;
  eventLog: TenantEvent[];
}

export interface TenantContext {
  id: TenantId;
  db: TenantDatabase;
}
