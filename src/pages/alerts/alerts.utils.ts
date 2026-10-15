import type { ContextItem } from '../../stores/context-drawer-store';
import type { SecurityAlert } from '../../types';
import type { ActionFilter } from './alerts.types';

export const matchesActionFilter = (alert: SecurityAlert, filter: ActionFilter): boolean => {
  if (filter === 'NEEDS_ACTION') return alert.severity === 'CRITICAL';
  if (filter === 'INVESTIGATION') return alert.severity === 'HIGH';
  if (filter === 'MONITORING') return alert.severity === 'MEDIUM' || alert.severity === 'LOW';
  return true;
};

export const filterAlertsByAction = (alerts: SecurityAlert[], filter: ActionFilter): SecurityAlert[] =>
  alerts.filter((a) => matchesActionFilter(a, filter));

export const evidenceFileName = (evidenceRef: string): string | undefined => evidenceRef.split('/').pop();

export const detectorContext = (alert: SecurityAlert): ContextItem => ({
  type: 'DETECTOR',
  id: alert.detectorName,
  title: alert.detectorName,
  subtitle: `Version: ${alert.detectorVersion}`,
});

export const sourceIpContext = (alert: SecurityAlert): ContextItem => ({
  type: 'IP',
  id: alert.sourceIp,
  title: alert.sourceIp,
  subtitle: `Alert source port: ${alert.sourcePort}`,
});

export const destinationIpContext = (alert: SecurityAlert): ContextItem => ({
  type: 'IP',
  id: alert.destinationIp,
  title: alert.destinationIp,
  subtitle: `Alert destination port: ${alert.destinationPort}`,
});

export const evidenceContext = (alert: SecurityAlert): ContextItem => ({
  type: 'EVIDENCE',
  id: alert.evidenceRef,
  title: 'Wire Evidence Frame',
  subtitle: alert.evidenceRef,
});

export const sourceHostContext = (alert: SecurityAlert): ContextItem => ({
  type: 'IP',
  id: alert.sourceIp,
  title: alert.sourceIp,
  subtitle: 'Source host of alert',
});
