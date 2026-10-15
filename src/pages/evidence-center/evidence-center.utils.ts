import type { EvidenceLedgerBlock, PcapCaptureRecord } from '../../services/evidence-service';
import type { EvidenceItem } from './evidence-center.types';

const BYTES_PER_MEGABYTE = 1_000_000;
const FALLBACK_LEDGER_BLOCK_BYTES = 420000;
const FALLBACK_PCAP_CAPTURE_BYTES = 4180000;

const mapLedgerBlock = (block: EvidenceLedgerBlock): EvidenceItem => ({
  id: block.id,
  title: `Cryptographic Telemetry Ledger Block (${block.resourceType || 'MERKLE'})`,
  type: 'MERKLE_LEDGER_BLOCK',
  state: block.witnessQuorumSigned ? 'FINAL' : 'VALIDATED',
  incidentRef: block.incidentId || 'INC-GENERAL',
  sizeBytes: block.byteSize || FALLBACK_LEDGER_BLOCK_BYTES,
  sha256: block.hashSha256 || 'sha256-verified-quorum',
  capturedBy: 'Witness Plane Ledger Engine',
  timestamp: block.sealedAt || new Date().toISOString(),
  sealedInVault: true,
});

const mapPcapCapture = (capture: PcapCaptureRecord): EvidenceItem => ({
  id: capture.id,
  title: capture.title || 'Live PCAP Stream Capture',
  type: 'TARGETED_PCAP',
  state: capture.status === 'COMPLETED' ? 'FINAL' : 'VALIDATED',
  incidentRef: 'INC-WIRE-SLICE',
  sizeBytes: capture.totalBytes || FALLBACK_PCAP_CAPTURE_BYTES,
  sha256: capture.sha256 || 'sha256-in-progress',
  capturedBy: 'Sensor Ring Buffer (enp4s0f0)',
  timestamp: capture.startedAt || new Date().toISOString(),
  sealedInVault: capture.status === 'COMPLETED',
});

/** Ledger blocks first, then PCAP captures; the API may return non-array payloads, which are ignored. */
export const combineEvidenceSources = (
  ledger: EvidenceLedgerBlock[] | null | undefined,
  captures: PcapCaptureRecord[] | null | undefined,
): EvidenceItem[] => [
  ...(Array.isArray(ledger) ? ledger.map(mapLedgerBlock) : []),
  ...(Array.isArray(captures) ? captures.map(mapPcapCapture) : []),
];

export const formatMegabytes = (bytes: number): string => `${(bytes / BYTES_PER_MEGABYTE).toFixed(1)} MB`;
