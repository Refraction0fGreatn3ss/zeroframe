import type { LifecycleStage, PreflightCheck } from './fleet.types';

export const CONFIG_APPLIED_STAGE_ID = 'CONFIG_APPLIED';
export const VERIFIED_STAGE_ID = 'VERIFIED';

/** Number of lifecycle stages completed by a sensor that has reached VERIFIED. */
export const COMPLETED_STAGE_COUNT = 10;

export const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    step: 1,
    id: 'ENROLLMENT_REQUESTED',
    label: 'Enrollment Request',
    desc: 'Hardware attestation & initial bootstrap beacon',
  },
  { step: 2, id: 'CSR_PENDING', label: 'CSR Pending', desc: 'TPM 2.0 CSR generated with curve Ed25519' },
  { step: 3, id: 'CERT_ISSUED', label: 'Certificate Issued', desc: 'Signed by Intermediate Fleet CA' },
  { step: 4, id: 'TRUST_VERIFIED', label: 'Trust Verified', desc: 'Mutual mTLS cryptographic handshake confirmed' },
  { step: 5, id: 'CONFIG_SENT', label: 'Config Sent', desc: 'Signed control plane wire policy transmitted' },
  {
    step: 6,
    id: 'CONFIG_ACCEPTED',
    label: 'Config Accepted',
    desc: 'Sensor daemon validates schema and cryptographic signature',
  },
  { step: 7, id: 'CONFIG_APPLIED', label: 'Config Applied', desc: 'eBPF / AF_XDP filters attached to kernel ring' },
  { step: 8, id: 'OBSERVING', label: 'Observing', desc: 'Raw ingress frames parsing through protocol decoders' },
  { step: 9, id: 'VERIFYING', label: 'Verifying', desc: 'Autonomous canary loop validating detection accuracy' },
  { step: 10, id: 'VERIFIED', label: 'Verified Nominal', desc: 'Authoritative telemetry certification issued' },
  { step: 11, id: 'DRAINING', label: 'Draining', desc: 'Safe ring buffer flushing prior to maintenance' },
  { step: 12, id: 'MAINTENANCE', label: 'Maintenance', desc: 'Kernel upgrade or driver reconfiguration' },
  { step: 13, id: 'RETIRED', label: 'Retired', desc: 'Appliance gracefully decommissioned' },
  { step: 14, id: 'REVOKED', label: 'Revoked', desc: 'mTLS certificate purged from trust domain' },
];

export const PREFLIGHT_CHECKS: PreflightCheck[] = [
  {
    id: 'CHK-01',
    name: 'AF_XDP Driver & UMEM Ring Buffer Allocation',
    status: 'PASSED',
    target: 'enp4s0f0 (Queue 0-15)',
    metric: 'Zero-Copy Direct DMA Enabled',
    latency: '0.12 ms',
  },
  {
    id: 'CHK-02',
    name: 'Hardware Offload Disable & Promiscuous Mode',
    status: 'PASSED',
    target: 'LRO/GRO/TSO disabled',
    metric: 'True Wire Reconstruction',
    latency: '0.04 ms',
  },
  {
    id: 'CHK-03',
    name: 'Hugepages 2MB/1GB Pool Availability',
    status: 'PASSED',
    target: '16 x 1GB Pages allocated',
    metric: '16,384 MB locked memory',
    latency: '0.08 ms',
  },
  {
    id: 'CHK-04',
    name: 'Hardware TPM 2.0 & Secure Boot Attestation',
    status: 'PASSED',
    target: 'PCR[0-7] Sha256 Verified',
    metric: 'Golden Kernel Signature',
    latency: '1.40 ms',
  },
  {
    id: 'CHK-05',
    name: 'QinQ 802.1Q/ad VLAN Unstripping Support',
    status: 'PASSED',
    target: 'Nested Tag Parser',
    metric: 'Inner/Outer VID Preservation',
    latency: '0.02 ms',
  },
  {
    id: 'CHK-06',
    name: 'SPIFFE mTLS Mutual Attestation with Control Plane',
    status: 'PASSED',
    target: 'spiffe://zeroframe.corp',
    metric: 'Ed25519 Mutual Verified',
    latency: '4.80 ms',
  },
  {
    id: 'CHK-07',
    name: 'PTP/NTP Sub-Millisecond Time Synchronization',
    status: 'PASSED',
    target: 'IEEE 1588 PTP Hardware Clock',
    metric: 'Clock Drift < 42 ns',
    latency: '0.01 ms',
  },
  {
    id: 'CHK-08',
    name: 'Kernel Ingress Buffer Ring Drops Benchmark',
    status: 'PASSED',
    target: '14.88 Mpps Line Rate Test',
    metric: '0.0000% Packet Drop Rate',
    latency: '12.0 ms',
  },
  {
    id: 'CHK-09',
    name: 'Disk NVMe Ring Buffer Write Throughput',
    status: 'PASSED',
    target: 'PCIe Gen5 NVMe Array',
    metric: 'Write Speed 4.2 GB/s',
    latency: '2.10 ms',
  },
  {
    id: 'CHK-10',
    name: 'Byzantine Witness Consensus Notary Link',
    status: 'PASSED',
    target: 'Quorum (3/3 signed)',
    metric: 'Sub-second Notary Seal',
    latency: '18.4 ms',
  },
];
