import type { ComponentProps } from 'react';
import type { WitnessPermitCard } from '../../components/shared/WitnessComponents';
import type { ExecutionPermitRecord } from '../../services/response-service';

type WitnessPermitCardProps = ComponentProps<typeof WitnessPermitCard>;

export type PermitCardViewModel = Omit<WitnessPermitCardProps, 'onApprove' | 'isApproving'>;

const VALIDATED_BLAST_RADIUS_SCORE = 28;
const UNVALIDATED_BLAST_RADIUS_SCORE = 65;

const DEFAULT_ACTION_LABEL = 'Host Containment';
const DEFAULT_PRIMARY_APPROVER = 'Security Lead';
const DEFAULT_SECONDARY_APPROVER = 'Duty SecOps Lead';

const isAuthorized = (status: ExecutionPermitRecord['status']): boolean =>
  status === 'AUTHORIZED' || status === 'EXECUTED';

const toWitnessNotaryStatus = (
  status: ExecutionPermitRecord['status'],
): WitnessPermitCardProps['witnessNotaryStatus'] => {
  if (isAuthorized(status)) return 'VERIFIED';
  if (status === 'REJECTED') return 'REJECTED';
  return 'PENDING_QUORUM';
};

export const toPermitCardViewModel = (permit: ExecutionPermitRecord): PermitCardViewModel => ({
  permitId: permit.id,
  action: permit.actionType || DEFAULT_ACTION_LABEL,
  target: permit.targetResource,
  blastRadiusScore: permit.blastRadiusValidated ? VALIDATED_BLAST_RADIUS_SCORE : UNVALIDATED_BLAST_RADIUS_SCORE,
  approver1: {
    name: permit.approver1 || permit.requestedBy || DEFAULT_PRIMARY_APPROVER,
    status: 'APPROVED',
    timestamp: permit.requestedAt,
  },
  approver2: {
    name: permit.approver2 || DEFAULT_SECONDARY_APPROVER,
    status: permit.approver2 || isAuthorized(permit.status) ? 'APPROVED' : 'PENDING',
  },
  witnessNotaryStatus: toWitnessNotaryStatus(permit.status),
});
