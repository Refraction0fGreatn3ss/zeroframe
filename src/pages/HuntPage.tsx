/**
 * ZeroFrame NDR Threat Hunting & Wire Stream Inspector
 * 
 * Modeled after Premier Competitor Threat Hunters:
 * - Arkime (Moloch) SPIView & SPIGraph: Time-bucketed flow histogram & clickable facet charts
 * - Vectra AI Threat vs. Certainty Matrix: 2D scatter quadrant mapping entity risk
 * - Corelight / Zeek DNS Shannon Entropy Distribution: Highlighting DGA & DNS tunneling
 * - C2 Beaconing Cadence & Jitter Spectrum: Periodic heartbeat spike detection
 * - Deep Packet Dissector: Dual-pane Hexadecimal & ASCII dump with offset ruler
 */

import React, { useState } from 'react';
import { ExportButton } from '../components/shared/ExportButton';
import { useInvestigationStore } from '../stores/investigation-store';
import { useAppStore } from '../stores/app-store';
import {
  Search,
  Terminal,
  Filter,
  Download,
  ShieldAlert,
  ArrowRight,
  Layers,
  Radio,
  FileCode,
  Lock,
  Copy,
  Check,
  Zap,
  RefreshCw,
  ExternalLink,
  BarChart2,
  Activity,
  Sliders,
  Crosshair,
  Bookmark,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface WireFlow {
  flowId: string;
  timestamp: string;
  // 7-Dimensional Flow Ownership Key:
  siteId: string;
  sensorId: string;
  outerVid: number | string; // 802.1Q/QinQ Outer VID
  innerVid: number | string; // Inner VID
  pcpDei: string;            // Priority Code Point / Drop Eligible Indicator
  routingDomain: string;     // VRF / Routing Domain
  // 5-Tuple:
  srcIp: string;
  srcPort: number;
  dstIp: string;
  dstPort: number;
  proto: 'TCP' | 'UDP' | 'ICMP' | 'QUIC' | 'ECH' | 'DoH' | 'SMB' | 'Modbus/TCP' | 'BACnet/IP';
  tcpFlags?: string[];
  ja4: string;
  ja4s: string;
  sni: string;
  bytes: number;
  packets: number;
  durationMs: number;
  verdict: 'MALICIOUS' | 'SUSPICIOUS' | 'ANOMALOUS' | 'NOMINAL';
  mitreTactic?: string;
  interfaceId: string;
  hexPayload: string[];
  asciiPayload: string[];
}

const WIRE_FLOWS: WireFlow[] = [
  {
    flowId: 'FLW-098241',
    timestamp: '2026-10-13 19:48:22.408192',
    siteId: 'SITE-HQ-EAST',
    sensorId: 'SENS-01-TAP',
    outerVid: 100,
    innerVid: 402,
    pcpDei: 'PCP 5 / DEI 0 (Critical SecOps)',
    routingDomain: 'VRF-PROD-SEC',
    srcIp: '10.140.2.88',
    srcPort: 52194,
    dstIp: '185.220.101.44',
    dstPort: 443,
    proto: 'TCP',
    tcpFlags: ['PSH', 'ACK'],
    ja4: 't13d1516h2_8daaf6152771_0278457224b8',
    ja4s: 't130200_1301_a56c42971201',
    sni: 'api.telemetry-sync-service.net',
    bytes: 14280,
    packets: 28,
    durationMs: 420,
    verdict: 'MALICIOUS',
    mitreTactic: 'T1071.001 Web Protocols (C2)',
    interfaceId: 'eth0:tap-core-01',
    hexPayload: [
      '16 03 01 02 00 01 00 01 fc 03 03 8f 4b 21 9c 77',
      'e1 ac 04 29 11 08 40 fe 92 b4 10 5a 8b c9 01 3d',
      '44 91 20 8b f3 c2 19 04 a2 88 14 00 2f 00 35 00',
      '9c 00 9d 13 01 13 02 13 03 c0 2b c0 2f c0 0a c0',
      '14 00 00 23 00 00 00 1f 00 1d 00 00 1a 61 70 69',
      '2e 74 65 6c 65 6d 65 74 72 79 2d 73 79 6e 63 2d',
      '73 65 72 76 69 63 65 2e 6e 65 74 00 0b 00 04 03',
      '00 01 02 00 0a 00 08 00 06 00 1d 00 17 00 18 00',
    ],
    asciiPayload: [
      '..........K!.w',
      '..)...@...Z..=',
      'D. ........./.5.',
      '.........+/.....',
      '..#..........api',
      '.telemetry-sync-',
      'service.net.....',
      '................',
    ],
  },
  {
    flowId: 'FLW-098242',
    timestamp: '2026-10-13 19:48:20.109284',
    siteId: 'SITE-HQ-EAST',
    sensorId: 'SENS-02-DMZ',
    outerVid: 200,
    innerVid: 10,
    pcpDei: 'PCP 0 / DEI 0 (Best Effort)',
    routingDomain: 'VRF-DMZ',
    srcIp: '10.140.10.14',
    srcPort: 59301,
    dstIp: '1.1.1.1',
    dstPort: 53,
    proto: 'UDP',
    ja4: '-',
    ja4s: '-',
    sni: 'qname: c2-chunk-91a.exfil-c2.sec-gateway.org',
    bytes: 342,
    packets: 2,
    durationMs: 18,
    verdict: 'MALICIOUS',
    mitreTactic: 'T1048.003 DNS Exfiltration',
    interfaceId: 'eth1:tap-dmz-02',
    hexPayload: [
      'a4 12 01 00 00 01 00 00 00 00 00 00 0c 63 32 2d',
      '63 68 75 6e 6b 2d 39 31 61 08 65 78 66 69 6c 2d',
      '63 32 0b 73 65 63 2d 67 61 74 65 77 61 79 03 6f',
      '72 67 00 00 10 00 01 00 00 29 10 00 00 00 00 00',
    ],
    asciiPayload: [
      '.............c2-',
      'chunk-91a.exfil-',
      'c2.sec-gateway.o',
      'rg.......)......',
    ],
  },
  {
    flowId: 'FLW-098243',
    timestamp: '2026-10-13 19:48:15.992410',
    siteId: 'SITE-HQ-EAST',
    sensorId: 'SENS-01-TAP',
    outerVid: 100,
    innerVid: 402,
    pcpDei: 'PCP 3 / DEI 0 (Internal Core)',
    routingDomain: 'VRF-PROD-SEC',
    srcIp: '10.140.2.88',
    srcPort: 51240,
    dstIp: '10.140.10.5',
    dstPort: 445,
    proto: 'SMB',
    tcpFlags: ['ACK', 'PSH'],
    ja4: '-',
    ja4s: '-',
    sni: 'smb2: \\PIPE\\svcctl (PsExec RPC Bind)',
    bytes: 84200,
    packets: 94,
    durationMs: 1420,
    verdict: 'SUSPICIOUS',
    mitreTactic: 'T1021.002 SMB/Windows Admin Shares',
    interfaceId: 'eth0:tap-core-01',
    hexPayload: [
      'fe 53 4d 42 40 00 00 00 00 00 00 00 05 00 01 00',
      '01 00 00 00 00 00 00 00 02 00 00 00 00 00 00 00',
      'ff fe 00 00 01 00 00 00 70 00 00 00 00 00 00 00',
      '5c 00 50 00 49 00 50 00 45 00 5c 00 73 00 76 00',
      '63 00 63 00 74 00 6c 00 00 00 05 00 0b 03 10 00',
    ],
    asciiPayload: [
      '.SMB@...........',
      '................',
      '........p.......',
      '\\.P.I.P.E.\\.s.v.',
      'c.c.t.l.........',
    ],
  },
  {
    flowId: 'FLW-098244',
    timestamp: '2026-10-13 19:47:59.102830',
    siteId: 'SITE-HQ-EAST',
    sensorId: 'SENS-01-TAP',
    outerVid: 100,
    innerVid: 402,
    pcpDei: 'PCP 3 / DEI 0 (Core Auth)',
    routingDomain: 'VRF-PROD-SEC',
    srcIp: '10.140.10.5',
    srcPort: 88,
    dstIp: '10.140.2.88',
    dstPort: 49210,
    proto: 'TCP',
    tcpFlags: ['ACK'],
    ja4: '-',
    ja4s: '-',
    sni: 'krb5: TGS-REQ (SPN: MSSQLSvc/db01.corp)',
    bytes: 3120,
    packets: 6,
    durationMs: 82,
    verdict: 'SUSPICIOUS',
    mitreTactic: 'T1558.003 Kerberoasting',
    interfaceId: 'eth0:tap-core-01',
    hexPayload: [
      '6e 82 04 2a 30 82 04 26 a0 03 02 01 05 a1 03 02',
      '01 0e a2 07 03 05 00 40 80 00 10 a3 82 01 12 30',
      '82 01 0e a0 1b 1b 19 4d 53 53 51 4c 53 76 63 2f',
      '64 62 30 31 2e 63 6f 72 70 3a 31 34 33 33 a1 0e',
    ],
    asciiPayload: [
      'n..*0..&........',
      '.......@.......0',
      '.......MSSQLSvc/',
      'db01.corp:1433..',
    ],
  },
  {
    flowId: 'FLW-098245',
    timestamp: '2026-10-13 19:47:45.390192',
    siteId: 'SITE-DC-WEST',
    sensorId: 'SENS-03-DB',
    outerVid: 300,
    innerVid: 80,
    pcpDei: 'PCP 4 / DEI 0 (Data Tier)',
    routingDomain: 'VRF-DB-TIER',
    srcIp: '10.140.4.12',
    srcPort: 443,
    dstIp: '10.140.10.100',
    dstPort: 5432,
    proto: 'TCP',
    tcpFlags: ['ACK', 'PSH'],
    ja4: 't13d0100h2_491823718912_108291471012',
    ja4s: 't130100_1301_881928491823',
    sni: 'db-cluster-primary.internal',
    bytes: 284910,
    packets: 198,
    durationMs: 2400,
    verdict: 'NOMINAL',
    interfaceId: 'eth2:tap-db-03',
    hexPayload: [
      '50 00 00 00 14 53 45 4c 45 43 54 20 2a 20 46 52',
      '4f 4d 20 61 75 64 69 74 5f 6c 6f 67 73 20 57 48',
      '45 52 45 20 74 65 6e 61 6e 74 5f 69 64 20 3d 20',
      '27 74 65 6e 61 6e 74 2d 68 71 27 00 42 00 00 00',
    ],
    asciiPayload: [
      'P....SELECT * FR',
      'OM audit_logs WH',
      'ERE tenant_id = ',
      "'tenant-hq'.B...",
    ],
  },
  {
    flowId: 'FLW-098246',
    timestamp: '2026-10-13 19:47:30.812904',
    siteId: 'SITE-HQ-EAST',
    sensorId: 'SENS-01-TAP',
    outerVid: 100,
    innerVid: 402,
    pcpDei: 'PCP 5 / DEI 0',
    routingDomain: 'VRF-PROD-SEC',
    srcIp: '10.140.2.88',
    srcPort: 49811,
    dstIp: '142.250.190.46',
    dstPort: 443,
    proto: 'QUIC',
    ja4: 'q13d0100h2_88129a01f402_194012984102',
    ja4s: 'q130100_1301_a91284019284',
    sni: 'quic.c2-stealth-relay.io (CID: 0x8f2a1b9c)',
    bytes: 42100,
    packets: 52,
    durationMs: 890,
    verdict: 'ANOMALOUS',
    mitreTactic: 'T1071.001 QUIC Transport Encrypted Tunnel',
    interfaceId: 'eth0:tap-core-01',
    hexPayload: [
      'c0 00 00 00 01 08 8f 2a 1b 9c 04 11 22 33 00 40',
      '49 12 8a 01 00 00 00 00 1a 01 00 00 16 03 03 01',
      '20 88 12 f9 02 11 04 92 1a 88 c0 2b 00 00 17 00',
      '00 14 00 12 00 00 0f 71 75 69 63 2d 72 65 6c 61',
    ],
    asciiPayload: [
      '.......*...\"3.@',
      'I...............',
      ' ........+......',
      '.......quic-rela',
    ],
  },
  {
    flowId: 'FLW-098247',
    timestamp: '2026-10-13 19:47:12.194812',
    siteId: 'SITE-HQ-EAST',
    sensorId: 'SENS-01-TAP',
    outerVid: 100,
    innerVid: 402,
    pcpDei: 'PCP 5 / DEI 0',
    routingDomain: 'VRF-PROD-SEC',
    srcIp: '10.140.2.88',
    srcPort: 53120,
    dstIp: '104.16.132.229',
    dstPort: 443,
    proto: 'ECH',
    ja4: 't13d1516h2_ech_outer_sni_cloudflare',
    ja4s: 't130200_1301_ech_inner_encrypted',
    sni: 'Outer: public.cloudflare-ech.com [Inner ECH: stealth-exfil.ninja]',
    bytes: 18920,
    packets: 34,
    durationMs: 640,
    verdict: 'MALICIOUS',
    mitreTactic: 'T1573.002 Encrypted Client Hello (ECH) Bypass',
    interfaceId: 'eth0:tap-core-01',
    hexPayload: [
      '16 03 01 01 80 01 00 01 7c 03 03 48 91 22 a0 19',
      '00 fe 0d 00 44 00 42 00 20 00 01 00 01 00 20 73',
      '74 65 61 6c 74 68 2d 65 78 66 69 6c 2e 6e 69 6e',
      '6a 61 00 00 00 1f 00 1d 00 00 16 70 75 62 6c 69',
    ],
    asciiPayload: [
      '........|..H.\"..',
      '....D.B. ..... s',
      'tealth-exfil.nin',
      'ja.........publi',
    ],
  },
  {
    flowId: 'FLW-098248',
    timestamp: '2026-10-13 19:46:58.601928',
    siteId: 'SITE-HQ-EAST',
    sensorId: 'SENS-02-DMZ',
    outerVid: 200,
    innerVid: 10,
    pcpDei: 'PCP 0 / DEI 0',
    routingDomain: 'VRF-DMZ',
    srcIp: '10.140.10.14',
    srcPort: 54109,
    dstIp: '8.8.8.8',
    dstPort: 443,
    proto: 'DoH',
    ja4: 't13d1516h2_google_dns_doh',
    ja4s: 't130200_1301_doh_response',
    sni: 'dns.google:443 /dns-query?name=dga-exfil-9.org',
    bytes: 4890,
    packets: 12,
    durationMs: 140,
    verdict: 'SUSPICIOUS',
    mitreTactic: 'T1071.004 DNS over HTTPS Encrypted Tunnel',
    interfaceId: 'eth1:tap-dmz-02',
    hexPayload: [
      '47 45 54 20 2f 64 6e 73 2d 71 75 65 72 79 3f 6e',
      '61 6d 65 3d 64 67 61 2d 65 78 66 69 6c 2d 39 2e',
      '6f 72 67 26 74 79 70 65 3d 54 58 54 20 48 54 54',
      '50 2f 32 2e 30 0d 0a 48 6f 73 74 3a 20 64 6e 73',
    ],
    asciiPayload: [
      'GET /dns-query?n',
      'ame=dga-exfil-9.',
      'org&type=TXT HTT',
      'P/2.0..Host: dns',
    ],
  },
  {
    flowId: 'FLW-098249',
    timestamp: '2026-10-13 19:46:32.408102',
    siteId: 'SITE-GRID-SUB04',
    sensorId: 'SENS-03-SCADA',
    outerVid: 500,
    innerVid: 102,
    pcpDei: 'PCP 6 / DEI 0 (OT Hardened Realtime)',
    routingDomain: 'VRF-SCADA-ZONE3',
    srcIp: '192.168.10.42',
    srcPort: 50201,
    dstIp: '192.168.10.100',
    dstPort: 502,
    proto: 'Modbus/TCP',
    ja4: '-',
    ja4s: '-',
    sni: 'Modbus Func: 0x05 (Write Single Coil) · Coil Addr: 0x002B · Value: ON',
    bytes: 1240,
    packets: 8,
    durationMs: 44,
    verdict: 'MALICIOUS',
    mitreTactic: 'T0855 Unauthorized Command Message (OT/ICS)',
    interfaceId: 'tap-ot-scada-01',
    hexPayload: [
      '00 01 00 00 00 06 01 05 00 2b ff 00 00 00 00 00',
      '00 02 00 00 00 06 01 05 00 2b ff 00 53 43 41 44',
      '41 5f 50 4c 43 5f 54 52 49 50 5f 43 4f 49 4c 00',
    ],
    asciiPayload: [
      '.........+......',
      '.........+..SCAD',
      'A_PLC_TRIP_COIL.',
    ],
  },
  {
    flowId: 'FLW-098250',
    timestamp: '2026-10-13 19:46:10.912801',
    siteId: 'SITE-GRID-SUB04',
    sensorId: 'SENS-03-SCADA',
    outerVid: 500,
    innerVid: 102,
    pcpDei: 'PCP 6 / DEI 0',
    routingDomain: 'VRF-SCADA-ZONE3',
    srcIp: '192.168.10.105',
    srcPort: 47808,
    dstIp: '192.168.10.255',
    dstPort: 47808,
    proto: 'BACnet/IP',
    ja4: '-',
    ja4s: '-',
    sni: 'BACnet/IP BVLC: Original-Broadcast · APDU: Unconfirmed-REQ (Who-Is)',
    bytes: 840,
    packets: 4,
    durationMs: 22,
    verdict: 'ANOMALOUS',
    mitreTactic: 'T0846 Remote System Discovery (BACnet)',
    interfaceId: 'tap-ot-scada-01',
    hexPayload: [
      '81 0b 00 18 01 20 ff ff 00 ff 10 08 09 01 19 02',
      '1a 00 00 2a 01 ff 00 00 42 41 43 6e 65 74 5f 49',
    ],
    asciiPayload: [
      '..... ..........',
      '...*....BACnet_I',
    ],
  },
];

// Time-series histogram data (Arkime / Corelight style)
const TIME_HISTOGRAM_DATA = [
  { time: '19:00', packets: 12400, bytesMb: 14.2, anomalies: 0 },
  { time: '19:10', packets: 14800, bytesMb: 16.8, anomalies: 0 },
  { time: '19:20', packets: 18200, bytesMb: 22.4, anomalies: 1 },
  { time: '19:30', packets: 34100, bytesMb: 68.2, anomalies: 4 }, // Spike
  { time: '19:40', packets: 42800, bytesMb: 89.4, anomalies: 8 }, // Major C2 burst
  { time: '19:50', packets: 21900, bytesMb: 31.6, anomalies: 2 },
];

// Vectra AI Threat vs Certainty Quadrant Entities
const VECTRA_QUADRANT_ENTITIES = [
  { id: '10.140.2.88', name: 'srv-app-prod-01', threat: 92, certainty: 88, quadrant: 'CRITICAL', alerts: 5 },
  { id: '185.220.101.44', name: 'External C2 (NL)', threat: 96, certainty: 94, quadrant: 'CRITICAL', alerts: 7 },
  { id: '10.140.10.14', name: 'workstation-fin-04', threat: 78, certainty: 82, quadrant: 'HIGH', alerts: 3 },
  { id: '10.140.10.5', name: 'DC-01 (Domain Controller)', threat: 84, certainty: 65, quadrant: 'HIGH', alerts: 2 },
  { id: '10.140.4.12', name: 'DB-CLUSTER-01', threat: 25, certainty: 30, quadrant: 'LOW', alerts: 0 },
  { id: '10.140.0.1', name: 'Edge-Gateway-01', threat: 42, certainty: 55, quadrant: 'MEDIUM', alerts: 1 },
];

// Shannon DNS Entropy Distribution (Corelight / Zeek style)
const DNS_ENTROPY_BUCKETS = [
  { range: '1.0 - 2.0', count: 1420, label: 'Legitimate / Short', threat: 'LOW' },
  { range: '2.0 - 3.0', count: 3820, label: 'Standard Web Domains', threat: 'LOW' },
  { range: '3.0 - 3.8', count: 940, label: 'CDN / Cloud Hashes', threat: 'NOMINAL' },
  { range: '3.8 - 4.2', count: 210, label: 'Suspicious Subdomains', threat: 'SUSPICIOUS' },
  { range: '4.2 - 5.0+', count: 88, label: 'DNS Tunneling / Exfil', threat: 'CRITICAL' }, // DGA / Tunneling
];

// Top Destination Ports (Arkime SPI Facet)
const TOP_PORTS = [
  { port: 443, service: 'HTTPS/TLS', flows: 2840, pct: 58 },
  { port: 445, service: 'SMB/RPC', flows: 820, pct: 17 },
  { port: 53, service: 'DNS UDP', flows: 540, pct: 11 },
  { port: 88, service: 'Kerberos', flows: 390, pct: 8 },
  { port: 80, service: 'HTTP/2', flows: 290, pct: 6 },
];

interface SavedHunt {
  id: string;
  label: string;
  query: string;
  protocol?: string;
}

const INITIAL_SAVED_HUNTS: SavedHunt[] = [
  { id: 'sh-1', label: 'C2 Web Beaconing (JA4)', query: 'proto=TCP AND dst_port=443 AND ja4="t13d*"' },
  { id: 'sh-2', label: 'DNS Tunneling & TXT Exfil', query: 'proto=UDP AND dst_port=53 AND dns.entropy > 4.2' },
  { id: 'sh-3', label: 'Lateral Movement (PsExec)', query: 'proto=SMB AND dst_port=445 AND sni="*svcctl*"' },
  { id: 'sh-4', label: 'QUIC / ECH Encrypted Channel', query: 'proto=QUIC OR proto=ECH' },
  { id: 'sh-5', label: 'SCADA Modbus Write Anomaly', query: 'proto="Modbus/TCP" AND dst_port=502' },
  { id: 'sh-6', label: 'BACnet Discovery Flood', query: 'proto="BACnet/IP" AND dst_port=47808' },
  { id: 'sh-7', label: 'Kerberoasting TGS-REQ', query: 'proto=TCP AND dst_port=88 AND bytes>2000' },
];

export const HuntPage: React.FC = () => {
  const [query, setQuery] = useState('proto=TCP AND dst_port=443 AND ja4="t13d*"');
  const [selectedFlow, setSelectedFlow] = useState<WireFlow>(WIRE_FLOWS[0]);
  const [copiedJa4, setCopiedJa4] = useState(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'HEX' | 'DISSECTION' | 'ATTRIBUTES' | '7D_KEY'>('HEX');
  const [viewMode, setViewMode] = useState<'COMBINED' | 'GRAPHS_ONLY' | 'FLOWS_ONLY'>('COMBINED');
  const [selectedQuadrantEntity, setSelectedQuadrantEntity] = useState<string | null>(null);
  const [savedHunts, setSavedHunts] = useState<SavedHunt[]>(INITIAL_SAVED_HUNTS);
  const [isSavingHunt, setIsSavingHunt] = useState(false);
  const [newHuntLabel, setNewHuntLabel] = useState('');
  const [resultState, setResultState] = useState<'COMPLETE' | 'PARTIAL / TRUNCATED'>('COMPLETE');
  const [selectedProtocol, setSelectedProtocol] = useState<string>('ALL');

  const { selectIncident } = useInvestigationStore();
  const { setCurrentPath } = useAppStore();

  const handleCopyJa4 = () => {
    if (!selectedFlow?.ja4 || selectedFlow.ja4 === '-') return;
    navigator.clipboard.writeText(selectedFlow.ja4);
    setCopiedJa4(true);
    setTimeout(() => setCopiedJa4(false), 2000);
  };

  const handleApplyPortFilter = (port: number) => {
    setQuery(`dst_port=${port}`);
  };

  const handleApplyEntropyFilter = () => {
    setQuery(`proto=UDP AND dst_port=53 AND dns.entropy > 4.2`);
  };

  const handleSaveCurrentQuery = () => {
    if (!newHuntLabel.trim() || !query.trim()) return;
    const newEntry: SavedHunt = {
      id: `sh-custom-${Date.now()}`,
      label: newHuntLabel.trim(),
      query: query.trim(),
    };
    setSavedHunts([...savedHunts, newEntry]);
    setNewHuntLabel('');
    setIsSavingHunt(false);
  };

  const handleDeleteSavedHunt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedHunts(savedHunts.filter((h) => h.id !== id));
  };

  const filteredFlows = WIRE_FLOWS.filter((flow) => {
    if (selectedProtocol !== 'ALL' && flow.proto !== selectedProtocol) {
      return false;
    }
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      flow.flowId.toLowerCase().includes(q) ||
      flow.srcIp.includes(q) ||
      flow.dstIp.includes(q) ||
      flow.proto.toLowerCase().includes(q) ||
      flow.siteId.toLowerCase().includes(q) ||
      flow.sensorId.toLowerCase().includes(q) ||
      flow.routingDomain.toLowerCase().includes(q) ||
      flow.sni.toLowerCase().includes(q) ||
      flow.ja4.toLowerCase().includes(q) ||
      (flow.mitreTactic && flow.mitreTactic.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-4 sm:p-5 space-y-4 text-slate-100 max-w-[1720px] mx-auto font-sans select-none">
      {/* Top Header Strip with Hunter View Mode Toggles */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight text-slate-100">
              NDR Threat Hunting & Wire Analysis Cockpit
            </h1>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-cyan-400 font-medium">
              Arkime SPI + Vectra Matrix + Corelight Entropy
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Full-spectrum packet hunting: Time-bucketed session histograms, threat-certainty quadrants, and deep hex dissector.
          </p>
        </div>

        {/* View Mode Selector (Segmented buttons) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#080c14] border border-slate-800 rounded p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode('COMBINED')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'COMBINED'
                  ? 'bg-slate-800 text-cyan-300 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Cockpit Split</span>
            </button>
            <button
              onClick={() => setViewMode('GRAPHS_ONLY')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'GRAPHS_ONLY'
                  ? 'bg-slate-800 text-cyan-300 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Competitor Graphs</span>
            </button>
            <button
              onClick={() => setViewMode('FLOWS_ONLY')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'FLOWS_ONLY'
                  ? 'bg-slate-800 text-cyan-300 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Raw Flows & Hex</span>
            </button>
          </div>

          <ExportButton
            resourceName="Threat_Hunting_Flows"
            recordCount={WIRE_FLOWS.length}
            data={WIRE_FLOWS}
          />
        </div>
      </div>

      {/* Berkeley Packet Filter (BPF) Query Bar & Quick Presets */}
      <div className="p-3 bg-[#090d16] border border-slate-800 rounded space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Berkeley Packet Filter (BPF) & L7 Wire Search Query</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Click any chart bar or quadrant entity below to auto-inject filter
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#060911] border border-slate-800 rounded font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500/60 placeholder:text-slate-600"
              placeholder='e.g. proto=TCP AND dst_port=443 AND ja4="t13d*"'
            />
          </div>
          <button
            type="button"
            className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs cursor-pointer transition-colors shadow-xs"
          >
            Execute Hunt
          </button>
          <button
            type="button"
            onClick={() => setIsSavingHunt(!isSavingHunt)}
            className="px-3 py-1.5 rounded bg-[#101726] hover:bg-[#18233c] border border-cyan-800/40 text-cyan-300 font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Save current query to Saved Hunts repository"
          >
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save Query</span>
          </button>
        </div>

        {/* Save Query Modal / Inline Input */}
        {isSavingHunt && (
          <div className="p-2.5 rounded bg-[#070b14] border border-cyan-800/50 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Save Hunt As:</span>
            <input
              type="text"
              value={newHuntLabel}
              onChange={(e) => setNewHuntLabel(e.target.value)}
              placeholder="e.g. Cobalt Strike Malleable C2 Beacon"
              className="bg-[#04060c] border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs flex-1 min-w-[200px] outline-hidden focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={handleSaveCurrentQuery}
              disabled={!newHuntLabel.trim()}
              className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-40"
            >
              Save to Repository
            </button>
            <button
              type="button"
              onClick={() => setIsSavingHunt(false)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Saved Hunts Repository Strip */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <Bookmark className="w-3 h-3 text-cyan-400" />
              <span>Saved Hunts ({savedHunts.length})</span>
            </span>
            <span className="text-slate-500 text-[10px]">Click any saved hunt to populate query</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {savedHunts.map((hunt) => (
              <div
                key={hunt.id}
                onClick={() => setQuery(hunt.query)}
                className={`px-2 py-1 text-[11px] font-mono rounded border flex items-center gap-1.5 transition-colors cursor-pointer group ${
                  query === hunt.query
                    ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 font-semibold shadow-xs'
                    : 'bg-[#0b101c] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
                title={hunt.query}
              >
                <span>{hunt.label}</span>
                {hunt.id.startsWith('sh-custom') && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteSavedHunt(hunt.id, e)}
                    className="text-slate-500 hover:text-rose-400 p-0.5 ml-0.5"
                    title="Delete saved hunt"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Protocol Filter Pills (QUIC, ECH, DoH, SMB, Modbus, BACnet, etc.) */}
        <div className="space-y-1 pt-1.5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Protocol Filter:</span>
            <span className="text-slate-500 text-[10px]">Filter by L4/L7 wire protocol</span>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {(['ALL', 'TCP', 'UDP', 'QUIC', 'ECH', 'DoH', 'SMB', 'Modbus/TCP', 'BACnet/IP'] as const).map((proto) => (
              <button
                key={proto}
                type="button"
                onClick={() => setSelectedProtocol(proto)}
                className={`px-2.5 py-0.5 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                  selectedProtocol === proto
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'bg-[#090e18] border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {proto}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Backend-Derived Result State Banner */}
      <div
        className={`p-2.5 rounded border text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs ${
          resultState === 'COMPLETE'
            ? 'bg-[#061410] border-emerald-800/60 text-emerald-300'
            : 'bg-[#180e0c] border-amber-800/60 text-amber-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {resultState === 'COMPLETE' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight">
                {resultState === 'COMPLETE' ? 'Result State: COMPLETE' : 'Result State: PARTIAL / TRUNCATED'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 border border-current font-semibold">
                {resultState === 'COMPLETE' ? 'AUTHORITATIVE 100%' : 'BUFFER CEILING'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {resultState === 'COMPLETE'
                ? `All ${filteredFlows.length} wire flows in query window fully indexed · 0 packets dropped · Deterministic capture`
                : `Result limit ceiling reached (showing ${filteredFlows.length} flows of 14,208 total matching packets in interval) · High-load ring buffer truncation active on tap-core-01`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setResultState(resultState === 'COMPLETE' ? 'PARTIAL / TRUNCATED' : 'COMPLETE')}
          className="px-2.5 py-1 rounded text-[10px] font-mono bg-black/50 hover:bg-black/70 border border-slate-700 text-slate-300 shrink-0 cursor-pointer self-start sm:self-center"
          title="Toggle between Complete and Truncated result states"
        >
          Toggle Result State ({resultState === 'COMPLETE' ? 'Simulate Truncated' : 'Simulate Complete'})
        </button>
      </div>

      {/* SECTION: COMPETITOR HUNTER VISUALIZATIONS & GRAPHS */}
      {(viewMode === 'COMBINED' || viewMode === 'GRAPHS_ONLY') && (
        <div className="space-y-3">
          {/* Row 1: Arkime-style SPIGraph Time-Series Flow Histogram (Full Width) */}
          <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-slate-200 font-sans">
                  Arkime SPI Session Flow & Throughput Time Histogram
                </span>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-slate-400 text-[11px]">
                  Time Buckets: 10m intervals (Past 60 mins)
                </span>
              </div>
              <span className="text-[11px] font-mono text-rose-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Burst Detected at 19:40 UTC</span>
              </span>
            </div>

            {/* SVG Interactive Time Histogram */}
            <div className="h-32 w-full bg-[#060911] border border-slate-800/80 rounded p-2 flex items-end justify-between gap-3 relative">
              {TIME_HISTOGRAM_DATA.map((bucket) => {
                const heightPct = Math.round((bucket.packets / 45000) * 100);
                const isSpike = bucket.anomalies >= 4;
                return (
                  <div
                    key={bucket.time}
                    onClick={() => setQuery(`timestamp="${bucket.time}"`)}
                    className="flex-1 flex flex-col items-center gap-1 h-full justify-end cursor-pointer group"
                    title={`Time: ${bucket.time} · Packets: ${bucket.packets} · Traffic: ${bucket.bytesMb} MB · Anomalies: ${bucket.anomalies}`}
                  >
                    <div className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {bucket.packets.toLocaleString()}
                    </div>
                    <div className="w-full flex items-end justify-center h-20">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full max-w-[48px] rounded-t transition-all ${
                          isSpike
                            ? 'bg-rose-500 group-hover:bg-rose-400 shadow-sm shadow-rose-900/50'
                            : bucket.anomalies > 0
                            ? 'bg-amber-500 group-hover:bg-amber-400'
                            : 'bg-cyan-600/70 group-hover:bg-cyan-500'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-300">
                      {bucket.time}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Click any time bucket to filter wire sessions to that window</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-xs bg-cyan-600" />
                  <span>Nominal Traffic</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-xs bg-amber-500" />
                  <span>Elevated Packets</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-xs bg-rose-500" />
                  <span>C2 Burst / Attack Spike</span>
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Three Distinct Competitor Hunter Graphs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Graph 1: Vectra AI Threat vs. Certainty Quadrant Matrix */}
            <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-semibold text-slate-200">
                    Vectra AI Threat vs. Certainty Matrix
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Host Risk 2D</span>
              </div>

              {/* 2D Quadrant Canvas */}
              <div className="h-44 w-full bg-[#060911] border border-slate-800/80 rounded relative p-2 overflow-hidden">
                {/* Quadrant Lines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-[1px] bg-slate-800/80" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-full w-[1px] bg-slate-800/80" />
                </div>

                {/* Quadrant Corner Labels */}
                <span className="absolute top-1 right-2 text-[9px] font-mono text-rose-500 font-bold uppercase">
                  Critical Urgent
                </span>
                <span className="absolute top-1 left-2 text-[9px] font-mono text-amber-500 uppercase">
                  High Threat
                </span>
                <span className="absolute bottom-1 right-2 text-[9px] font-mono text-cyan-500 uppercase">
                  High Certainty
                </span>
                <span className="absolute bottom-1 left-2 text-[9px] font-mono text-slate-600 uppercase">
                  Low / Info
                </span>

                {/* Plot Entities */}
                {VECTRA_QUADRANT_ENTITIES.map((ent) => {
                  const isSelected = selectedQuadrantEntity === ent.id;
                  return (
                    <div
                      key={ent.id}
                      onClick={() => {
                        setSelectedQuadrantEntity(ent.id);
                        setQuery(`host ${ent.id}`);
                      }}
                      style={{
                        left: `${Math.max(10, Math.min(88, ent.certainty))}%`,
                        bottom: `${Math.max(10, Math.min(88, ent.threat))}%`,
                      }}
                      className="absolute transform -translate-x-1/2 translate-y-1/2 cursor-pointer group"
                      title={`${ent.name} (${ent.id})\nThreat: ${ent.threat}/100 · Certainty: ${ent.certainty}%`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                          ent.quadrant === 'CRITICAL'
                            ? 'bg-rose-500 border-white text-white'
                            : ent.quadrant === 'HIGH'
                            ? 'bg-amber-500 border-amber-200 text-black'
                            : 'bg-cyan-600 border-cyan-300'
                        } ${isSelected ? 'ring-2 ring-cyan-400 scale-125' : 'group-hover:scale-125'}`}
                      />
                      <span className="absolute left-4 top-0 text-[9px] font-mono text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 bg-[#080c14] px-1 py-0.5 rounded border border-slate-700 z-10">
                        {ent.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="text-[10px] font-mono text-slate-500 flex justify-between">
                <span>Threat Score (Y)</span>
                <span className="text-rose-400 font-semibold">2 Critical Entities Identified</span>
                <span>Certainty (X)</span>
              </div>
            </div>

            {/* Graph 2: Corelight / Zeek DNS Shannon Entropy Distribution */}
            <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-slate-200">
                    Corelight DNS Shannon Entropy
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">DGA & Tunneling</span>
              </div>

              {/* Entropy Distribution Bars */}
              <div className="h-44 w-full bg-[#060911] border border-slate-800/80 rounded p-2.5 flex flex-col justify-between text-xs font-mono">
                {DNS_ENTROPY_BUCKETS.map((bucket) => {
                  const widthPct = Math.round((bucket.count / 4000) * 100);
                  const isCritical = bucket.threat === 'CRITICAL';
                  return (
                    <div
                      key={bucket.range}
                      onClick={() => isCritical && handleApplyEntropyFilter()}
                      className={`space-y-0.5 ${isCritical ? 'cursor-pointer group' : ''}`}
                    >
                      <div className="flex justify-between text-[10px]">
                        <span className={isCritical ? 'text-rose-400 font-bold group-hover:underline' : 'text-slate-400'}>
                          {bucket.range} ({bucket.label})
                        </span>
                        <span className="text-slate-300 font-semibold tabular-nums">
                          {bucket.count}
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-xs overflow-hidden">
                        <div
                          style={{ width: `${Math.max(4, widthPct)}%` }}
                          className={`h-full rounded-xs transition-all ${
                            isCritical
                              ? 'bg-rose-500 group-hover:bg-rose-400'
                              : bucket.threat === 'SUSPICIOUS'
                              ? 'bg-amber-500'
                              : 'bg-cyan-600/70'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-[10px] font-mono text-slate-500 flex justify-between">
                <span>Entropy &gt; 4.2 = Cobalt Strike / Iodine</span>
                <button
                  type="button"
                  onClick={handleApplyEntropyFilter}
                  className="text-cyan-400 hover:underline cursor-pointer"
                >
                  Filter Tunneling (88)
                </button>
              </div>
            </div>

            {/* Graph 3: Arkime SPI Top Destination Ports Facet */}
            <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold text-slate-200">
                    Arkime SPI Top Ports & Protocol Mix
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Facet Drilldown</span>
              </div>

              {/* Port Frequency Bars */}
              <div className="h-44 w-full bg-[#060911] border border-slate-800/80 rounded p-2.5 flex flex-col justify-between text-xs font-mono">
                {TOP_PORTS.map((item) => (
                  <div
                    key={item.port}
                    onClick={() => handleApplyPortFilter(item.port)}
                    className="space-y-0.5 cursor-pointer group"
                  >
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-300 group-hover:text-cyan-300">
                        Port {item.port} ({item.service})
                      </span>
                      <span className="text-slate-400 tabular-nums">
                        {item.flows} ({item.pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-xs overflow-hidden">
                      <div
                        style={{ width: `${item.pct}%` }}
                        className={`h-full rounded-xs transition-all ${
                          item.port === 445
                            ? 'bg-amber-500'
                            : item.port === 88
                            ? 'bg-violet-500'
                            : 'bg-cyan-500 group-hover:bg-cyan-400'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] font-mono text-slate-500 flex justify-between">
                <span>Click any port to inject into BPF search</span>
                <span className="text-slate-400">4,880 Total Sessions</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: FLOW GRID & HEX DISSECTOR */}
      {(viewMode === 'COMBINED' || viewMode === 'FLOWS_ONLY') && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-start">
          {/* Left Pane: Flow Session Stream Table (7 cols) */}
          <div className="xl:col-span-7 bg-[#090d16] border border-slate-800 rounded overflow-hidden flex flex-col">
            <div className="p-3 bg-[#0d121f] border-b border-slate-800 text-xs text-slate-300 flex items-center justify-between font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-100 font-semibold">Live Wire Session Stream</span>
                <span className="text-slate-500">·</span>
                <span className="text-cyan-400">{filteredFlows.length} Captured Flows</span>
              </div>
              <span className="text-slate-500 text-[10px]">Ring Buffer: TAP-CORE-01 (10G SFP28)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#060911] border-b border-slate-800 text-slate-500 text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="py-2 px-3">Flow ID</th>
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3">7D Ownership Key (Site / Sensor / VLAN / VRF)</th>
                    <th className="py-2 px-3">5-Tuple (Src &rarr; Dst)</th>
                    <th className="py-2 px-3">Proto / Flags</th>
                    <th className="py-2 px-3">JA4 / SNI Indicator</th>
                    <th className="py-2 px-3 text-right">Bytes</th>
                    <th className="py-2 px-3 text-center">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300 text-[11px]">
                  {filteredFlows.map((flow) => {
                    const isSelected = selectedFlow.flowId === flow.flowId;
                    return (
                      <tr
                        key={flow.flowId}
                        onClick={() => setSelectedFlow(flow)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-white'
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-semibold text-slate-300 whitespace-nowrap">
                          {flow.flowId}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap text-[10px]">
                          {flow.timestamp.split(' ')[1]}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-[10px] font-mono text-slate-300">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-cyan-300 font-semibold">{flow.siteId}</span>
                              <span className="text-slate-600">/</span>
                              <span className="text-slate-300">{flow.sensorId}</span>
                            </div>
                            <div className="text-[9px] text-slate-400">
                              QinQ: <span className="text-slate-200">O:{flow.outerVid} I:{flow.innerVid}</span> · <span className="text-indigo-300">{flow.routingDomain}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-[11px]">
                          <span className="text-slate-200">{flow.srcIp}:{flow.srcPort}</span>
                          <span className="text-slate-500 mx-1.5">&rarr;</span>
                          <span className="text-slate-200">{flow.dstIp}:{flow.dstPort}</span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-[10px]">
                          <span className="text-slate-300 font-semibold">{flow.proto}</span>
                          {flow.tcpFlags && flow.tcpFlags.length > 0 && (
                            <span className="text-slate-500 ml-1">[{flow.tcpFlags.join(',')}]</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-[10px] text-slate-400 max-w-[160px] truncate" title={flow.ja4}>
                          {flow.ja4 !== '-' ? flow.ja4.substring(0, 16) + '...' : flow.sni}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap text-slate-400 tabular-nums">
                          {flow.bytes > 1024 ? `${(flow.bytes / 1024).toFixed(1)} KB` : `${flow.bytes} B`}
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          {flow.verdict === 'MALICIOUS' ? (
                            <span className="text-rose-400 font-semibold text-[10px] flex items-center justify-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              <span>MAL</span>
                            </span>
                          ) : flow.verdict === 'SUSPICIOUS' ? (
                            <span className="text-amber-400 font-semibold text-[10px] flex items-center justify-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span>SUSP</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px] flex items-center justify-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                              <span>NOM</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Pane: Deep Packet Dissection & Hex/ASCII Inspector (5 cols) */}
          <div className="xl:col-span-5 bg-[#090d16] border border-slate-800 rounded overflow-hidden flex flex-col">
            <div className="p-3 bg-[#0d121f] border-b border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-100 font-sans">
                    Packet Dissection Inspector
                  </span>
                  <span className="font-mono text-[10px] text-cyan-400 font-bold">
                    {selectedFlow.flowId}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {selectedFlow.srcIp}:{selectedFlow.srcPort} &rarr; {selectedFlow.dstIp}:{selectedFlow.dstPort}
                </div>
              </div>

              {/* Segmented Tab Controls */}
              <div className="flex items-center gap-1 p-0.5 bg-[#060911] border border-slate-800 rounded">
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('HEX')}
                  className={`px-2 py-0.5 text-[10px] font-mono font-medium rounded transition-colors cursor-pointer ${
                    activeInspectorTab === 'HEX'
                      ? 'bg-slate-700 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Hex/ASCII
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('DISSECTION')}
                  className={`px-2 py-0.5 text-[10px] font-mono font-medium rounded transition-colors cursor-pointer ${
                    activeInspectorTab === 'DISSECTION'
                      ? 'bg-slate-700 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  L2-L7 Tree
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('ATTRIBUTES')}
                  className={`px-2 py-0.5 text-[10px] font-mono font-medium rounded transition-colors cursor-pointer ${
                    activeInspectorTab === 'ATTRIBUTES'
                      ? 'bg-slate-700 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  JA4 Profile
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('7D_KEY')}
                  className={`px-2 py-0.5 text-[10px] font-mono font-medium rounded transition-colors cursor-pointer ${
                    activeInspectorTab === '7D_KEY'
                      ? 'bg-slate-700 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  7D Ownership
                </button>
              </div>
            </div>

            {/* Inspector Body */}
            <div className="p-3 bg-[#060911] space-y-3 min-h-[300px]">
              {activeInspectorTab === 'HEX' && (
                <div className="font-mono text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 border-b border-slate-800/80">
                    <span>Offset</span>
                    <span className="hidden sm:inline">Hexadecimal Payload Bytes</span>
                    <span>ASCII Representation</span>
                  </div>

                  <div className="space-y-1 overflow-x-auto text-[11px]">
                    {selectedFlow.hexPayload.map((line, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-slate-600 select-none">
                          {(idx * 16).toString(16).padStart(4, '0')}
                        </span>
                        <span className="text-cyan-300 font-mono tracking-wider flex-1 whitespace-nowrap">
                          {line}
                        </span>
                        <span className="text-amber-300 select-all font-mono whitespace-nowrap">
                          {selectedFlow.asciiPayload[idx]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeInspectorTab === 'DISSECTION' && (
                <div className="font-mono text-xs space-y-2 text-slate-300">
                  <div className="p-2 rounded bg-[#090d16] border border-slate-800">
                    <span className="text-cyan-400 font-semibold">Frame 1:</span> {selectedFlow.bytes} bytes on wire ({selectedFlow.packets} packets)
                  </div>
                  <div className="p-2 rounded bg-[#090d16] border border-slate-800">
                    <span className="text-cyan-400 font-semibold">Ethernet II:</span> Src: 00:1a:2b:3c:4d:5e, Dst: 00:0c:29:88:12:44
                  </div>
                  <div className="p-2 rounded bg-[#090d16] border border-slate-800">
                    <span className="text-cyan-400 font-semibold">IPv4 Protocol:</span> Src: {selectedFlow.srcIp}, Dst: {selectedFlow.dstIp}
                  </div>
                  <div className="p-2 rounded bg-[#090d16] border border-slate-800">
                    <span className="text-cyan-400 font-semibold">{selectedFlow.proto} Transport:</span> Port {selectedFlow.srcPort} &rarr; Port {selectedFlow.dstPort}
                  </div>
                  {selectedFlow.sni && (
                    <div className="p-2 rounded bg-[#090d16] border border-slate-800">
                      <span className="text-amber-400 font-semibold">L7 Application Metadata:</span> {selectedFlow.sni}
                    </div>
                  )}
                </div>
              )}

              {activeInspectorTab === 'ATTRIBUTES' && (
                <div className="font-mono text-xs space-y-2 text-slate-300">
                  <div className="p-2.5 rounded bg-[#090d16] border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Client JA4 Fingerprint:</span>
                      <button
                        type="button"
                        onClick={handleCopyJa4}
                        className="text-cyan-400 hover:text-cyan-300 text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedJa4 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedJa4 ? 'Copied' : 'Copy JA4'}</span>
                      </button>
                    </div>
                    <code className="text-rose-400 break-all text-[11px] block">
                      {selectedFlow.ja4}
                    </code>
                  </div>

                  <div className="p-2.5 rounded bg-[#090d16] border border-slate-800 space-y-1">
                    <span className="text-slate-400">Server JA4S Fingerprint:</span>
                    <code className="text-cyan-300 break-all text-[11px] block">
                      {selectedFlow.ja4s}
                    </code>
                  </div>

                  <div className="p-2.5 rounded bg-[#090d16] border border-slate-800 space-y-1">
                    <span className="text-slate-400">Attribution & MITRE ATT&CK:</span>
                    <div className="text-amber-300 font-semibold text-[11px]">
                      {selectedFlow.mitreTactic || 'Cobalt Strike C2 Profile'}
                    </div>
                  </div>
                </div>
              )}

              {activeInspectorTab === '7D_KEY' && (
                <div className="font-mono text-xs space-y-2 text-slate-300">
                  <div className="p-2.5 rounded bg-[#080d1a] border border-cyan-800/60 space-y-1">
                    <div className="text-cyan-300 font-semibold text-[11px] flex items-center justify-between">
                      <span>7-DIMENSIONAL FLOW OWNERSHIP KEY</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-400">
                        IMMUTABLE WIRE TUPLE
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans">
                      Authoritative multi-dimensional packet provenance key mapping physical ingress point, encapsulation tags, and logical security partition.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                    <div className="p-2 rounded bg-[#090d16] border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">1. Site ID:</span>
                      <span className="font-bold text-cyan-300">{selectedFlow.siteId}</span>
                    </div>
                    <div className="p-2 rounded bg-[#090d16] border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">2. Sensor ID:</span>
                      <span className="font-bold text-slate-200">{selectedFlow.sensorId}</span>
                    </div>
                    <div className="p-2 rounded bg-[#090d16] border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">3. Outer VID (802.1Q/ad QinQ):</span>
                      <span className="font-bold text-emerald-400">VLAN {selectedFlow.outerVid}</span>
                    </div>
                    <div className="p-2 rounded bg-[#090d16] border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">4. Inner VID (802.1Q):</span>
                      <span className="font-bold text-emerald-400">VLAN {selectedFlow.innerVid}</span>
                    </div>
                    <div className="p-2 rounded bg-[#090d16] border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">5. 802.1p PCP / DEI:</span>
                      <span className="text-amber-300 font-medium">{selectedFlow.pcpDei}</span>
                    </div>
                    <div className="p-2 rounded bg-[#090d16] border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">6. Routing Domain (VRF):</span>
                      <span className="font-bold text-purple-300">{selectedFlow.routingDomain}</span>
                    </div>
                    <div className="p-2 rounded bg-[#090d16] border border-slate-800 space-y-0.5">
                      <span className="text-slate-400 block text-[10px]">7. Full 5-Tuple:</span>
                      <div className="text-slate-200 font-semibold break-all text-[11px]">
                        {selectedFlow.srcIp}:{selectedFlow.srcPort} &rarr; {selectedFlow.dstIp}:{selectedFlow.dstPort} ({selectedFlow.proto})
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Footer */}
            <div className="p-2.5 bg-[#0d121f] border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 text-[11px]">
                Wire interface: {selectedFlow.interfaceId}
              </span>
              <button
                type="button"
                onClick={() => {
                  setCurrentPath('/evidence/pcap');
                }}
                className="px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Extract Flow PCAP</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
