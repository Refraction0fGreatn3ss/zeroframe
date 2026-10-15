/**
 * Compliance Frameworks and Evidence Grounding Types
 * Rule: NEVER claim "compliant" if evidence is missing or stale.
 */

export type ComplianceEvidenceState =
  | 'CURRENT'
  | 'STALE'
  | 'MISSING'
  | 'PARTIAL'
  | 'MANUAL_REVIEW'
  | 'NOT_APPLICABLE'
  | 'UNKNOWN';

export interface ComplianceControl {
  controlId: string;
  name: string;
  framework:
    | 'UAE_IAR'
    | 'QATAR_NIA'
    | 'SAUDI_NCA_ECC'
    | 'NIST_CSF_2_0'
    | 'PCI_DSS_4_0_1'
    | 'NIS2'
    | 'SOC2_TSC';
  domain: string;
  description: string;
  evidenceState: ComplianceEvidenceState;
  evidenceCount: number;
  lastEvidenceTimestamp?: string;
  remediationRecommendation?: string;
  evidenceIds: string[];
}

export interface ComplianceFrameworkSummary {
  id: string;
  name: string;
  region: 'Middle East' | 'Global' | 'Europe';
  totalControls: number;
  evidencedCount: number;
  staleCount: number;
  missingCount: number;
  manualReviewCount: number;
  readinessPercentage: number;
}
