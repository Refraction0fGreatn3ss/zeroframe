import type { ContextItem } from '../../../stores/context-drawer-store';

export interface TruthProofContextData {
  why?: string;
  recommendation?: string;
  proof?: string[];
  link?: string;
}

export interface IpContextData {
  hostname?: string;
  blastRadius?: number | string;
}

export interface AssetContextData {
  criticality?: string;
  isProtected?: boolean;
  os?: string;
  ip?: string;
}

export interface DetectorContextData {
  requiredTelemetry?: string;
  mitre?: string;
}

export interface EvidenceContextData {
  hash?: string;
}

export interface SensorContextData {
  captureDriver?: string;
}

export interface MitreContextData {
  techniqueId?: string;
  tacticStage?: string;
  tactic?: string;
  heuristics?: string;
  linkedDetectors?: string[];
}

export interface AuthEvent {
  time: string;
  event: string;
  ip: string;
  status: string;
}

export interface AssociatedAsset {
  hostname: string;
  ip: string;
  mac: string;
  type: string;
}

export interface UserContextData {
  username?: string;
  clearance?: string;
  role?: string;
  authEvents?: AuthEvent[];
  associatedAssets?: AssociatedAsset[];
}

export interface ContextViewActions {
  onNavigate: (path: string) => void;
  onOpenContext: (item: ContextItem) => void;
}

export const DEFAULT_HOSTNAME = 'WKST-CORP-088';
export const DEFAULT_BLAST_RADIUS = 78;
export const DEFAULT_CRITICALITY = 'TIER_3';
export const DEFAULT_OS = 'Windows 11 Enterprise (23H2)';
export const DEFAULT_REQUIRED_TELEMETRY = 'DEEP_PACKET';
export const DEFAULT_EVIDENCE_HASH = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
export const DEFAULT_CAPTURE_DRIVER = 'AF_XDP (Zero-Copy)';
export const DEFAULT_TECHNIQUE_ID = 'T1071.001';
export const DEFAULT_TACTIC_STAGE = 'Command and Control (TA0011)';
export const DEFAULT_USER_IDENTITY = 's.chen@enterprise.corp';
export const DEFAULT_USER_CLEARANCE = 'Top Secret / SOC Lead Operator';

export const DEFAULT_MITRE_HEURISTICS =
  'Matches high-entropy packet payloads, periodic sleep-jitter interval anomalies, unauthenticated proxy tunnels, and known C2 beacon profiles across encrypted transports.';

export const MITRE_SIGNATURE_TAGS = ['AF_XDP Kernel TAP', 'TLS JARM Fingerprinting', 'Entropy > 7.82'];

export const DEFAULT_LINKED_DETECTORS = ['DET-C2-BEACON-01', 'DET-ECH-BYPASS-02', 'DET-DNS-TUNNEL-04'];

export const DEFAULT_AUTH_EVENTS: AuthEvent[] = [
  { time: '3m ago', event: 'OIDC PKCE Token Issued', ip: '10.140.2.88', status: 'SUCCESS' },
  { time: '42m ago', event: 'Hardware FIDO2 Touch Validated', ip: '10.140.2.88', status: 'SUCCESS' },
  { time: '3h ago', event: 'Dual-Control Response Authorization', ip: '10.140.2.88', status: 'SIGNED' },
];

export const DEFAULT_ASSOCIATED_ASSETS: AssociatedAsset[] = [
  { hostname: 'WKST-CORP-088', ip: '10.140.2.88', mac: '00:50:56:b3:44:19', type: 'WORKSTATION' },
];
