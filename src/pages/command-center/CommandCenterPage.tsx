import type React from 'react';
import { useState } from 'react';
import { SinceLastLoginSummary } from '../../components/shared/SinceLastLoginSummary';
import { TruthBar } from '../../components/shared/truth-bar/TruthBar';
import { useAppStore } from '../../stores/app-store';
import { useDashboardStore } from '../../stores/dashboard-store';
import { useInvestigationStore } from '../../stores/investigation-store';
import { DEFAULT_TIME_RANGE, ROUTES } from './command-center.data';
import type { TimeRange } from './command-center.types';
import { countIncidentsWhere } from './command-center.utils';
import { CommandCenterHeader } from './components/CommandCenterHeader';
import { KillChainFunnel } from './components/KillChainFunnel';
import { LiveAnomaliesPanel } from './components/LiveAnomaliesPanel';
import { PriorityThreatQueue } from './components/PriorityThreatQueue';
import { ProtocolDistributionCard } from './components/ProtocolDistributionCard';
import { SecurityActivitySection } from './components/SecurityActivitySection';
import { ThreatVectorsCard } from './components/ThreatVectorsCard';
import { ThroughputVelocityPanel } from './components/ThroughputVelocityPanel';
import { WireIngressCard } from './components/WireIngressCard';
import { useIncidentNavigation } from './hooks/use-incident-navigation';
import { useKillChainFilter } from './hooks/use-kill-chain-filter';

export const CommandCenterPage: React.FC = () => {
  const { metrics } = useDashboardStore();
  const { incidents } = useInvestigationStore();
  const { setCurrentPath, realtimeConnected, lastHeartbeatTimestamp } = useAppStore();

  const [timeRange, setTimeRange] = useState<TimeRange>(DEFAULT_TIME_RANGE);
  const { selectedStage, toggleStage, clearStage, filteredIncidents } = useKillChainFilter(incidents);
  const { openIncident, openIncidentPcap, openIncidentQuarantine } = useIncidentNavigation();

  const openHunter = () => setCurrentPath(ROUTES.hunt);

  return (
    <div className="p-4 sm:p-5 space-y-4 text-slate-200 max-w-[1720px] mx-auto font-sans select-none">
      <TruthBar className="mb-4" />

      <SinceLastLoginSummary className="mb-4" />

      <CommandCenterHeader
        incidents={incidents}
        realtimeConnected={realtimeConnected}
        lastHeartbeatTimestamp={lastHeartbeatTimestamp}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onOpenHunter={openHunter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <WireIngressCard
          throughputBps={metrics.currentIngressThroughputBps}
          packetRatePps={metrics.currentPacketRatePps}
        />
        <ProtocolDistributionCard />
        <ThreatVectorsCard
          uncontainedCount={countIncidentsWhere(incidents, (i) => i.state === 'OPEN')}
          criticalCount={countIncidentsWhere(incidents, (i) => i.severity === 'CRITICAL')}
          highCount={countIncidentsWhere(incidents, (i) => i.severity === 'HIGH')}
        />
      </div>

      <ThroughputVelocityPanel onExploreInHunter={openHunter} />

      <KillChainFunnel selectedStage={selectedStage} onToggleStage={toggleStage} onClearStage={clearStage} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <PriorityThreatQueue
          incidents={filteredIncidents}
          onOpenWorkbench={() => setCurrentPath(ROUTES.incidents)}
          onOpenIncident={openIncident}
          onExtractPcap={openIncidentPcap}
          onIsolateHost={openIncidentQuarantine}
        />
        <LiveAnomaliesPanel onOpenHunter={openHunter} />
      </div>

      <SecurityActivitySection onOpenActivityLog={() => setCurrentPath(ROUTES.activityLog)} />
    </div>
  );
};
