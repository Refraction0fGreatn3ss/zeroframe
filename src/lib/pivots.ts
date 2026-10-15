import type { EntityContextType } from '../types/context-drawer';

const encode = encodeURIComponent;

const PIVOT_PATHS: Record<EntityContextType, (id: string) => string> = {
  ASSET: (id) => `/investigate/assets/${encode(id)}`,
  IP: (id) => `/search?type=IP&q=${encode(id)}`,
  MAC: (id) => `/search?type=MAC&q=${encode(id)}`,
  USER: (id) => `/search?type=USER&q=${encode(id)}`,
  FLOW: (id) => `/investigate/network/${encode(id)}`,
  DOMAIN: (id) => `/investigate/threat-intel?type=DOMAIN&q=${encode(id)}`,
  INDICATOR: (id) => `/investigate/threat-intel/${encode(id)}`,
  CVE: (id) => `/investigate/vulnerabilities?cve=${encode(id)}`,
  SENSOR: (id) => `/system/fleet/${encode(id)}`,
  SITE: (id) => `/system/topology?site=${encode(id)}`,
  VLAN: (id) => `/system/topology?vlan=${encode(id)}`,
  DETECTOR: (id) => `/assurance/detectors/${encode(id)}`,
  INCIDENT: (id) => `/investigate/incidents/${encode(id)}`,
  ALERT: (id) => `/investigate/alerts/${encode(id)}`,
  EVIDENCE: (id) => `/evidence?item=${encode(id)}`,
  RESPONSE_TRANSACTION: (id) => `/respond/rollback?transaction=${encode(id)}`,
};

export function pivotPath(type: EntityContextType, id: string): string {
  return PIVOT_PATHS[type](id);
}

export function timeMachinePath(entityId: string, at?: string): string {
  return `/investigate/time-machine?entity=${encode(entityId)}${at ? `&at=${encode(at)}` : ''}`;
}

export function entityGraphPath(entityId: string): string {
  return `/investigate/entity-graph?focus=${encode(entityId)}`;
}

export function huntPath(query: string): string {
  return `/investigate/hunt?q=${encode(query)}`;
}
