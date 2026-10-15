import type {
  Approver,
  ContainmentActionId,
  ContainmentActionOption,
  LifecycleStep,
  ResponseTarget,
} from './governed-response-studio.types';

export const LIFECYCLE_STEPS: readonly LifecycleStep[] = [
  'Proposal',
  'Authorization',
  'Execution',
  'Verification',
  'Rollback',
];

export const STEP_INDEX = {
  PROPOSAL: 0,
  AUTHORIZATION: 1,
  EXECUTION: 2,
  VERIFICATION: 3,
  ROLLBACK: 4,
} as const;

export const CONTAINMENT_ACTIONS: readonly ContainmentActionOption[] = [
  { id: 'ISOLATE_HOST_QUARANTINE', label: 'Host Isolation (Sensor iptables drop chain)' },
  { id: 'TCP_RST_ACTIVE_TEARDOWN', label: 'TCP RST Stream Teardown (Matching sequence packets)' },
  { id: 'BGP_FLOWSPEC_BLACKHOLE', label: 'BGP Flowspec Null-Route (/32 Blackhole)' },
];

export const DEFAULT_CONTAINMENT_ACTION: ContainmentActionId = 'ISOLATE_HOST_QUARANTINE';

export const FALLBACK_RESPONSE_TARGET: ResponseTarget = {
  id: 'INC-GENERIC-01',
  title: 'Security Incident',
  primaryVictim: { hostname: 'WKST-CORP-088', ip: '10.140.2.88', criticality: 'TIER_1', isProtected: false },
};

export const COMPENSATING_CONTROL = 'Automatic 30-minute reversion lease via ZeroFrame Autonomous Tap Filter';

export const BLAST_RADIUS_POLICY_LINES: readonly string[] = [
  'Target subnet: Isolated corporate workstation VLAN',
  'Service impact: Minimal (No core servers reside on this CIDR)',
  'Automatic reversal lease: 30 minutes (Reverts if not explicitly renewed)',
];

export const PRIMARY_APPROVER: Approver = {
  title: 'Approver 1: Marcus Vance',
  role: 'Lead SOC Analyst',
};

export const SECONDARY_APPROVER: Approver = {
  title: 'Approver 2: Sarah Chen',
  role: 'Duty SecOps Lead',
};

export const WIRE_APPLIED_DELAY_MS = 1000;
export const WIRE_VERIFIED_DELAY_MS = 2000;

export const LOCAL_PERMIT_ID_SUFFIX_LENGTH = 4;
