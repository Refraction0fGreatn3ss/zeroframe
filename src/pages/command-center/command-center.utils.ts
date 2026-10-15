import type { SecurityIncident } from '../../types';
import { DEFAULT_MITRE_TECHNIQUE } from './command-center.data';
import type { AnomalyRisk, AnomalySignalType, KillChainSeverity } from './command-center.types';

export const filterIncidentsByKillChainStage = (
  incidents: SecurityIncident[],
  stage: string | null,
): SecurityIncident[] => {
  if (!stage) return incidents;
  const query = stage.toLowerCase();
  return incidents.filter((inc) =>
    inc.mitreTactics.some((t) => t.stage?.toLowerCase().includes(query) || t.name?.toLowerCase().includes(query)),
  );
};

export const countIncidentsWhere = (
  incidents: SecurityIncident[],
  predicate: (incident: SecurityIncident) => boolean,
): number => incidents.filter(predicate).length;

export const getPrimaryTechnique = (incident: SecurityIncident): string =>
  incident.mitreTactics[0]?.technique || incident.mitreTactics[0]?.name || DEFAULT_MITRE_TECHNIQUE;

export const getIncidentSeverityTextClass = (severity: SecurityIncident['severity']): string =>
  severity === 'CRITICAL' ? 'text-rose-400' : severity === 'HIGH' ? 'text-amber-400' : 'text-slate-400';

export const getIncidentSeverityDotClass = (severity: SecurityIncident['severity']): string =>
  severity === 'CRITICAL' ? 'bg-rose-500' : severity === 'HIGH' ? 'bg-amber-400' : 'bg-slate-500';

export const getKillChainCardClass = (severity: KillChainSeverity, isSelected: boolean): string => {
  if (isSelected) {
    return 'bg-[var(--zf-brand-accent-subtle)] border-[var(--zf-brand-accent)] shadow-xs ring-1 ring-[var(--zf-brand-accent)]';
  }
  if (severity === 'CRITICAL') return 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/60';
  if (severity === 'ELEVATED') return 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60';
  return 'bg-[var(--zf-surface-card)] border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)]';
};

export const getKillChainHitsClass = (severity: KillChainSeverity): string =>
  severity === 'CRITICAL'
    ? 'text-rose-400'
    : severity === 'ELEVATED'
      ? 'text-amber-400'
      : 'text-[var(--zf-text-muted)]';

export const getAnomalyRiskClass = (risk: AnomalyRisk): string =>
  risk === 'CRITICAL' ? 'text-rose-400' : risk === 'HIGH' ? 'text-amber-400' : 'text-cyan-400';

// Only the first underscore is replaced (e.g. 'SMB_NAMED_PIPE' -> 'SMB NAMED_PIPE'); preserved as-is.
export const formatAnomalyType = (type: AnomalySignalType): string => type.replace('_', ' ');

export const formatStageNumber = (index: number): string => `STAGE 0${index + 1}`;

export const formatLastKnown = (timestamp: string | null): string =>
  timestamp ? new Date(timestamp).toLocaleTimeString() : 'never';

export const getTelemetryStatusLabel = (realtimeConnected: boolean, lastHeartbeatTimestamp: string | null): string =>
  !realtimeConnected
    ? `Telemetry Link Disconnected · STALE (Last known ${formatLastKnown(lastHeartbeatTimestamp)})`
    : 'Live Wire Telemetry & Cross-Layer Triage';
