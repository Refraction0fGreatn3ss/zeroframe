import type { ResponseActionState } from '../../types';
import { LOCAL_PERMIT_ID_SUFFIX_LENGTH } from './governed-response-studio.data';
import type { ResponseTarget } from './governed-response-studio.types';

export const formatTargetResource = (target: ResponseTarget): string =>
  `${target.primaryVictim.hostname} (${target.primaryVictim.ip})`;

export const formatContainmentReason = (target: ResponseTarget): string =>
  `Containment action for ${target.id}: ${target.title}`;

export const createLocalPermitId = (): string => `PMT-${Date.now().toString().slice(-LOCAL_PERMIT_ID_SUFFIX_LENGTH)}`;

export const getStepBadgeClassName = (isCompleted: boolean, isCurrent: boolean): string =>
  isCompleted
    ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
    : isCurrent
      ? 'bg-[#20252c] border border-zinc-500 text-white'
      : 'bg-[#14171c] border border-[#23272e] text-zinc-600';

export const getStepLabelClassName = (isCompleted: boolean, isCurrent: boolean): string =>
  isCurrent ? 'text-zinc-100 font-semibold' : isCompleted ? 'text-zinc-300' : 'text-zinc-600';

export const getProposalButtonLabel = (permitId: string | null, isSubmitting: boolean): string =>
  permitId
    ? `Permit Active: ${permitId}`
    : isSubmitting
      ? 'Issuing Proposal on Backend...'
      : 'Submit Governed Proposal';

export const getExecuteButtonClassName = (
  executionState: ResponseActionState,
  approver2Signed: boolean,
  killSwitchEngaged: boolean,
): string =>
  executionState === 'VERIFIED'
    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300 cursor-default'
    : !approver2Signed || killSwitchEngaged
      ? 'bg-[#181b20] border border-[#23272e] text-zinc-600 cursor-not-allowed'
      : 'bg-zinc-200 hover:bg-white text-zinc-950';

export const getExecuteButtonLabel = (isExecuting: boolean, executionState: ResponseActionState): string =>
  isExecuting
    ? 'Executing & Verifying Wire...'
    : executionState === 'VERIFIED'
      ? 'Action Confirmed on Wire'
      : 'Execute Governed Containment';
