import type React from 'react';
import { SinceLastLoginSummary } from '../../components/shared/SinceLastLoginSummary';
import { SecurityEventTrendLineChart, ThreatDistributionDonutChart } from '../../components/shared/security-charts';
import { TruthBar } from '../../components/shared/truth-bar/TruthBar';
import { useAppStore } from '../../stores/app-store';
import { useDashboardStore } from '../../stores/dashboard-store';
import { useInvestigationStore } from '../../stores/investigation-store';
import { IncidentQuestionCards } from './components/IncidentQuestionCards';
import { OperationalStatusCard } from './components/OperationalStatusCard';
import { ProtectionPostureCards } from './components/ProtectionPostureCards';
import { SocDashboardHeader } from './components/SocDashboardHeader';
import { getOperationalStatus } from './simple-soc-dashboard.utils';

const INCIDENTS_PATH = '/investigate/incidents';

export const SimpleSOCDashboard: React.FC = () => {
  const { metrics } = useDashboardStore();
  const { incidents } = useInvestigationStore();
  const { killSwitchEngaged, setCurrentPath, realtimeConnected, lastHeartbeatTimestamp } = useAppStore();

  const isAttacking = incidents.length > 0;
  const criticalIncident = incidents.find((incident) => incident.severity === 'CRITICAL');

  return (
    <div className="p-6 space-y-6 text-[var(--zf-text-primary)] max-w-5xl mx-auto font-sans">
      <TruthBar className="mb-2" />

      <SinceLastLoginSummary className="mb-2" />

      <SocDashboardHeader
        realtimeConnected={realtimeConnected}
        onViewIncidents={() => setCurrentPath(INCIDENTS_PATH)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        <div className="flex flex-col">
          <SecurityEventTrendLineChart />
        </div>
        <div className="flex flex-col">
          <ThreatDistributionDonutChart />
        </div>
      </div>

      <OperationalStatusCard
        status={getOperationalStatus(realtimeConnected, isAttacking)}
        incidentCount={incidents.length}
        lastHeartbeatTimestamp={lastHeartbeatTimestamp}
      />

      <IncidentQuestionCards isAttacking={isAttacking} criticalIncident={criticalIncident} />

      <ProtectionPostureCards
        captureState={metrics.captureState}
        observationCoveragePct={metrics.observationCoveragePct}
        killSwitchEngaged={killSwitchEngaged}
      />
    </div>
  );
};
