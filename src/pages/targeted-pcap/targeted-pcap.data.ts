import type { BpfPreset, PacketLimitOption, PcapJob } from './targeted-pcap.types';

export const DEFAULT_BPF_FILTER = 'host 10.140.2.88 and port 445';
export const DEFAULT_JOB_NAME = 'Incident Evidence Extraction';
export const DEFAULT_PACKET_LIMIT = 25000;
export const DEFAULT_TARGET_IP = '10.140.2.88';
export const DEFAULT_SENSOR_NODE = 'SENSOR-CORE-01';
export const DEFAULT_INTERFACE_ID = 'eth0:tap-core-01';
export const DEFAULT_CAPTURE_TITLE = 'Live PCAP Extraction';

export const STREAMING_OPEN_HASH = 'STREAMING_OPEN';
export const IN_PROGRESS_LABEL = 'IN PROGRESS';

export const CAPTURE_DURATION_SECONDS = 60;

export const NEW_JOB_INITIAL_PACKET_COUNT = 12;
export const NEW_JOB_INITIAL_FILE_SIZE_BYTES = 14200;

export const BACKEND_FALLBACK_PACKET_COUNT = 12450;
export const BACKEND_FALLBACK_FILE_SIZE_BYTES = 4180000;

export const PACKET_LIMIT_OPTIONS: PacketLimitOption[] = [
  { value: 5000, label: '5,000 Pkts' },
  { value: 25000, label: '25,000 Pkts' },
  { value: 100000, label: '100,000 Pkts' },
];

export const INITIAL_PCAP_JOBS: PcapJob[] = [
  {
    id: 'PCAP-JOB-102',
    name: 'PsExec Lateral Movement Slice',
    targetBpf: 'host 10.140.2.88 and port 445',
    state: 'COMPLETED',
    sensorNode: 'SENSOR-CORE-01',
    startedAt: '2026-10-13 18:40:00 UTC',
    completedAt: '2026-10-13 18:45:00 UTC',
    packetCount: 14280,
    fileSizeBytes: 14_820_000,
    sha256: '8f4b219c77e1ac0429110840fe92b4105a8bc9013d4491208bf3c21904a28814',
    interfaceId: 'eth0:tap-core-01',
  },
  {
    id: 'PCAP-JOB-103',
    name: 'DNS Tunneling Circular Ring Slice',
    targetBpf: 'udp port 53 and host 10.140.10.14',
    state: 'CAPTURING',
    sensorNode: 'SENSOR-DMZ-02',
    startedAt: '2026-10-13 19:12:00 UTC',
    completedAt: 'IN PROGRESS',
    packetCount: 2940,
    fileSizeBytes: 3_120_000,
    sha256: 'STREAMING_OPEN',
    interfaceId: 'eth1:tap-dmz-02',
  },
  {
    id: 'PCAP-JOB-104',
    name: 'Kerberos TGS Ticket Extraction',
    targetBpf: 'tcp port 88 and (dst 10.140.10.5)',
    state: 'COMPLETED',
    sensorNode: 'SENSOR-CORE-01',
    startedAt: '2026-10-13 17:10:00 UTC',
    completedAt: '2026-10-13 17:15:00 UTC',
    packetCount: 6420,
    fileSizeBytes: 6_940_000,
    sha256: 'a12f9048c10928bfae8912384910824912084918204918209418249182491284',
    interfaceId: 'eth0:tap-core-01',
  },
];

export const BPF_PRESETS: BpfPreset[] = [
  { label: 'SMB / Lateral Movement', bpf: 'host 10.140.2.88 and port 445' },
  { label: 'DNS Exfiltration Stream', bpf: 'udp port 53 and host 10.140.10.14' },
  { label: 'C2 TLS Traffic (Port 443)', bpf: 'tcp port 443 and (src 10.140.2.88 or dst 185.220.101.44)' },
  { label: 'Kerberos Auth Traffic', bpf: 'tcp port 88 and host 10.140.10.5' },
  { label: 'TCP RST Anomalies', bpf: 'tcp[tcpflags] & (tcp-rst) != 0' },
];
