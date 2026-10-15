import type { LucideIcon } from 'lucide-react';
import { Activity, Shield, Terminal } from 'lucide-react';
import type { ViewMode } from '../../../stores/app-store';

export interface IndexedNetworkFlow {
  flowId: string;
  src: string;
  dst: string;
  proto: string;
  verdict: string;
  desc: string;
}

export interface IndexedSensorInterface {
  id: string;
  site: string;
  type: string;
  status: string;
  rate: string;
}

export interface IndexedWitnessTransaction {
  txId: string;
  blockNumber: number;
  status: string;
  hash: string;
  type: string;
}

export interface IndexedEvidencePcap {
  evidenceId: string;
  pcapId: string;
  sha256: string;
  desc: string;
  site: string;
}

export interface IndexedPermit {
  permitId: string;
  action: string;
  target: string;
  status: string;
  approver: string;
}

export interface IndexedVlanSubnet {
  vlan: string;
  subnet: string;
  name: string;
  site: string;
  qinq: string;
}

export interface IndexedUser {
  username: string;
  email: string;
  name: string;
  role: string;
  assignedIp: string;
}

export interface QuickAction {
  label: string;
  icon: LucideIcon;
  iconClassName: string;
  path: string;
  viewMode?: ViewMode;
}

export const INDEXED_NETWORK_FLOWS: IndexedNetworkFlow[] = [
  {
    flowId: 'FLW-098241',
    src: '10.140.2.88:52194',
    dst: '185.220.101.44:443',
    proto: 'TCP',
    verdict: 'MALICIOUS',
    desc: 'Cobalt Strike Malleable TLS C2 beacon',
  },
  {
    flowId: 'FLW-098242',
    src: '10.140.10.14:59301',
    dst: '1.1.1.1:53',
    proto: 'UDP',
    verdict: 'MALICIOUS',
    desc: 'High-Entropy DNS Exfiltration Tunnel',
  },
  {
    flowId: 'FLW-098243',
    src: '10.140.2.88:51240',
    dst: '10.140.10.5:445',
    proto: 'SMB',
    verdict: 'SUSPICIOUS',
    desc: 'SMB Named Pipe PsExec binding (\\pipe\\svcctl)',
  },
  {
    flowId: 'FLW-098245',
    src: '10.140.2.88:49811',
    dst: '142.250.190.46:443',
    proto: 'QUIC',
    verdict: 'ANOMALOUS',
    desc: 'QUIC / ECH Encrypted Channel Bypass',
  },
  {
    flowId: 'FLW-098246',
    src: '192.168.10.42:50201',
    dst: '192.168.10.100:502',
    proto: 'Modbus/TCP',
    verdict: 'MALICIOUS',
    desc: 'Modbus Write Single Coil 0x05 unauthorized PLC write',
  },
];

export const INDEXED_SENSOR_INTERFACES: IndexedSensorInterface[] = [
  { id: 'eth0:tap-core-01', site: 'SITE-HQ-EAST', type: '10G Fiber Switched TAP', status: 'ACTIVE', rate: '2.45 Gbps' },
  { id: 'eth1:tap-dmz-02', site: 'SITE-HQ-EAST', type: '1G DMZ Gateway Mirror', status: 'ACTIVE', rate: '420 Mbps' },
  {
    id: 'tap-scada-ot-01',
    site: 'SITE-GRID-SUB04',
    type: 'Unidirectional Optical Diode',
    status: 'PROTECTED',
    rate: '12 Mbps',
  },
  {
    id: 'sfp28-tap-prod-03',
    site: 'SITE-DC-WEST',
    type: '25G High-Speed Optical TAP',
    status: 'ACTIVE',
    rate: '8.9 Gbps',
  },
];

export const INDEXED_WITNESS_TRANSACTIONS: IndexedWitnessTransaction[] = [
  {
    txId: 'WITNESS-TX-8819',
    blockNumber: 8819,
    status: 'BYZANTINE_CONSENSUS_SEALED',
    hash: '0x7f48b901a92e1048b2914092b1a8',
    type: 'Evidence Sealing Notary',
  },
  {
    txId: 'WITNESS-TX-8820',
    blockNumber: 8820,
    status: 'BYZANTINE_CONSENSUS_SEALED',
    hash: '0x3c99a140f021e048bb74921ca801',
    type: 'Response Execution Permit Notary',
  },
  {
    txId: 'WITNESS-PROOF-ROOT-2026',
    blockNumber: 8821,
    status: 'ROOT_MERKLE_VALIDATED',
    hash: '0x8841da92fe0184b2c0194812f840',
    type: 'Consensus Merkle Proof',
  },
];

export const INDEXED_EVIDENCE_PCAPS: IndexedEvidencePcap[] = [
  {
    evidenceId: 'EVD-2026-9901',
    pcapId: 'PCAP-HQ-2026-0491',
    sha256: '7f9a2b84e019f91a92e1048b2914092b1a80',
    desc: 'Cobalt Strike C2 Beacon Packet Capture',
    site: 'SITE-HQ-EAST',
  },
  {
    evidenceId: 'EVD-2026-9902',
    pcapId: 'PCAP-DMZ-2026-0492',
    sha256: '3c81e048bb74921ca801a92e1048b2914092',
    desc: 'Encrypted Client Hello (ECH) TLS Handshake',
    site: 'SITE-HQ-EAST',
  },
  {
    evidenceId: 'EVD-2026-9903',
    pcapId: 'PCAP-SCADA-2026-0495',
    sha256: '99bf21a0da92fe0184b2c0194812f840a12e',
    desc: 'Modbus Unauthorized Coil Modification PCAP',
    site: 'SITE-GRID-SUB04',
  },
];

export const INDEXED_PERMITS: IndexedPermit[] = [
  {
    permitId: 'PMT-2026-0814',
    action: 'HOST_ISOLATE_MAC',
    target: '00:50:56:b3:44:19',
    status: 'ACTIVE_ENFORCED',
    approver: 'Dual-Control Quorum',
  },
  {
    permitId: 'PMT-2026-0815',
    action: 'BGP_RTBH_DROP',
    target: '185.220.101.44/32',
    status: 'AUTHORIZED',
    approver: 'Automated Playbook',
  },
  {
    permitId: 'PMT-2026-0816',
    action: 'TCP_RST_TEARDOWN',
    target: '10.140.2.88 <-> 185.220.101.44',
    status: 'APPLIED',
    approver: 'SecOps Lead',
  },
];

export const INDEXED_VLANS_SUBNETS: IndexedVlanSubnet[] = [
  {
    vlan: 'VLAN 104',
    subnet: '10.140.2.0/24',
    name: 'Corporate Workstation Enclave',
    site: 'SITE-HQ-EAST',
    qinq: 'Outer: 104 / Inner: 12',
  },
  {
    vlan: 'VLAN 208',
    subnet: '10.140.10.0/24',
    name: 'Critical Core Infrastructure & Domain Controllers',
    site: 'SITE-HQ-EAST',
    qinq: 'Outer: 208 / Inner: 5',
  },
  {
    vlan: 'VLAN 350',
    subnet: '192.168.10.0/24',
    name: 'OT / SCADA ICS Field Network',
    site: 'SITE-GRID-SUB04',
    qinq: 'Outer: 350 / Inner: 1',
  },
  {
    vlan: 'VLAN 99',
    subnet: '172.16.0.0/20',
    name: 'Isolated Quarantine Network',
    site: 'GLOBAL-VIRTUAL',
    qinq: 'Outer: 99 / Inner: 99',
  },
];

export const INDEXED_USERS: IndexedUser[] = [
  {
    username: 's.chen',
    email: 's.chen@enterprise.corp',
    name: 'Sarah Chen',
    role: 'Lead Tier 3 SOC Operator',
    assignedIp: '10.140.2.88',
  },
  {
    username: 'm.vance',
    email: 'm.vance@enterprise.corp',
    name: 'Marcus Vance',
    role: 'SecOps Incident Commander',
    assignedIp: '10.140.2.92',
  },
  {
    username: 'd.ross',
    email: 'd.ross@enterprise.corp',
    name: 'David Ross',
    role: 'OT/SCADA Systems Engineer',
    assignedIp: '192.168.10.42',
  },
  {
    username: 'svc-backup',
    email: 'svc-backup@enterprise.corp',
    name: 'Enterprise Backup Service Account',
    role: 'Automated Ingestion',
    assignedIp: '10.140.10.5',
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Switch to Simple SOC Executive Mode',
    icon: Terminal,
    iconClassName: 'text-zinc-400',
    path: '/overview',
    viewMode: 'SIMPLE_SOC',
  },
  { label: 'Open Governed Response Studio', icon: Shield, iconClassName: 'text-zinc-400', path: '/respond/studio' },
  {
    label: 'Security Activity Log (Real-Time Ingestion)',
    icon: Activity,
    iconClassName: 'text-cyan-400',
    path: '/overview/activity-log',
  },
  {
    label: 'SCADA / OT Grid Defense & Air-Gap Diode',
    icon: Terminal,
    iconClassName: 'text-amber-400',
    path: '/investigate/scada-ot',
  },
];
