import type { AnomalySignal, KillChainStage, ProtocolShare, TimeRange } from './command-center.types';

export const LIVE_WIRE_ANOMALIES: AnomalySignal[] = [
  {
    id: 'SIG-8812',
    type: 'JA4_FINGERPRINT',
    indicator: 't13d1516h2_8daaf6152771_0278457224b8',
    detail: 'Known Cobalt Strike Malleable C2 TLS profile over TCP 443',
    sourceIp: '10.140.2.88',
    destination: '185.220.101.44:443',
    risk: 'CRITICAL',
    timestamp: '2m ago',
  },
  {
    id: 'SIG-8813',
    type: 'DNS_ENTROPY',
    indicator: 'Entropy 4.89 · TXT record query burst (84 req/min)',
    detail: 'Encoded payload payload chunking to c2-dns.dynamic-resolver.cc',
    sourceIp: '10.140.10.14',
    destination: '1.1.1.1:53',
    risk: 'HIGH',
    timestamp: '5m ago',
  },
  {
    id: 'SIG-8814',
    type: 'SMB_NAMED_PIPE',
    indicator: '\\\\10.140.4.12\\pipe\\status_rpc_914b',
    detail: 'Anomalous anonymous named pipe connection without kerberos ticket',
    sourceIp: '10.140.2.88',
    destination: '10.140.4.12:445',
    risk: 'CRITICAL',
    timestamp: '8m ago',
  },
  {
    id: 'SIG-8815',
    type: 'BEACON_CADENCE',
    indicator: 'Jitter 2.1% · Interval 60.4s · 32 consecutive heartbeats',
    detail: 'Strict periodic HTTPS POST heartbeats to AWS API Gateway',
    sourceIp: '10.140.8.44',
    destination: '34.201.88.19:443',
    risk: 'ELEVATED',
    timestamp: '14m ago',
  },
];

export const PROTOCOL_DISTRIBUTION: ProtocolShare[] = [
  { name: 'TLS 1.3 / HTTPS', pct: 62.4, color: 'bg-cyan-500' },
  { name: 'DNS (UDP/53)', pct: 15.2, color: 'bg-emerald-500' },
  { name: 'HTTP/2 REST', pct: 10.8, color: 'bg-indigo-500' },
  { name: 'SMB / RPC', pct: 7.4, color: 'bg-amber-500' },
  { name: 'Kerberos / LDAP', pct: 4.2, color: 'bg-violet-500' },
];

export const MITRE_KILL_CHAIN: KillChainStage[] = [
  { stage: 'Initial Access', technique: 'T1190 Exploit Public App', hits: 2, severity: 'ELEVATED' },
  { stage: 'Execution', technique: 'T1059.001 PowerShell Spawn', hits: 5, severity: 'CRITICAL' },
  { stage: 'Persistence', technique: 'T1543.003 Windows Service', hits: 1, severity: 'NOMINAL' },
  { stage: 'Lateral Movement', technique: 'T1021.002 SMB/Admin Share', hits: 4, severity: 'CRITICAL' },
  { stage: 'Command & Control', technique: 'T1071.001 Web Protocols', hits: 7, severity: 'CRITICAL' },
  { stage: 'Exfiltration', technique: 'T1048 Exfil Over Alt Protocol', hits: 3, severity: 'ELEVATED' },
];

export const TIME_RANGE_OPTIONS: readonly TimeRange[] = ['15m', '1h', '6h', '24h'];

export const DEFAULT_TIME_RANGE: TimeRange = '1h';

export const FALLBACK_INGRESS_THROUGHPUT_BPS = 1_420_000_000;

export const FALLBACK_PACKET_RATE_PPS = 184_200;

export const DEFAULT_MITRE_TECHNIQUE = 'T1059';

export const ACTIVITY_LOG_MAX_HEIGHT = '420px';

export const ROUTES = {
  hunt: '/investigate/hunt',
  incidents: '/investigate/incidents',
  pcapEvidence: '/evidence/pcap',
  quarantine: '/respond/quarantine',
  activityLog: '/overview/activity-log',
} as const;
