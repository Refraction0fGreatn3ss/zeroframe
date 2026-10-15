import { PCAP_EXTRACTION_DELAY_MS } from '../config.ts';
import { broadcastTenantEvent } from '../realtime/event-broadcaster.ts';
import type { PcapCapture, TenantContext } from '../types/tenant.ts';

const PCAP_MAGIC_NUMBER = 0xa1b2c3d4;
const PCAP_MAX_SNAPLEN = 65535;
const LINKTYPE_ETHERNET = 1;

export function startPcapExtraction(tenant: TenantContext, targetIp: string | undefined): PcapCapture {
  const capture: PcapCapture = {
    id: `PCAP-CAP-${Date.now().toString().slice(-4)}`,
    title: `On-Demand Buffer Capture for ${targetIp || 'Active Anomaly'}`,
    status: 'EXTRACTING',
    framesCaptured: 12450,
    totalBytes: 4_180_000,
    startedAt: new Date().toISOString(),
    completedAt: null,
    sha256: `sha256-${Date.now()}`,
    downloadUrl: '#',
    tenantId: tenant.id,
  };

  tenant.db.pcapCaptures.unshift(capture);

  setTimeout(() => {
    capture.status = 'COMPLETED';
    capture.completedAt = new Date().toISOString();
    broadcastTenantEvent(tenant.id, 'PCAP_EXTRACTION_COMPLETED', capture);
  }, PCAP_EXTRACTION_DELAY_MS);

  return capture;
}

function buildGlobalHeader(): Buffer {
  const header = Buffer.alloc(24);
  header.writeUInt32LE(PCAP_MAGIC_NUMBER, 0);
  header.writeUInt16LE(2, 4);
  header.writeUInt16LE(4, 6);
  header.writeInt32LE(0, 8);
  header.writeUInt32LE(0, 12);
  header.writeUInt32LE(PCAP_MAX_SNAPLEN, 16);
  header.writeUInt32LE(LINKTYPE_ETHERNET, 20);
  return header;
}

function buildPacketRecord(payload: Buffer): Buffer {
  const header = Buffer.alloc(16);
  header.writeUInt32LE(Math.floor(Date.now() / 1000), 0);
  header.writeUInt32LE(0, 4);
  header.writeUInt32LE(payload.length, 8);
  header.writeUInt32LE(payload.length, 12);
  return Buffer.concat([header, payload]);
}

export function buildPcapFile(captureId: string): Buffer {
  const payload = Buffer.from(
    `ZeroFlash Enterprise PCAP Stream - CaptureID: ${captureId} - Timestamp: ${new Date().toISOString()}`,
  );
  return Buffer.concat([buildGlobalHeader(), buildPacketRecord(payload)]);
}
