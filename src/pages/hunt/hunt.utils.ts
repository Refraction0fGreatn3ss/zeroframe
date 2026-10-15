import type { DnsEntropyBucket, ProtocolFilter, QuadrantLevel, TimeHistogramBucket, WireFlow } from './hunt.types';

const BYTES_PER_KILOBYTE = 1024;
const JA4_PREVIEW_LENGTH = 16;
const HEX_BYTES_PER_LINE = 16;
const HEX_OFFSET_WIDTH = 4;

export const HISTOGRAM_MAX_PACKETS = 45000;
export const HISTOGRAM_SPIKE_ANOMALY_THRESHOLD = 4;
export const ENTROPY_MAX_COUNT = 4000;
export const ENTROPY_MIN_BAR_PCT = 4;
export const QUADRANT_PLOT_MIN_PCT = 10;
export const QUADRANT_PLOT_MAX_PCT = 88;
export const SMB_PORT = 445;
export const KERBEROS_PORT = 88;

export const filterFlows = (flows: WireFlow[], query: string, protocol: ProtocolFilter): WireFlow[] =>
  flows.filter((flow) => {
    if (protocol !== 'ALL' && flow.proto !== protocol) {
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
      flow.mitreTactic?.toLowerCase().includes(q)
    );
  });

export const formatFlowBytes = (bytes: number): string =>
  bytes > BYTES_PER_KILOBYTE ? `${(bytes / BYTES_PER_KILOBYTE).toFixed(1)} KB` : `${bytes} B`;

export const formatFlowTime = (timestamp: string): string => timestamp.split(' ')[1];

export const formatFlowIndicator = (flow: WireFlow): string =>
  flow.ja4 !== '-' ? `${flow.ja4.substring(0, JA4_PREVIEW_LENGTH)}...` : flow.sni;

export const formatHexOffset = (lineIndex: number): string =>
  (lineIndex * HEX_BYTES_PER_LINE).toString(16).padStart(HEX_OFFSET_WIDTH, '0');

export const hasCopyableJa4 = (ja4: string): boolean => Boolean(ja4) && ja4 !== '-';

export const clampQuadrantPosition = (value: number): number =>
  Math.max(QUADRANT_PLOT_MIN_PCT, Math.min(QUADRANT_PLOT_MAX_PCT, value));

export const isHistogramSpike = (bucket: TimeHistogramBucket): boolean =>
  bucket.anomalies >= HISTOGRAM_SPIKE_ANOMALY_THRESHOLD;

export const histogramBarHeightPct = (bucket: TimeHistogramBucket): number =>
  Math.round((bucket.packets / HISTOGRAM_MAX_PACKETS) * 100);

export const histogramBarClass = (bucket: TimeHistogramBucket): string => {
  if (isHistogramSpike(bucket)) return 'bg-rose-500 group-hover:bg-rose-400 shadow-sm shadow-rose-900/50';
  if (bucket.anomalies > 0) return 'bg-amber-500 group-hover:bg-amber-400';
  return 'bg-cyan-600/70 group-hover:bg-cyan-500';
};

export const quadrantDotClass = (level: QuadrantLevel): string => {
  if (level === 'CRITICAL') return 'bg-rose-500 border-white text-white';
  if (level === 'HIGH') return 'bg-amber-500 border-amber-200 text-black';
  return 'bg-cyan-600 border-cyan-300';
};

export const entropyBarWidthPct = (bucket: DnsEntropyBucket): number =>
  Math.max(ENTROPY_MIN_BAR_PCT, Math.round((bucket.count / ENTROPY_MAX_COUNT) * 100));

export const entropyBarClass = (bucket: DnsEntropyBucket): string => {
  if (bucket.threat === 'CRITICAL') return 'bg-rose-500 group-hover:bg-rose-400';
  if (bucket.threat === 'SUSPICIOUS') return 'bg-amber-500';
  return 'bg-cyan-600/70';
};

export const portBarClass = (port: number): string => {
  if (port === SMB_PORT) return 'bg-amber-500';
  if (port === KERBEROS_PORT) return 'bg-violet-500';
  return 'bg-cyan-500 group-hover:bg-cyan-400';
};
