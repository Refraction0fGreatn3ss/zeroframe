/**
 * ZeroFlash Enterprise 1.0 - Core Security & NDR Types
 * Strictly separates:
 * 1. WHAT EXISTS (Topology / Entities)
 * 2. WHAT CAN ZEROFLASH SEE (Observation / Fidelity / Inspection Integrity)
 * 3. WHAT CAN ZEROFLASH DETECT (Live Detection Assurance / Capability Matrix)
 */

export type SecurityState =
  | 'HEALTHY'
  | 'DEGRADED'
  | 'UNKNOWN'
  | 'UNAVAILABLE'
  | 'STALE'
  | 'DISCONNECTED'
  | 'FAILED'
  | 'PARTIAL'
  | 'NOT_VERIFIED'
  | 'AVAILABLE'
  | 'VERIFICATION_PENDING';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';

export type SourceFidelity =
  | 'FLOW'
  | 'WIRE_METADATA'
  | 'DEEP_PACKET'
  | 'ENDPOINT_CORROBORATED';

export type InspectionStage =
  | 'CAPTURE'
  | 'L2'
  | 'L3'
  | 'TRANSPORT'
  | 'SESSION'
  | 'CRYPTO'
  | 'APPLICATION';

export type OperatingMode =
  | 'ACTIVE_PROTECTION'
  | 'MONITOR_ONLY'
  | 'MAINTENANCE'
  | 'MAINTENANCE_MODE'
  | 'STOPPED';

export type ResponseAuthority = 'OBSERVE' | 'GOVERN' | 'AUTOMATE_NARROW';

export type ResponseActionState =
  | 'REQUESTED'
  | 'AUTHORIZED'
  | 'SENT'
  | 'ACCEPTED'
  | 'APPLYING'
  | 'APPLIED'
  | 'VERIFYING'
  | 'VERIFIED'
  | 'FAILED'
  | 'COMPENSATING'
  | 'ROLLED_BACK';

export type EvidenceState =
  | 'TENTATIVE'
  | 'VALIDATED'
  | 'FINAL'
  | 'INVALID'
  | 'STALE'
  | 'REDACTED'
  | 'RESTRICTED'
  | 'UNKNOWN';

export type RelationshipProvenance =
  | 'DISCOVERED'
  | 'DECLARED'
  | 'IMPORTED'
  | 'INFERRED';

export interface MitreTactic {
  id: string;
  name: string;
  technique: string;
  techniqueId: string;
  stage:
    | 'Initial Access'
    | 'Execution'
    | 'Persistence'
    | 'Privilege Escalation'
    | 'Defense Evasion'
    | 'Credential Access'
    | 'Discovery'
    | 'Lateral Movement'
    | 'Collection'
    | 'Command and Control'
    | 'Exfiltration'
    | 'Impact';
}

export interface SecurityIncident {
  id: string;
  title: string;
  plainEnglishSummary: string; // Used for Simple SOC mode
  severity: Severity;
  state: 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED' | 'SUPPRESSED';
  firstSeen: string;
  lastSeen: string;
  entityCount: number;
  primaryVictim: {
    ip: string;
    hostname: string;
    isProtected: boolean;
    criticality: 'TIER_1' | 'TIER_2' | 'TIER_3';
  };
  threatActor?: {
    ip?: string;
    asn?: string;
    country?: string;
    ja4Fingerprint?: string;
  };
  fidelity: SourceFidelity;
  confidenceScore: number; // 0 - 100
  mitreTactics: MitreTactic[];
  associatedAlertIds: string[];
  evidenceIds: string[];
  governedActionAvailable?: string;
  tenantId: string;
}

export interface SecurityAlert {
  id: string;
  incidentId?: string;
  name: string;
  detectorName: string;
  detectorVersion: string;
  severity: Severity;
  timestamp: string;
  sourceIp: string;
  sourcePort: number;
  destinationIp: string;
  destinationPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'DNS' | 'TLS' | 'HTTP' | 'SSH' | 'MODBUS' | 'BACNET';
  fidelity: SourceFidelity;
  confidence: number;
  evidenceRef: string;
  summary: string;
  tenantId: string;
}

export type EntityType =
  | 'SERVER'
  | 'WORKSTATION'
  | 'GATEWAY'
  | 'OT_PLC'
  | 'CLOUD_INSTANCE'
  | 'CONTAINER'
  | 'CAMERA'
  | 'PRINTER'
  | 'VOIP'
  | 'ACCESS_CONTROL'
  | 'DISPLAY';

export type DiscoveredProtocol =
  | 'ONVIF'
  | 'RTSP'
  | 'SSDP/UPnP'
  | 'mDNS'
  | 'LLDP/CDP'
  | 'Modbus/TCP'
  | 'BACnet/IP'
  | 'DHCP'
  | 'DNS'
  | 'TLS'
  | 'SSH'
  | 'SMB';

export interface BitemporalHistoryRecord {
  id: string;
  field: 'IP' | 'MAC' | 'HOSTNAME' | 'USER' | 'SITE_VLAN' | 'CRITICALITY' | 'PROTECTED_STATE';
  oldValue: string;
  newValue: string;
  validTime: string; // The time when the fact was true in reality
  transactionTime: string; // The time when the fact was recorded into the authoritative ledger
  provenance: RelationshipProvenance;
  recordedBy: string;
}

export interface LivingEntity {
  id: string;
  mac: string;
  currentIp: string;
  historicalIps: { ip: string; firstSeen: string; lastSeen: string; leaseOrigin: 'DHCP' | 'STATIC' | 'CLOUD_ENI' }[];
  hostname: string;
  entityType: EntityType;
  discoveredProtocols?: DiscoveredProtocol[];
  users?: string[];
  cloudIds?: string[];
  owner?: string;
  tags?: string[];
  identityConfidence?: number; // 0 - 100
  activeIncidents?: string[];
  bitemporalHistory?: BitemporalHistoryRecord[];
  os?: string;
  isProtected: boolean;
  blastRadiusScore: number; // 1 - 100
  observationSource: string;
  vlanDeclared?: number;
  vlanObserved?: number; // Conflicting VLANs must be surfaced explicitly
  firstSeen: string;
  lastSeen: string;
  provenance: RelationshipProvenance;
  tenantId: string;
}

export interface DetectionCapability {
  id: string;
  detectorKey: string;
  name: string;
  category: string;
  state: SecurityState;
  assuranceState: 'AVAILABLE' | 'DEGRADED' | 'UNAVAILABLE' | 'UNKNOWN' | 'STALE' | 'VERIFICATION_PENDING';
  lastCanaryTimestamp?: string;
  lastCanarySignedHash?: string;
  degradationReason?: string;
  requiredTelemetry: SourceFidelity;
  mitreCoverage: string[];
}
