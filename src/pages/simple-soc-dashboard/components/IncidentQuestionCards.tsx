import type React from 'react';
import type { SecurityIncident } from '../../../types';
import { getLeadingFinding } from '../simple-soc-dashboard.utils';
import { SummaryCard } from './SummaryCard';

const FALLBACK_VICTIM_IP = '10.140.2.88';
const FALLBACK_BLAST_RADIUS_SCORE = 94;

interface IncidentQuestionCardsProps {
  isAttacking: boolean;
  criticalIncident: SecurityIncident | undefined;
}

export const IncidentQuestionCards: React.FC<IncidentQuestionCardsProps> = ({ isAttacking, criticalIncident }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    <SummaryCard
      label="What is wrong?"
      valueClassName="text-sm font-semibold text-rose-400"
      value={
        isAttacking
          ? (criticalIncident && getLeadingFinding(criticalIncident.title)) || 'Security Incident Detected'
          : 'No Threat Observed'
      }
      description={
        criticalIncident?.plainEnglishSummary || 'All network traffic conforms to expected baseline behaviors.'
      }
    />

    <SummaryCard
      label="What is affected?"
      valueClassName="text-sm font-semibold text-[var(--zf-text-primary)] font-mono"
      value={criticalIncident?.primaryVictim.hostname || 'None'}
      description={
        <>
          Target at {criticalIncident?.primaryVictim.ip || FALLBACK_VICTIM_IP}. Blast radius score:{' '}
          {criticalIncident?.confidenceScore || FALLBACK_BLAST_RADIUS_SCORE}%.
        </>
      }
    />

    <SummaryCard
      label="How serious is it?"
      valueClassName={`text-sm font-semibold ${isAttacking ? 'text-rose-400' : 'text-emerald-400'}`}
      value={criticalIncident?.severity ? `${criticalIncident.severity} Severity` : 'Nominal Operational State'}
      description={
        isAttacking
          ? 'Immediate host isolation or perimeter blocking is recommended.'
          : 'Zero active critical or high-severity security incidents.'
      }
    />
  </div>
);
