import type { SecurityIncident } from '../../types';

export type ProcessNodeStatus = 'MALICIOUS' | 'SUSPICIOUS' | 'LEGITIMATE';

export type ProcessNodeType = 'PROCESS' | 'NETWORK' | 'FILE';

export interface ProcessNode {
  id: string;
  name: string;
  pid: number;
  user: string;
  cmdline: string;
  hash?: string;
  status: ProcessNodeStatus;
  type: ProcessNodeType;
  meta: string;
}

export interface AnalystNote {
  id: string;
  author: string;
  timestamp: string;
  content: string;
}

export type AnalystNotesByIncident = Record<string, AnalystNote[]>;

export type AssignedOperatorsByIncident = Record<string, string>;

export type DossierTab = 'TREE' | 'TIMELINE' | 'FORENSICS' | 'NOTES';

export type SeverityFilter = 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM';

export type IncidentState = SecurityIncident['state'];

export interface OperatorOption {
  name: string;
  muted?: boolean;
}

export interface IncidentStateOption {
  value: IncidentState;
  label: string;
}
