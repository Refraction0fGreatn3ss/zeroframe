import type { DiscoveredProtocol, EntityType } from '../../types';

export const IOT_OT_ENTITY_TYPES: readonly EntityType[] = [
  'CAMERA',
  'PRINTER',
  'VOIP',
  'ACCESS_CONTROL',
  'DISPLAY',
  'OT_PLC',
];

export const INDUSTRIAL_PROTOCOLS: readonly DiscoveredProtocol[] = ['Modbus/TCP', 'BACnet/IP'];
export const VIDEO_PROTOCOLS: readonly DiscoveredProtocol[] = ['ONVIF', 'RTSP'];

export const DEFAULT_IDENTITY_CONFIDENCE = 95;
export const CRITICAL_BLAST_RADIUS_THRESHOLD = 80;
export const ELEVATED_BLAST_RADIUS_THRESHOLD = 70;

export const DEFAULT_OS_LABEL = 'Linux Embedded RT';
export const DEFAULT_OWNER_LABEL = 'Corporate IT Services';
export const DEFAULT_FALLBACK_VLAN = 104;

export const FALLBACK_HISTORY_COMMIT_LAG_MS = {
  IP: 1200,
  SITE_VLAN: 2500,
  PROTECTED_STATE: 3000,
} as const;

export const INCIDENTS_PATH = '/investigate/incidents';
