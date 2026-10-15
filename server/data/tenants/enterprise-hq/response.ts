export const permits = [
  {
    id: 'PERMIT-2026-0041',
    actionType: 'ISOLATE_HOST_QUARANTINE',
    targetResource: '10.140.2.88 (WKST-CORP-088)',
    reason: 'Contain active Kerberos abuse and PsExec propagation observed in INC-2026-0881',
    status: 'PENDING_APPROVER_2',
    requestedBy: 'op-8841 (Sarah Chen)',
    requestedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    approver1: 'op-8841 (Sarah Chen)',
    approver1Signature: 'SIG-ED25519-CHEN-8841-f7a2',
    approver2: null,
    blastRadiusValidated: true,
    compensatingControl: 'Dynamic Micro-VLAN Isolation with DNS blackhole and Syslog egress only',
    rollbackWindowSeconds: 3600,
    tenantId: 'tenant-enterprise-hq',
  },
];

export const quarantine = [
  {
    id: 'QUAR-092',
    targetIp: '10.140.4.99',
    hostname: 'WKST-GUEST-099',
    mac: '00:50:56:cc:99:11',
    isolatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    permitId: 'PERMIT-2026-0038',
    reason: 'Zero-day weaponized PDF exfiltration',
    provider: 'ZeroFrame Autonomous Tap Filter',
    status: 'ACTIVE_QUARANTINE',
    tenantId: 'tenant-enterprise-hq',
  },
];

export const rollbacks = [
  {
    id: 'ROLL-102',
    actionType: 'ISOLATE_HOST_QUARANTINE',
    targetIp: '10.140.3.11',
    hostname: 'SRV-TEST-BENCH',
    appliedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    rolledBackAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    initiatedBy: 'sec-operator',
    reason: 'False positive confirmed by engineering team; legitimate load test script',
    status: 'VERIFIED_REVERTED',
    tenantId: 'tenant-enterprise-hq',
  },
];
