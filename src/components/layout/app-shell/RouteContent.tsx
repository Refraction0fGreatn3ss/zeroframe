import type React from 'react';
import { AdminPage } from '../../../pages/admin/AdminPage';
import { AlertsPage } from '../../../pages/alerts/AlertsPage';
import { AssetsPage } from '../../../pages/assets/AssetsPage';
import { CommandCenterPage } from '../../../pages/command-center/CommandCenterPage';
import { CompliancePage } from '../../../pages/compliance/CompliancePage';
import { DetectionAssurancePage } from '../../../pages/detection-assurance/DetectionAssurancePage';
import { EntityGraphPage } from '../../../pages/entity-graph/EntityGraphPage';
import { EvidenceCenterPage } from '../../../pages/evidence-center/EvidenceCenterPage';
import { EvidenceLedgerPage } from '../../../pages/evidence-ledger/EvidenceLedgerPage';
import { ExecutionPermitsPage } from '../../../pages/execution-permits/ExecutionPermitsPage';
import { FleetPage } from '../../../pages/fleet/FleetPage';
import { GovernedResponseStudioPage } from '../../../pages/governed-response-studio/GovernedResponseStudioPage';
import { HuntPage } from '../../../pages/hunt/HuntPage';
import { IncidentsPage } from '../../../pages/incidents/IncidentsPage';
import { InspectionIntegrityPage } from '../../../pages/inspection-integrity/InspectionIntegrityPage';
import { IntegrationsPage } from '../../../pages/integrations/IntegrationsPage';
import { LicensingPage } from '../../../pages/licensing/LicensingPage';
import { QuarantinePage } from '../../../pages/quarantine/QuarantinePage';
import { RollbackPage } from '../../../pages/rollback/RollbackPage';
import { ScadaOtPage } from '../../../pages/scada-ot/ScadaOtPage';
import { SecurityActivityLogPage } from '../../../pages/security-activity-log/SecurityActivityLogPage';
import { SecurityTimeMachinePage } from '../../../pages/security-time-machine/SecurityTimeMachinePage';
import { SimpleSOCDashboard } from '../../../pages/simple-soc-dashboard/SimpleSOCDashboard';
import { TargetedPcapPage } from '../../../pages/targeted-pcap/TargetedPcapPage';
import { VaultPage } from '../../../pages/vault/VaultPage';
import { WitnessPlanePage } from '../../../pages/witness-plane/WitnessPlanePage';
import type { ViewMode } from '../../../stores/app-store';

const ROUTE_PAGES: Record<string, React.ComponentType> = {
  '/overview/activity-log': SecurityActivityLogPage,
  '/investigate/incidents': IncidentsPage,
  '/investigate/alerts': AlertsPage,
  '/investigate/assets': AssetsPage,
  '/investigate/entity-graph': EntityGraphPage,
  '/investigate/hunt': HuntPage,
  '/investigate/scada-ot': ScadaOtPage,
  '/investigate/time-machine': SecurityTimeMachinePage,
  '/respond/studio': GovernedResponseStudioPage,
  '/respond/quarantine': QuarantinePage,
  '/respond/permits': ExecutionPermitsPage,
  '/respond/rollback': RollbackPage,
  '/evidence/center': EvidenceCenterPage,
  '/evidence/ledger': EvidenceLedgerPage,
  '/evidence/pcap': TargetedPcapPage,
  '/evidence/vault': VaultPage,
  '/evidence/witness': WitnessPlanePage,
  '/system/fleet': FleetPage,
  '/system/inspection': InspectionIntegrityPage,
  '/system/assurance': DetectionAssurancePage,
  '/system/integrations': IntegrationsPage,
  '/system/compliance': CompliancePage,
  '/system/licensing': LicensingPage,
  '/system/audit': AdminPage,
};

interface RouteContentProps {
  currentPath: string;
  viewMode: ViewMode;
}

/** '/overview', '/' and any unknown path fall back to the view-mode dashboard. */
export const RouteContent: React.FC<RouteContentProps> = ({ currentPath, viewMode }) => {
  const Page = Object.hasOwn(ROUTE_PAGES, currentPath) ? ROUTE_PAGES[currentPath] : null;
  if (Page) return <Page />;
  return viewMode === 'SIMPLE_SOC' ? <SimpleSOCDashboard /> : <CommandCenterPage />;
};
