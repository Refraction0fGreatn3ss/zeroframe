import type { InspectionStage, SecurityState } from '../../types';
import type { EncapsulationIntegrity, InspectionStageDetail } from '../../types/inspection';

export interface BackendInspectionStage {
  stage: string;
  name?: string;
  status?: SecurityState;
  state?: SecurityState;
  packetRate?: number;
  byteRate?: number;
  dropRatePps?: number;
  uninspectedBytes?: number;
  primaryCause?: string;
  notes?: string;
}

export interface BackendInspectionPipeline {
  stages?: BackendInspectionStage[];
  asymmetryWarning?: string;
}

const STAGE_ALIASES: Record<string, InspectionStage> = {
  L2_ETHERNET: 'L2',
  L3_IP: 'L3',
};

const NOMINAL_PACKET_RATE_PPS = 342_000;
const DROPPING_PACKET_RATE_PPS = 340_000;
const NOMINAL_BYTE_RATE_BPS = 2_450_000_000;
const DROPPING_UNINSPECTED_BYTES = 12_000_000;
const DROP_PPS_PER_ERROR_RATE_UNIT = 1000;
const ASYMMETRIC_FLOW_RATIO_ON_WARNING = 0.18;
const DEGRADED_FALLBACK_CAUSE = 'Queue drop or asymmetric route detected';

function normalizeStageKey(stage: string): InspectionStage {
  return STAGE_ALIASES[stage] ?? (stage as InspectionStage);
}

export function normalizeStage(raw: BackendInspectionStage): InspectionStageDetail {
  const isDropping = Boolean(raw.dropRatePps);
  return {
    stage: normalizeStageKey(raw.stage),
    state: raw.status || raw.state || 'HEALTHY',
    packetRate: raw.packetRate ?? (isDropping ? DROPPING_PACKET_RATE_PPS : NOMINAL_PACKET_RATE_PPS),
    byteRate: raw.byteRate ?? NOMINAL_BYTE_RATE_BPS,
    errorRate: raw.dropRatePps ? raw.dropRatePps / DROP_PPS_PER_ERROR_RATE_UNIT : 0,
    uninspectedBytes: raw.uninspectedBytes ?? (isDropping ? DROPPING_UNINSPECTED_BYTES : 0),
    primaryCause: raw.primaryCause || (raw.status === 'DEGRADED' ? DEGRADED_FALLBACK_CAUSE : undefined),
    notes: raw.notes || raw.name || '',
  };
}

export function hasStages(pipeline: BackendInspectionPipeline): pipeline is { stages: BackendInspectionStage[] } {
  return Array.isArray(pipeline.stages) && pipeline.stages.length > 0;
}

export function applyAsymmetryWarning(encapsulation: EncapsulationIntegrity): EncapsulationIntegrity {
  return {
    ...encapsulation,
    asymmetricAlert: true,
    asymmetricFlowRatio: ASYMMETRIC_FLOW_RATIO_ON_WARNING,
  };
}
