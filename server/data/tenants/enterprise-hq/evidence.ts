export const evidenceLedger = [
  {
    id: 'EVD-LEDGER-0881',
    hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    previousBlockSha256: 'a718b529d32797860d94f2e2c419b36b996123396866687313028d712176461a',
    resourceType: 'PCAP_BURST_CAPTURE',
    incidentId: 'INC-2026-0881',
    byteSize: 14_820_112,
    sealedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    witnessQuorumSigned: true,
    retentionDays: 365,
    tenantId: 'tenant-enterprise-hq',
  },
];

export const pcapCaptures = [
  {
    id: 'PCAP-CAP-0881',
    title: 'Targeted Ring Extraction for WKST-CORP-088 (10.140.2.88)',
    status: 'COMPLETED',
    framesCaptured: 42_810,
    totalBytes: 14_820_112,
    startedAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    downloadUrl: '/api/v1/evidence/pcap/download/PCAP-CAP-0881',
    tenantId: 'tenant-enterprise-hq',
  },
];

export const witnessNodes = [
  { id: 'WITNESS-HQ-01', location: 'DC-East Ashburn', state: 'ONLINE', role: 'LEADER', quorumMember: true, latencyMs: 1.2 },
  { id: 'WITNESS-HQ-02', location: 'DC-Central Chicago', state: 'ONLINE', role: 'FOLLOWER', quorumMember: true, latencyMs: 14.8 },
  { id: 'WITNESS-HQ-03', location: 'DC-West Hillsboro', state: 'ONLINE', role: 'FOLLOWER', quorumMember: true, latencyMs: 28.4 },
];
