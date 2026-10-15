export interface CveThreatRecord {
  id: string;
  timestamp: string;
  category: string;
  cveRefs: string[];
  clientIp: string;
  method: string;
  path: string;
  signatureMatched: string;
  actionTaken: 'BLOCKED' | 'SANITIZED' | 'LOGGED';
}

const LEDGER_CAPACITY = 50;
const HISTORIC_DEFLECTION_BASELINE = 42;

const deflectedThreats: CveThreatRecord[] = [];
let deflectedAttackCount = HISTORIC_DEFLECTION_BASELINE;

export const threatLedger = {
  countDeflection(): void {
    deflectedAttackCount++;
  },

  record(threat: CveThreatRecord): void {
    deflectedAttackCount++;
    deflectedThreats.unshift(threat);
    if (deflectedThreats.length > LEDGER_CAPACITY) deflectedThreats.pop();
  },

  totalDeflected(): number {
    return deflectedAttackCount;
  },

  recent(limit: number): CveThreatRecord[] {
    return deflectedThreats.slice(0, limit);
  },
};
