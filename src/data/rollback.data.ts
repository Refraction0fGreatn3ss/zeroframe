import { minutesAgo, minutesFromNow } from '../lib/relative-time';
import type { QuarantineRecord, RollbackCheckpoint } from '../stores/rollback-store/rollback-normalizers';

const QUARANTINE_ENFORCED_AT = minutesAgo(180);

export const INITIAL_CHECKPOINTS: RollbackCheckpoint[] = [
  {
    id: 'RB-001',
    name: 'Quarantine Host 10.140.2.88 Checkpoint',
    type: 'RESPONSE_ACTION',
    timestamp: minutesAgo(18),
    target: '10.140.2.88 (WKST-CORP-088)',
    status: 'READY',
    reversalAction: 'Flush iptables isolation chain & restore default gateway ARP binding',
    executedBy: 'Approver 1 & Witness Permit PMT-2026-0881',
  },
  {
    id: 'RB-002',
    name: 'Sensor SENSOR-CORE-01 Capture Filter Rollback',
    type: 'SENSOR_CONFIG',
    timestamp: minutesAgo(120),
    target: 'SENSOR-CORE-01 (enp4s0f0)',
    status: 'ROLLED_BACK',
    reversalAction: 'Reverted AF_XDP UMEM descriptor ring size from 4096 to 2048',
    executedBy: 'admin@corp.zeroflash',
  },
];

export const INITIAL_QUARANTINE: QuarantineRecord[] = [
  {
    id: 'QUAR-092',
    targetIp: '10.140.4.99',
    hostname: 'WKST-GUEST-099',
    mac: '00:50:56:cc:99:11',
    mechanism: 'IPTABLES_SENSOR_DROP_CHAIN',
    enforcedAt: QUARANTINE_ENFORCED_AT,
    isolatedAt: QUARANTINE_ENFORCED_AT,
    leaseExpiresAt: minutesFromNow(30),
    permitRef: 'PERMIT-2026-0038',
    status: 'ACTIVE_ENFORCED',
    verifiedOnWire: true,
  },
];
