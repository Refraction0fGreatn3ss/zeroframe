import type { TenantSeed } from '../../../types/tenant.ts';
import { alerts } from './alerts.ts';
import { entities } from './entities.ts';
import { evidenceLedger, pcapCaptures, witnessNodes } from './evidence.ts';
import { incidents } from './incidents.ts';
import { chartData, metrics } from './metrics.ts';
import { permits, quarantine, rollbacks } from './response.ts';
import {
  auditLogs,
  complianceFrameworks,
  detectionCapabilities,
  fleetSensors,
  inspectionPipeline,
  integrations,
} from './system.ts';

export const enterpriseHqSeed: TenantSeed = {
  metrics,
  chartData,
  incidents,
  alerts,
  entities,
  permits,
  quarantine,
  rollbacks,
  evidenceLedger,
  pcapCaptures,
  witnessNodes,
  fleetSensors,
  inspectionPipeline,
  detectionCapabilities,
  complianceFrameworks,
  integrations,
  auditLogs,
};
