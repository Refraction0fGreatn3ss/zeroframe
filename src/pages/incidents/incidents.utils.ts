import type { SecurityIncident } from '../../types';
import {
  DEFAULT_MITRE_TECHNIQUE,
  DEFAULT_PROCESS_TREE_KEY,
  PROCESS_EXECUTION_TREES,
  PROCESS_TREE_INDENT_STEP_PX,
  PROCESS_TREE_MAX_INDENT_PX,
} from './incidents.data';
import type { ProcessNode, ProcessNodeStatus, SeverityFilter } from './incidents.types';

export const getSeverityTextClass = (severity: SecurityIncident['severity']): string =>
  severity === 'CRITICAL' ? 'text-rose-400' : severity === 'HIGH' ? 'text-amber-400' : 'text-cyan-400';

export const getSeverityDotClass = (severity: SecurityIncident['severity']): string =>
  severity === 'CRITICAL' ? 'bg-rose-500' : severity === 'HIGH' ? 'bg-amber-400' : 'bg-cyan-400';

export const filterIncidents = (
  incidents: SecurityIncident[],
  searchFilter: string,
  severityFilter: SeverityFilter,
): SecurityIncident[] => {
  const query = searchFilter.toLowerCase();
  return incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(query) ||
      inc.id.toLowerCase().includes(query) ||
      inc.primaryVictim.hostname.toLowerCase().includes(query);
    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });
};

export const getPrimaryTechnique = (incident: SecurityIncident): string =>
  incident.mitreTactics[0]?.technique || incident.mitreTactics[0]?.name || DEFAULT_MITRE_TECHNIQUE;

export const getProcessTree = (incidentId: string): ProcessNode[] =>
  PROCESS_EXECUTION_TREES[incidentId] || PROCESS_EXECUTION_TREES[DEFAULT_PROCESS_TREE_KEY];

export const getProcessNodeIndent = (index: number): string =>
  `${Math.min(index * PROCESS_TREE_INDENT_STEP_PX, PROCESS_TREE_MAX_INDENT_PX)}px`;

export const getProcessNodeCardClass = (status: ProcessNodeStatus, isSelected: boolean): string => {
  if (isSelected) {
    return 'bg-[var(--zf-brand-accent-subtle)] border-[var(--zf-brand-accent)] shadow-md ring-1 ring-[var(--zf-brand-accent)]';
  }
  if (status === 'MALICIOUS') return 'bg-rose-500/10 border-rose-500/40 hover:border-rose-500/70';
  if (status === 'SUSPICIOUS') return 'bg-amber-500/10 border-amber-500/40 hover:border-amber-500/70';
  return 'bg-[var(--zf-surface-card)] border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)]';
};

export const getProcessNodeStatusTextClass = (status: ProcessNodeStatus, legitimateClass: string): string =>
  status === 'MALICIOUS' ? 'text-rose-400' : status === 'SUSPICIOUS' ? 'text-amber-400' : legitimateClass;
