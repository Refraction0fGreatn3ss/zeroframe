import type { Provenance } from './provenance';

export type EntityContextType =
  | 'ASSET'
  | 'IP'
  | 'MAC'
  | 'USER'
  | 'FLOW'
  | 'DOMAIN'
  | 'INDICATOR'
  | 'CVE'
  | 'SENSOR'
  | 'SITE'
  | 'VLAN'
  | 'DETECTOR'
  | 'INCIDENT'
  | 'ALERT'
  | 'EVIDENCE'
  | 'RESPONSE_TRANSACTION';

export type ContextType = EntityContextType | 'MITRE' | 'TRUTH_PROOF';

export interface ContextAuthEvent {
  time: string;
  event: string;
  ip: string;
  status: string;
}

export interface ContextAssociatedAsset {
  hostname: string;
  ip: string;
  mac: string;
  type: string;
}

// Known fields are typed for the drawer views; the index signature lets pivots attach extra evidence fields.
export interface ContextItemData {
  [field: string]: unknown;
  provenance?: Provenance;
  why?: string;
  recommendation?: string;
  proof?: string[];
  link?: string;
  hostname?: string;
  blastRadius?: number | string;
  criticality?: string;
  isProtected?: boolean;
  os?: string;
  ip?: string;
  mac?: string;
  requiredTelemetry?: string;
  mitre?: string;
  hash?: string;
  captureDriver?: string;
  techniqueId?: string;
  tacticStage?: string;
  tactic?: string;
  heuristics?: string;
  linkedDetectors?: string[];
  username?: string;
  clearance?: string;
  role?: string;
  authEvents?: ContextAuthEvent[];
  associatedAssets?: ContextAssociatedAsset[];
}

export interface ContextItem {
  type: ContextType;
  id: string;
  title: string;
  subtitle?: string;
  data?: ContextItemData;
}
