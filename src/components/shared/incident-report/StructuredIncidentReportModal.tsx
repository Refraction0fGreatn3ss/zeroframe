import type { FC } from 'react';
import type { SecurityIncident } from '../../../types';
import { EntitiesInvolvedSection } from './EntitiesInvolvedSection';
import { EvidenceHashesSection } from './EvidenceHashesSection';
import { ExecutiveSummarySection } from './ExecutiveSummarySection';
import { IncidentReportHeader } from './IncidentReportHeader';
import { KillChainTimelineSection } from './KillChainTimelineSection';
import { OutcomeSection } from './OutcomeSection';

export interface StructuredIncidentReportModalProps {
  incident: SecurityIncident;
  onClose: () => void;
}

const printReport = () => {
  window.print();
};

export const StructuredIncidentReportModal: FC<StructuredIncidentReportModalProps> = ({ incident, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans select-none animate-in fade-in duration-150">
    <div className="bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[var(--zf-text-primary)]">
      <IncidentReportHeader incidentId={incident.id} onPrint={printReport} onClose={onClose} />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[var(--zf-text-secondary)]">
        <ExecutiveSummarySection incident={incident} />
        <KillChainTimelineSection incident={incident} />
        <EntitiesInvolvedSection incident={incident} />
        <EvidenceHashesSection />
        <OutcomeSection />
      </div>

      <div className="p-4 border-t border-[var(--zf-border-subtle)] bg-[var(--zf-surface-topbar)] flex items-center justify-between text-xs">
        <span className="text-[11px] text-[var(--zf-text-muted)] font-mono">
          ZeroFrame Enterprise Automated Case Export
        </span>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-primary)] font-medium cursor-pointer"
        >
          Close Report
        </button>
      </div>
    </div>
  </div>
);
