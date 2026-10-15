import type { FC, ReactNode } from 'react';
import type { SecurityIncident } from '../../../types';
import { formatTimeOfDay, getLateralMovementTimestamp, getThreatActorDetails } from './incident-report.utils';
import { ReportSection } from './ReportSection';

interface TimelineEntryProps {
  time: string;
  title: string;
  children: ReactNode;
}

const TimelineEntry: FC<TimelineEntryProps> = ({ time, title, children }) => (
  <div className="p-3 flex items-start gap-3">
    <span className="font-mono text-[10px] text-[var(--zf-text-muted)] shrink-0 mt-0.5">{time}</span>
    <div>
      <span className="font-semibold text-[var(--zf-text-primary)] block">{title}</span>
      <p className="text-[11px] text-[var(--zf-text-muted)] mt-0.5">{children}</p>
    </div>
  </div>
);

export const KillChainTimelineSection: FC<{ incident: SecurityIncident }> = ({ incident }) => {
  const threatActor = getThreatActorDetails(incident);

  return (
    <ReportSection title="2. Verified Kill-Chain Timeline">
      <div className="border border-[var(--zf-border-subtle)] rounded bg-[var(--zf-surface-card)] divide-y divide-[var(--zf-border-subtle)]">
        <TimelineEntry time={formatTimeOfDay(incident.firstSeen)} title="Initial Ingress & Attacker Beaconing">
          Attacker IP {threatActor.ip} established encrypted tunnel using JA4 fingerprint {threatActor.ja4Fingerprint}
        </TimelineEntry>

        <TimelineEntry
          time={formatTimeOfDay(getLateralMovementTimestamp(incident))}
          title="Lateral Movement & Privilege Escalation"
        >
          PsExec service installation via SMB pipe \pipe\svcctl against internal target{' '}
          {incident.primaryVictim.hostname}.
        </TimelineEntry>

        <TimelineEntry time={formatTimeOfDay(incident.lastSeen)} title="Automated Canary Trigger & Containment Arming">
          ZeroFrame file entropy sensor detected rapid file mutation attempt; quarantine permit issued.
        </TimelineEntry>
      </div>
    </ReportSection>
  );
};
