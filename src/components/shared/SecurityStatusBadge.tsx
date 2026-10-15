import type { FC } from 'react';
import type { SecurityState } from '../../types';

type StatusTone = 'healthy' | 'info' | 'warning' | 'critical' | 'unknown';

interface StatusStyle {
  textColor: string;
  dot: string;
  label: string;
}

const TONE_COLORS: Record<StatusTone, Omit<StatusStyle, 'label'>> = {
  healthy: { textColor: 'text-emerald-400', dot: 'bg-emerald-500' },
  info: { textColor: 'text-cyan-400', dot: 'bg-cyan-400' },
  warning: { textColor: 'text-amber-400', dot: 'bg-amber-400' },
  critical: { textColor: 'text-rose-400', dot: 'bg-rose-500' },
  unknown: { textColor: 'text-slate-500', dot: 'bg-slate-500' },
};

const STATUS_LABELS_BY_TONE: Record<StatusTone, Record<string, string>> = {
  healthy: {
    HEALTHY: 'Healthy',
    AVAILABLE: 'Available',
    VERIFIED: 'Verified',
    CURRENT: 'Current',
    CONNECTED: 'Healthy',
    FINAL: 'Final',
    VALIDATED: 'Validated',
    SEALED: 'Sealed',
    ACTIVE_SEALED: 'Active Sealed',
    QUORUM_HEALTHY: 'Quorum Healthy',
    ACTIVE_LICENSED: 'Licensed',
    ACTIVE: 'Active',
    ACTIVE_ENFORCED: 'Enforced',
    GOVERNED: 'Governed',
    AUTHORIZED: 'Authorized',
    APPLIED: 'Applied',
    OBSERVING_FULL: 'Observing Full',
    TRUSTED_MTLS: 'mTLS Trusted',
    ONLINE: 'Online',
    COMPLIANT: 'Compliant',
    READY: 'Ready',
    FRESH: 'Fresh',
    SUCCESS: 'Success',
    VERIFIED_REVERTED: 'Reverted',
  },
  info: {
    LOW: 'Low',
    INFO: 'Info',
    APPLYING: 'Applying...',
    EXECUTING: 'Executing...',
    CONFIGURED: 'Configured',
    HISTORICAL_SNAPSHOT: 'Snapshot',
    ROLLED_BACK: 'Rolled Back',
  },
  warning: {
    DEGRADED: 'Degraded',
    PARTIAL: 'Partial',
    ELEVATED: 'Degraded',
    HIGH: 'High',
    CERT_EXPIRING_SOON: 'Expiring soon',
    STALE: 'Stale',
    NOT_VERIFIED: 'Degraded',
    VERIFICATION_PENDING: 'Pending verification',
    TENTATIVE: 'Tentative',
    MEDIUM: 'Medium',
    PENDING_APPROVER_2: 'Pending Approver 2',
    PENDING_APPROVER_1: 'Pending Approver 1',
    PENDING_QUORUM: 'Pending Quorum',
    RESPONSE_DISABLED: 'Response Disabled',
  },
  critical: {
    FAILED: 'Failed',
    UNAVAILABLE: 'Unavailable',
    CRITICAL: 'Critical',
    DISCONNECTED: 'Disconnected',
    INVALID: 'Failed',
    SATURATED: 'Failed',
    UNTRUSTED_REVOKED: 'Untrusted',
    PURGED_REVOKED: 'Purged & Revoked',
    TERMINATED: 'Terminated',
  },
  unknown: {
    NOT_APPLICABLE: 'N/A',
  },
};

const STATUS_STYLES: Record<string, StatusStyle | undefined> = Object.fromEntries(
  (Object.entries(STATUS_LABELS_BY_TONE) as [StatusTone, Record<string, string>][]).flatMap(([tone, labels]) =>
    Object.entries(labels).map(([state, label]) => [state, { ...TONE_COLORS[tone], label }]),
  ),
);

const UNKNOWN_STATUS_STYLE: StatusStyle = { ...TONE_COLORS.unknown, label: 'Unknown' };

const getSecurityStatusStyle = (state: string): StatusStyle =>
  STATUS_STYLES[(state || 'UNKNOWN').toUpperCase()] ?? UNKNOWN_STATUS_STYLE;

interface SecurityStatusBadgeProps {
  state: SecurityState | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const SecurityStatusBadge: FC<SecurityStatusBadgeProps> = ({ state, showDot = true }) => {
  const style = getSecurityStatusStyle(state);

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold select-none ${style.textColor}`}
      title={`Authoritative security state: ${style.label}`}
    >
      {showDot && <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />}
      <span>{style.label}</span>
    </span>
  );
};
