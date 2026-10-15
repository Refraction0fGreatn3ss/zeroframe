import { minutesAgo } from '../lib/relative-time';
import type {
  CryptoInspectionMetrics,
  EncapsulationIntegrity,
  InspectionStageDetail,
  QueueBackpressureMetrics,
} from '../types/inspection';

export const INITIAL_STAGES: InspectionStageDetail[] = [
  {
    stage: 'CAPTURE',
    state: 'DEGRADED',
    packetRate: 342_000,
    byteRate: 2_450_000_000,
    errorRate: 0.005,
    uninspectedBytes: 12_400_000,
    primaryCause: 'AF_PACKET socket buffer overflow during 10G burst on SENSOR-CORE-01',
    notes: 'Single-core polling bottleneck. Recommend enabling AF_XDP multi-queue driver.',
  },
  {
    stage: 'L2',
    state: 'HEALTHY',
    packetRate: 341_982,
    byteRate: 2_449_800_000,
    errorRate: 0.0,
    uninspectedBytes: 0,
    notes: 'Ethernet II framing, 802.1Q single and QinQ double tagging parsed cleanly.',
  },
  {
    stage: 'L3',
    state: 'PARTIAL',
    packetRate: 341_982,
    byteRate: 2_449_800_000,
    errorRate: 0.012,
    uninspectedBytes: 29_000_000,
    primaryCause: 'IPv4 Fragment Cache exhaustion (16,384 contexts full) under high UDP rate',
    notes: 'Unreassembled fragments passed to flow tracker without L4 payload dissection.',
  },
  {
    stage: 'TRANSPORT',
    state: 'DEGRADED',
    packetRate: 340_100,
    byteRate: 2_430_000_000,
    errorRate: 0.048,
    uninspectedBytes: 116_000_000,
    primaryCause: 'Asymmetric routing on Core-Switch-02 (38% half-open TCP handshakes)',
    notes: 'SYN-ACK return packets route across Link B; sliding window sequence tracking incomplete.',
  },
  {
    stage: 'SESSION',
    state: 'HEALTHY',
    packetRate: 295_000,
    byteRate: 2_100_000_000,
    errorRate: 0.001,
    uninspectedBytes: 0,
    notes: 'Bidirectional session state maintained for 92,400 active concurrent connections.',
  },
  {
    stage: 'CRYPTO',
    state: 'PARTIAL',
    packetRate: 198_000,
    byteRate: 1_650_000_000,
    errorRate: 0.038,
    uninspectedBytes: 85_000_000,
    primaryCause: 'TLS 1.3 Encrypted Client Hello (ECH) and DNS-over-HTTPS blind spots',
    notes: 'JA4/JA4S client & server fingerprints extracted. Payload remains uninspected by design.',
  },
  {
    stage: 'APPLICATION',
    state: 'HEALTHY',
    packetRate: 172_000,
    byteRate: 1_200_000_000,
    errorRate: 0.0,
    uninspectedBytes: 0,
    notes: 'Application dissectors active: DNS, HTTP/1.1, TLS SNI, SSH, Modbus TCP, BACnet/IP.',
  },
];

export const INITIAL_ENCAPSULATION: EncapsulationIntegrity = {
  vlanTrunked: true,
  qinqDetected: true,
  qinqStripped: true,
  vxlanTunnels: 4,
  geneveTunnels: 0,
  mplsLabelsPresent: false,
  asymmetricFlowRatio: 0.18,
  asymmetricAlert: true,
};

export const INITIAL_CRYPTO: CryptoInspectionMetrics = {
  tls12Count: 42_890,
  tls13Count: 88_410,
  ja4FingerprintedFlows: 131_300,
  echDetectedCount: 342,
  dohTunnelCandidates: 78,
  quicFlowsOpaque: 12_890,
  decryptionAttempted: false,
};

export const INITIAL_QUEUE: QueueBackpressureMetrics = {
  kernelBufferLossRate: 0.005,
  sensorOutboxQueueDepth: 340,
  serverIngestQueueDepth: 12,
  maxQueueCapacity: 10_000,
  backpressureState: 'NORMAL',
  lastQueueDropTimestamp: minutesAgo(2),
};
