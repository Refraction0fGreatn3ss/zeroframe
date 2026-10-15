export type FlowProtocol = 'TCP' | 'UDP' | 'ICMP' | 'QUIC' | 'ECH' | 'DoH' | 'SMB' | 'Modbus/TCP' | 'BACnet/IP';

export type FlowVerdict = 'MALICIOUS' | 'SUSPICIOUS' | 'ANOMALOUS' | 'NOMINAL';

export interface WireFlow {
  flowId: string;
  timestamp: string;
  siteId: string;
  sensorId: string;
  /** 802.1Q/QinQ outer VLAN ID. */
  outerVid: number | string;
  innerVid: number | string;
  /** 802.1p Priority Code Point / Drop Eligible Indicator. */
  pcpDei: string;
  /** VRF / routing domain. */
  routingDomain: string;
  srcIp: string;
  srcPort: number;
  dstIp: string;
  dstPort: number;
  proto: FlowProtocol;
  tcpFlags?: string[];
  ja4: string;
  ja4s: string;
  sni: string;
  bytes: number;
  packets: number;
  durationMs: number;
  verdict: FlowVerdict;
  mitreTactic?: string;
  interfaceId: string;
  hexPayload: string[];
  asciiPayload: string[];
}

export interface TimeHistogramBucket {
  time: string;
  packets: number;
  bytesMb: number;
  anomalies: number;
}

export type QuadrantLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface QuadrantEntity {
  id: string;
  name: string;
  threat: number;
  certainty: number;
  quadrant: QuadrantLevel;
  alerts: number;
}

export type EntropyThreat = 'LOW' | 'NOMINAL' | 'SUSPICIOUS' | 'CRITICAL';

export interface DnsEntropyBucket {
  range: string;
  count: number;
  label: string;
  threat: EntropyThreat;
}

export interface TopPortFacet {
  port: number;
  service: string;
  flows: number;
  pct: number;
}

export interface SavedHunt {
  id: string;
  label: string;
  query: string;
  protocol?: string;
}

export type ProtocolFilter = 'ALL' | Exclude<FlowProtocol, 'ICMP'>;

export type HuntViewMode = 'COMBINED' | 'GRAPHS_ONLY' | 'FLOWS_ONLY';

export type InspectorTab = 'HEX' | 'DISSECTION' | 'ATTRIBUTES' | '7D_KEY';

export type ResultState = 'COMPLETE' | 'PARTIAL / TRUNCATED';
