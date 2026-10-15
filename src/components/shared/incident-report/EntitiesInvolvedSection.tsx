import type { FC } from 'react';
import type { SecurityIncident } from '../../../types';
import { getThreatActorDetails } from './incident-report.utils';
import { ReportSection } from './ReportSection';

export const EntitiesInvolvedSection: FC<{ incident: SecurityIncident }> = ({ incident }) => {
  const threatActor = getThreatActorDetails(incident);

  return (
    <ReportSection title="3. Entities Involved & Corroboration">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-1">
          <span className="text-[10px] text-[var(--zf-text-muted)] uppercase block">Primary Victim Host</span>
          <div className="font-mono text-xs font-semibold text-[var(--zf-text-primary)]">
            {incident.primaryVictim.hostname} ({incident.primaryVictim.ip})
          </div>
          <div className="text-[11px] text-[var(--zf-text-muted)]">
            Criticality: {incident.primaryVictim.criticality} · Crown Jewel Blast-Radius Enforced
          </div>
        </div>

        <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-1">
          <span className="text-[10px] text-[var(--zf-text-muted)] uppercase block">
            Attributed External Infrastructure
          </span>
          <div className="font-mono text-xs font-semibold text-rose-400">{threatActor.ip}</div>
          <div className="text-[11px] text-[var(--zf-text-muted)]">
            ASN: {threatActor.asn} ({threatActor.country})
          </div>
        </div>
      </div>
    </ReportSection>
  );
};
