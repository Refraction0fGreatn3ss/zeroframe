/**
 * ZeroFrame Evidence, Targeted PCAP & Witness Plane Service
 */

import { apiClient } from './api-client';

export interface EvidenceLedgerBlock {
  id: string;
  hashSha256: string;
  previousBlockSha256: string;
  resourceType: string;
  incidentId: string;
  byteSize: number;
  sealedAt: string;
  witnessQuorumSigned: boolean;
  retentionDays: number;
  tenantId: string;
}

export interface PcapCaptureRecord {
  id: string;
  title: string;
  status: 'QUEUED' | 'EXTRACTING' | 'COMPLETED' | 'FAILED';
  framesCaptured: number;
  totalBytes: number;
  startedAt: string;
  completedAt?: string | null;
  sha256?: string;
  downloadUrl?: string;
  tenantId: string;
}

export interface WitnessNodeRecord {
  id: string;
  location: string;
  state: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  role: 'LEADER' | 'FOLLOWER';
  quorumMember: boolean;
  latencyMs: number;
}

export const evidenceService = {
  async getLedger(): Promise<EvidenceLedgerBlock[]> {
    const res = await apiClient.get<{ ledger: EvidenceLedgerBlock[] }>('/evidence/ledger');
    return res.data.ledger;
  },

  async getPcapCaptures(): Promise<PcapCaptureRecord[]> {
    const res = await apiClient.get<{ captures: PcapCaptureRecord[] }>('/evidence/pcap');
    return res.data.captures;
  },

  async startPcapCapture(targetIp: string, durationSeconds: number = 60): Promise<PcapCaptureRecord> {
    const res = await apiClient.post<{ success: boolean; capture: PcapCaptureRecord }>('/evidence/pcap/start', {
      targetIp,
      durationSeconds,
    });
    return res.data.capture;
  },

  async getWitnessNodes(): Promise<WitnessNodeRecord[]> {
    const res = await apiClient.get<{ witnessNodes: WitnessNodeRecord[] }>('/evidence/witness');
    return res.data.witnessNodes;
  },
};
