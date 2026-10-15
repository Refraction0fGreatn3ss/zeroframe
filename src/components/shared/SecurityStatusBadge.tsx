/**
 * Authoritative Security Status Indicator
 * 
 * Complies with Frontend Design Constitution (Zero-Pill Discipline):
 * - Renders clean unboxed text with a crisp geometric status dot
 * - Strict semantic coloring (Emerald: Nominal, Amber: Heuristics, Rose: Exploit/Critical)
 * - Monospace tabular figures and clean typography
 */

import React from 'react';
import { SecurityState } from '../../types';

interface SecurityStatusBadgeProps {
  state: SecurityState | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const SecurityStatusBadge: React.FC<SecurityStatusBadgeProps> = ({
  state,
  size = 'md',
  showDot = true,
}) => {
  const raw = (state || 'UNKNOWN').toUpperCase();

  const getStyle = () => {
    switch (raw) {
      // Active / Nominal / Verified States (Emerald)
      case 'HEALTHY':
      case 'AVAILABLE':
      case 'VERIFIED':
      case 'CURRENT':
      case 'CONNECTED':
      case 'FINAL':
      case 'VALIDATED':
      case 'SEALED':
      case 'ACTIVE_SEALED':
      case 'QUORUM_HEALTHY':
      case 'ACTIVE_LICENSED':
      case 'ACTIVE':
      case 'ACTIVE_ENFORCED':
      case 'GOVERNED':
      case 'AUTHORIZED':
      case 'APPLIED':
      case 'OBSERVING_FULL':
      case 'TRUSTED_MTLS':
      case 'ONLINE':
      case 'COMPLIANT':
      case 'READY':
      case 'FRESH':
      case 'SUCCESS':
      case 'VERIFIED_REVERTED':
        return {
          textColor: 'text-emerald-400',
          dot: 'bg-emerald-500',
          label:
            raw === 'VERIFIED' ? 'Verified' :
            raw === 'FINAL' ? 'Final' :
            raw === 'VALIDATED' ? 'Validated' :
            raw === 'SEALED' ? 'Sealed' :
            raw === 'ACTIVE_SEALED' ? 'Active Sealed' :
            raw === 'QUORUM_HEALTHY' ? 'Quorum Healthy' :
            raw === 'ACTIVE_LICENSED' ? 'Licensed' :
            raw === 'ACTIVE' ? 'Active' :
            raw === 'ACTIVE_ENFORCED' ? 'Enforced' :
            raw === 'GOVERNED' ? 'Governed' :
            raw === 'AUTHORIZED' ? 'Authorized' :
            raw === 'APPLIED' ? 'Applied' :
            raw === 'OBSERVING_FULL' ? 'Observing Full' :
            raw === 'TRUSTED_MTLS' ? 'mTLS Trusted' :
            raw === 'ONLINE' ? 'Online' :
            raw === 'COMPLIANT' ? 'Compliant' :
            raw === 'READY' ? 'Ready' :
            raw === 'FRESH' ? 'Fresh' :
            raw === 'SUCCESS' ? 'Success' :
            raw === 'VERIFIED_REVERTED' ? 'Reverted' :
            raw === 'AVAILABLE' ? 'Available' :
            raw === 'CURRENT' ? 'Current' : 'Healthy',
        };

      // In Progress / Executing / Informational States (Cyan)
      case 'LOW':
      case 'INFO':
      case 'APPLYING':
      case 'EXECUTING':
      case 'CONFIGURED':
      case 'HISTORICAL_SNAPSHOT':
      case 'ROLLED_BACK':
        return {
          textColor: 'text-cyan-400',
          dot: 'bg-cyan-400',
          label:
            raw === 'APPLYING' ? 'Applying...' :
            raw === 'EXECUTING' ? 'Executing...' :
            raw === 'CONFIGURED' ? 'Configured' :
            raw === 'HISTORICAL_SNAPSHOT' ? 'Snapshot' :
            raw === 'ROLLED_BACK' ? 'Rolled Back' :
            raw === 'LOW' ? 'Low' : 'Info',
        };

      // Attention / Degraded / Pending States (Amber)
      case 'DEGRADED':
      case 'PARTIAL':
      case 'ELEVATED':
      case 'HIGH':
      case 'CERT_EXPIRING_SOON':
      case 'STALE':
      case 'NOT_VERIFIED':
      case 'VERIFICATION_PENDING':
      case 'TENTATIVE':
      case 'MEDIUM':
      case 'PENDING_APPROVER_2':
      case 'PENDING_APPROVER_1':
      case 'PENDING_QUORUM':
      case 'RESPONSE_DISABLED':
        return {
          textColor: 'text-amber-400',
          dot: 'bg-amber-400',
          label:
            raw === 'PENDING_APPROVER_2' ? 'Pending Approver 2' :
            raw === 'PENDING_APPROVER_1' ? 'Pending Approver 1' :
            raw === 'PENDING_QUORUM' ? 'Pending Quorum' :
            raw === 'RESPONSE_DISABLED' ? 'Response Disabled' :
            raw === 'HIGH' ? 'High' :
            raw === 'MEDIUM' ? 'Medium' :
            raw === 'PARTIAL' ? 'Partial' :
            raw === 'STALE' ? 'Stale' :
            raw === 'CERT_EXPIRING_SOON' ? 'Expiring soon' :
            raw === 'TENTATIVE' ? 'Tentative' :
            raw === 'VERIFICATION_PENDING' ? 'Pending verification' : 'Degraded',
        };

      case 'FAILED':
      case 'UNAVAILABLE':
      case 'CRITICAL':
      case 'DISCONNECTED':
      case 'INVALID':
      case 'SATURATED':
      case 'UNTRUSTED_REVOKED':
      case 'PURGED_REVOKED':
      case 'TERMINATED':
        return {
          textColor: 'text-rose-400',
          dot: 'bg-rose-500',
          label:
            raw === 'DISCONNECTED' ? 'Disconnected' :
            raw === 'CRITICAL' ? 'Critical' :
            raw === 'UNAVAILABLE' ? 'Unavailable' :
            raw === 'PURGED_REVOKED' ? 'Purged & Revoked' :
            raw === 'TERMINATED' ? 'Terminated' :
            raw === 'UNTRUSTED_REVOKED' ? 'Untrusted' : 'Failed',
        };

      case 'UNKNOWN':
      case 'NOT_APPLICABLE':
      default:
        return {
          textColor: 'text-slate-500',
          dot: 'bg-slate-500',
          label: raw === 'NOT_APPLICABLE' ? 'N/A' : 'Unknown',
        };
    }
  };

  const style = getStyle();

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
