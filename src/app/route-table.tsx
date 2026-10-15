import { type ComponentType, type LazyExoticComponent, lazy } from 'react';

type PageModule = Record<string, ComponentType>;

function lazyPage(load: () => Promise<PageModule>, exportName: string): LazyExoticComponent<ComponentType> {
  return lazy(async () => ({ default: (await load())[exportName] }));
}

export const PAGE_COMPONENTS: Record<string, LazyExoticComponent<ComponentType>> = {
  'command-center': lazyPage(() => import('./OverviewRoute'), 'OverviewRoute'),
  'activity-log': lazyPage(
    () => import('../pages/security-activity-log/SecurityActivityLogPage'),
    'SecurityActivityLogPage',
  ),
  search: lazyPage(() => import('../pages/search/GlobalSearchPage'), 'GlobalSearchPage'),
  reports: lazyPage(() => import('../pages/reports/ReportsPage'), 'ReportsPage'),
  incidents: lazyPage(() => import('../pages/incidents/IncidentsPage'), 'IncidentsPage'),
  alerts: lazyPage(() => import('../pages/alerts/AlertsPage'), 'AlertsPage'),
  assets: lazyPage(() => import('../pages/assets/AssetsPage'), 'AssetsPage'),
  'entity-graph': lazyPage(() => import('../pages/entity-graph/EntityGraphPage'), 'EntityGraphPage'),
  network: lazyPage(() => import('../pages/network-explorer/NetworkExplorerPage'), 'NetworkExplorerPage'),
  hunt: lazyPage(() => import('../pages/hunt/HuntPage'), 'HuntPage'),
  'threat-intel': lazyPage(() => import('../pages/threat-intel/ThreatIntelPage'), 'ThreatIntelPage'),
  vulnerabilities: lazyPage(
    () => import('../pages/vulnerability-exposure/VulnerabilityExposurePage'),
    'VulnerabilityExposurePage',
  ),
  baselines: lazyPage(() => import('../pages/network-memory/NetworkMemoryPage'), 'NetworkMemoryPage'),
  'scada-ot': lazyPage(() => import('../pages/scada-ot/ScadaOtPage'), 'ScadaOtPage'),
  'time-machine': lazyPage(
    () => import('../pages/security-time-machine/SecurityTimeMachinePage'),
    'SecurityTimeMachinePage',
  ),
  'detection-assurance': lazyPage(
    () => import('../pages/detection-assurance/DetectionAssurancePage'),
    'DetectionAssurancePage',
  ),
  detectors: lazyPage(() => import('../pages/detector-catalog/DetectorCatalogPage'), 'DetectorCatalogPage'),
  'blind-spots': lazyPage(() => import('../pages/blind-spots/BlindSpotsPage'), 'BlindSpotsPage'),
  tuning: lazyPage(() => import('../pages/detector-tuning/DetectorTuningPage'), 'DetectorTuningPage'),
  'response-studio': lazyPage(
    () => import('../pages/governed-response-studio/GovernedResponseStudioPage'),
    'GovernedResponseStudioPage',
  ),
  'response-authority': lazyPage(
    () => import('../pages/response-authority/ResponseAuthorityPage'),
    'ResponseAuthorityPage',
  ),
  'protected-assets': lazyPage(() => import('../pages/protected-assets/ProtectedAssetsPage'), 'ProtectedAssetsPage'),
  permits: lazyPage(() => import('../pages/execution-permits/ExecutionPermitsPage'), 'ExecutionPermitsPage'),
  quarantine: lazyPage(() => import('../pages/quarantine/QuarantinePage'), 'QuarantinePage'),
  rollback: lazyPage(() => import('../pages/rollback/RollbackPage'), 'RollbackPage'),
  'evidence-center': lazyPage(() => import('../pages/evidence-center/EvidenceCenterPage'), 'EvidenceCenterPage'),
  ledger: lazyPage(() => import('../pages/evidence-ledger/EvidenceLedgerPage'), 'EvidenceLedgerPage'),
  pcap: lazyPage(() => import('../pages/targeted-pcap/TargetedPcapPage'), 'TargetedPcapPage'),
  vault: lazyPage(() => import('../pages/vault/VaultPage'), 'VaultPage'),
  witness: lazyPage(() => import('../pages/witness-plane/WitnessPlanePage'), 'WitnessPlanePage'),
  exports: lazyPage(() => import('../pages/export-jobs/ExportJobsPage'), 'ExportJobsPage'),
  fleet: lazyPage(() => import('../pages/fleet/FleetPage'), 'FleetPage'),
  deployment: lazyPage(() => import('../pages/deployment/DeploymentPreflightPage'), 'DeploymentPreflightPage'),
  topology: lazyPage(() => import('../pages/topology/TopologyVisibilityPage'), 'TopologyVisibilityPage'),
  inspection: lazyPage(
    () => import('../pages/inspection-integrity/InspectionIntegrityPage'),
    'InspectionIntegrityPage',
  ),
  diagnostics: lazyPage(() => import('../pages/diagnostics/DiagnosticsPage'), 'DiagnosticsPage'),
  integrations: lazyPage(() => import('../pages/integrations/IntegrationsPage'), 'IntegrationsPage'),
  compliance: lazyPage(() => import('../pages/compliance/CompliancePage'), 'CompliancePage'),
  licensing: lazyPage(() => import('../pages/licensing/LicensingPage'), 'LicensingPage'),
  support: lazyPage(() => import('../pages/support/SupportBundlePage'), 'SupportBundlePage'),
  admin: lazyPage(() => import('../pages/admin/AdminPage'), 'AdminPage'),
  tenants: lazyPage(() => import('../pages/tenant-admin/TenantAdminPage'), 'TenantAdminPage'),
};

/** Detail routes reuse their list page; the page reads the parameter to select the record. */
export const DETAIL_ROUTE_SUFFIXES: Record<string, string> = {
  incidents: ':incidentId',
  alerts: ':alertId',
  assets: ':assetId',
  network: ':flowId',
  'threat-intel': ':indicatorId',
  vulnerabilities: ':assetId',
  fleet: ':sensorId',
  detectors: ':detectorId',
};
