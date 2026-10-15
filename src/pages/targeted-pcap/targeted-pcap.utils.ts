import type { PcapCaptureRecord } from '../../services/evidence-service';
import {
  BACKEND_FALLBACK_FILE_SIZE_BYTES,
  BACKEND_FALLBACK_PACKET_COUNT,
  DEFAULT_CAPTURE_TITLE,
  DEFAULT_INTERFACE_ID,
  DEFAULT_SENSOR_NODE,
  DEFAULT_TARGET_IP,
  IN_PROGRESS_LABEL,
  NEW_JOB_INITIAL_FILE_SIZE_BYTES,
  NEW_JOB_INITIAL_PACKET_COUNT,
  STREAMING_OPEN_HASH,
} from './targeted-pcap.data';
import type { PcapJob } from './targeted-pcap.types';

const UTC_TIMESTAMP_LENGTH = 19;
const FALLBACK_JOB_ID_SUFFIX_LENGTH = 3;
const BYTES_PER_MEGABYTE = 1_000_000;
const HASH_PREVIEW_LENGTH = 16;

/** Formats a date as `YYYY-MM-DD HH:mm:ss UTC`. */
export const formatUtcTimestamp = (date: Date): string =>
  `${date.toISOString().replace('T', ' ').substring(0, UTC_TIMESTAMP_LENGTH)} UTC`;

export const formatMegabytes = (bytes: number): string => `${(bytes / BYTES_PER_MEGABYTE).toFixed(2)} MB`;

export const formatHashPreview = (hash: string): string => `${hash.substring(0, HASH_PREVIEW_LENGTH)}...`;

export const extractTargetIp = (bpfFilter: string): string => {
  const targetMatch = bpfFilter.match(/host\s+([0-9.]+)/i);
  return targetMatch ? targetMatch[1] : DEFAULT_TARGET_IP;
};

export const createFallbackJobId = (): string =>
  `PCAP-JOB-${Date.now().toString().slice(-FALLBACK_JOB_ID_SUFFIX_LENGTH)}`;

export const mapCaptureRecordToJob = (capture: PcapCaptureRecord, targetBpf: string): PcapJob => ({
  id: capture.id,
  name: capture.title || DEFAULT_CAPTURE_TITLE,
  targetBpf,
  state: capture.status === 'EXTRACTING' || capture.status === 'QUEUED' ? 'CAPTURING' : 'COMPLETED',
  sensorNode: DEFAULT_SENSOR_NODE,
  startedAt: capture.startedAt ? new Date(capture.startedAt).toLocaleString() : 'Just now',
  completedAt: capture.completedAt ? new Date(capture.completedAt).toLocaleString() : IN_PROGRESS_LABEL,
  packetCount: capture.framesCaptured || BACKEND_FALLBACK_PACKET_COUNT,
  fileSizeBytes: capture.totalBytes || BACKEND_FALLBACK_FILE_SIZE_BYTES,
  sha256: capture.sha256 || STREAMING_OPEN_HASH,
  interfaceId: DEFAULT_INTERFACE_ID,
});

export const createCapturingJob = (id: string, name: string, targetBpf: string, startedAt: string): PcapJob => ({
  id,
  name,
  targetBpf,
  state: 'CAPTURING',
  sensorNode: DEFAULT_SENSOR_NODE,
  startedAt,
  completedAt: IN_PROGRESS_LABEL,
  packetCount: NEW_JOB_INITIAL_PACKET_COUNT,
  fileSizeBytes: NEW_JOB_INITIAL_FILE_SIZE_BYTES,
  sha256: STREAMING_OPEN_HASH,
  interfaceId: DEFAULT_INTERFACE_ID,
});

export const downloadPcap = (job: PcapJob): void => {
  const a = document.createElement('a');
  a.href = `/api/v1/evidence/pcap/download/${job.id}`;
  a.download = `${job.id}.pcap`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
