/**
 * Enterprise Admin, Integrations, Licensing & Compliance Types
 */

import { SecurityState } from './index';

export interface EnterpriseIntegration {
  id: string;
  category: 'ENDPOINT_XDR' | 'IDENTITY' | 'INFRASTRUCTURE' | 'SIEM_SOAR' | 'CLOUD' | 'TICKETING';
  name: string;
  vendor: 'Microsoft Defender XDR' | 'CrowdStrike Falcon' | 'Palo Alto Cortex XDR' | 'Splunk' | 'ServiceNow' | 'AWS Security Hub';
  status: 'NOT_CONFIGURED' | 'CONFIGURED' | 'AUTHENTICATED' | 'HEALTHY' | 'DEGRADED' | 'FAILED' | 'DISABLED';
  lastSyncTimestamp: string;
  entitiesCorroborated: number;
  apiCallLatencyMs: number;
  healthMessage: string;
}

export interface EnterpriseLicense {
  licenseId: string;
  organization: string;
  tier: 'ENTERPRISE_TIER_1' | 'GOVERNMENT_DEFENSE' | 'TRIAL';
  issuedAt: string;
  expiresAt: string;
  maxThroughputGbps: number;
  maxSensors: number;
  currentSensorsEnrolled: number;
  featuresEnabled: string[];
  signatureValid: boolean;
  tamperSealVerified: boolean;
  publicSigningKeyId: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  targetResource: string;
  ipAddress: string;
  status: 'SUCCESS' | 'DENIED' | 'FAILED';
  details: string;
  signatureHash: string;
  tenantId: string;
}
