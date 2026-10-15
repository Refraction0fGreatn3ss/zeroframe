export type PcapJobState = 'CAPTURING' | 'COMPLETED' | 'INDEXED';

export interface PcapJob {
  id: string;
  name: string;
  targetBpf: string;
  state: PcapJobState;
  sensorNode: string;
  startedAt: string;
  completedAt: string;
  packetCount: number;
  fileSizeBytes: number;
  sha256: string;
  interfaceId: string;
}

export interface BpfPreset {
  label: string;
  bpf: string;
}

export interface PacketLimitOption {
  value: number;
  label: string;
}
