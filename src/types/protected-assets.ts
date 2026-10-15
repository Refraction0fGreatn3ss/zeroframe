import type { Provenance } from './provenance';

export type ResponseActionKind =
  | 'ISOLATE_HOST'
  | 'BLOCK_FLOW'
  | 'DNS_SINKHOLE'
  | 'DISABLE_ACCOUNT'
  | 'QUARANTINE_VLAN'
  | string;

export interface ProtectedAsset {
  assetId: string;
  hostname: string | null;
  criticality: string;
  site: string | null;
  owner: string | null;
  isProtected: boolean;
  reason: string | null;
  policyId: string | null;
  allowedActions: ResponseActionKind[];
  deniedActions: ResponseActionKind[];
  dualControlRequired: boolean;
  witnessRequired: boolean;
  lastChangedAt: string | null;
  lastChangedBy: string | null;
  provenance: Provenance | null;
}

export interface ProtectedAssetQuery {
  search: string;
  protectedOnly: boolean;
}
