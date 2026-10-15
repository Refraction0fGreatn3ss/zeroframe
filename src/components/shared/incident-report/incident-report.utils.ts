import type { SecurityIncident } from '../../../types';

const LATERAL_MOVEMENT_OFFSET_MS = 1000 * 60 * 12;

export const DEFAULT_THREAT_ACTOR = {
  ip: '185.220.101.44',
  ja4Fingerprint: 't13d1516h2_...',
  asn: 'AS208291',
  country: 'NL',
} as const;

export const formatTimeOfDay = (timestamp: string | number): string => new Date(timestamp).toLocaleTimeString();

export const getLateralMovementTimestamp = (incident: SecurityIncident): number =>
  Date.parse(incident.firstSeen) + LATERAL_MOVEMENT_OFFSET_MS;

export const getThreatActorDetails = (incident: SecurityIncident) => ({
  ip: incident.threatActor?.ip || DEFAULT_THREAT_ACTOR.ip,
  ja4Fingerprint: incident.threatActor?.ja4Fingerprint || DEFAULT_THREAT_ACTOR.ja4Fingerprint,
  asn: incident.threatActor?.asn || DEFAULT_THREAT_ACTOR.asn,
  country: incident.threatActor?.country || DEFAULT_THREAT_ACTOR.country,
});
