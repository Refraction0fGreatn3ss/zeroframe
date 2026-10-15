import type { BlindSpot, GovernorState, PressureMeter } from './inspection-integrity.types';

export const DEFAULT_EXPANDED_STAGE = 'CAPTURE';

export const GOVERNOR_STATES: readonly GovernorState[] = [
  'NORMAL',
  'PRESSURED',
  'DEGRADED',
  'SECURITY_IMPAIRED',
  'UNSAFE',
];

export const BLIND_SPOTS: BlindSpot[] = [
  {
    id: 'BSP-01',
    name: 'Unmonitored Branch Core Ingress TAP',
    affectedDomain: 'SITE-BRANCH-NORTH',
    sensor: 'Unassigned (No Appliance)',
    visibilityDomain: 'Branch WAN Edge (10G AT&T Circuit)',
    missingTelemetry: 'Raw Full-Packet Ingress (Only NetFlow v9 metadata imported)',
    detectorImpact: 'Layer 7 Deep-Inspection & JARM TLS fingerprinting completely unavailable',
    rootCause: 'Physical optical TAP not yet provisioned on carrier handoff interface Gi0/0/1',
    requiredRemediation:
      'Install 10G LC fiber TAP on carrier handoff and enroll secondary sensor node to SITE-BRANCH-NORTH',
    status: 'ACTIVE_EXPOSURE',
  },
  {
    id: 'BSP-02',
    name: 'Encrypted Client Hello (ECH) Inner SNI Masking',
    affectedDomain: 'SITE-HQ-EAST',
    sensor: 'SENSOR-HQ-CORE-01',
    visibilityDomain: 'Corporate Outbound HTTPS Egress',
    missingTelemetry: 'Inner Plaintext SNI & Encrypted HTTP/3 Handshake Payload',
    detectorImpact: 'Domain reputation canaries cannot observe encrypted inner domain name',
    rootCause: 'Cloudflare ECH / RFC 9460 adoption by endpoint browsers over TLS 1.3',
    requiredRemediation:
      'Enforce corporate DNS split-horizon policy dropping draft-ech HTTPS RR params, or deploy managed endpoint certs',
    status: 'TECHNICAL_BLIND_SPOT',
  },
  {
    id: 'BSP-03',
    name: 'SCADA Substation 04 Unidirectional Optical Diode Egress Blindness',
    affectedDomain: 'SITE-GRID-SUB04',
    sensor: 'tap-scada-ot-01',
    visibilityDomain: 'Substation Relay Bus (IEC 61850 / Modbus)',
    missingTelemetry: 'Return ACK Frames (Unidirectional TX-Only Physical Optical Diode)',
    detectorImpact: 'Asymmetric flow tracking; TCP reassembly requires synthetic ACK emulation',
    rootCause: 'NERC CIP physical air-gap mandate: hardware diode physically blocks reverse transmission',
    requiredRemediation:
      'Enable unidirectional flow heuristic profile; do not flag missing return ACKs as dropped connections',
    status: 'POLICY_CONSTRAINED',
  },
  {
    id: 'BSP-04',
    name: 'Stale Kerberos Ticket Canary Detector',
    affectedDomain: 'SITE-HQ-EAST',
    sensor: 'SENSOR-HQ-EDGE-02',
    visibilityDomain: 'Domain Controller Kerberos KDC (UDP/TCP:88)',
    missingTelemetry: 'Canary handshake heartbeat expired (> 45 minutes)',
    detectorImpact: 'DET-KERB-ROASTING-03 operating in degraded assurance mode',
    rootCause: 'Active Directory lab replication maintenance interrupted automated synthetic probe account',
    requiredRemediation:
      'Restart Kerberos synthetic transaction canary daemon on DC-GLOBAL-01 and verify Ed25519 signature',
    status: 'CANARY_DEGRADED',
  },
];

export const PRESSURE_METERS: PressureMeter[] = [
  { name: 'Host CPU Pressure', value: 28, max: 100, unit: '%', detail: '32 Cores · eBPF 8.4% load' },
  { name: 'Memory Pressure', value: 41, max: 100, unit: '%', detail: '65.6 / 160 GB locked hugepages' },
  { name: 'AF_XDP Ingress Queue', value: 14, max: 100, unit: '%', detail: '2,240 / 16,384 packet slots' },
  { name: 'NVMe Ring Buffer Write', value: 33, max: 100, unit: '%', detail: '1.38 GB/s / 4.20 GB/s cap' },
  { name: 'Open File Descriptors', value: 8, max: 100, unit: '%', detail: '8,192 / 102,400 FDs' },
  { name: 'Worker Thread Pool', value: 22, max: 100, unit: '%', detail: '14 / 64 threads utilized' },
  { name: 'Database Commit Backlog', value: 3, max: 100, unit: '%', detail: '120 events pending ledger seal' },
  { name: 'Telemetry Loss Rate', value: 0, max: 100, unit: '%', detail: '0 drops at line rate (100% SLA)' },
];
