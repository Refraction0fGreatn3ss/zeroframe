import type { ComplianceFrameworkSummary } from '../../types/compliance';

export interface BackendComplianceFramework {
  id: string;
  name: string;
  controlsEvaluated?: number;
  controlsPassing?: number;
  controlsDegraded?: number;
  complianceScore?: number;
  status?: string;
  lastAudit?: string;
}

export type NormalizedComplianceFramework = ComplianceFrameworkSummary &
  Pick<
    BackendComplianceFramework,
    'controlsEvaluated' | 'controlsPassing' | 'controlsDegraded' | 'complianceScore' | 'status' | 'lastAudit'
  >;

type Region = ComplianceFrameworkSummary['region'];

const DEFAULT_CONTROLS_EVALUATED = 50;
const FULL_READINESS_PERCENTAGE = 100;
const EUROPE_MARKERS = ['NIS', 'ISO'];
const MIDDLE_EAST_MARKERS = ['UAE', 'SAUDI', 'QATAR'];

function idContainsAny(id: string, markers: string[]): boolean {
  return markers.some((marker) => id.includes(marker));
}

export function classifyRegion(frameworkId: string): Region {
  if (idContainsAny(frameworkId, EUROPE_MARKERS)) {
    return 'Europe';
  }
  if (idContainsAny(frameworkId, MIDDLE_EAST_MARKERS)) {
    return 'Middle East';
  }
  return 'Global';
}

function percentageToOneDecimal(part: number, total: number): number {
  return Math.round((part / total) * 1000) / 10;
}

export function normalizeFramework(raw: BackendComplianceFramework): NormalizedComplianceFramework {
  const total = raw.controlsEvaluated ?? DEFAULT_CONTROLS_EVALUATED;
  const passing = raw.controlsPassing ?? total;
  const degraded = raw.controlsDegraded ?? 0;
  const score = raw.complianceScore ?? (total > 0 ? percentageToOneDecimal(passing, total) : FULL_READINESS_PERCENTAGE);

  return {
    id: raw.id,
    name: raw.name,
    region: classifyRegion(raw.id),
    totalControls: total,
    evidencedCount: passing,
    staleCount: degraded,
    missingCount: Math.max(0, total - passing - degraded),
    manualReviewCount: 0,
    readinessPercentage: score,
    controlsEvaluated: raw.controlsEvaluated,
    controlsPassing: raw.controlsPassing,
    controlsDegraded: raw.controlsDegraded,
    complianceScore: raw.complianceScore,
    status: raw.status,
    lastAudit: raw.lastAudit,
  };
}
