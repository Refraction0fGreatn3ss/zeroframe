import { useState } from 'react';
import { responseService } from '../../../services/response-service';
import type { ResponseActionState } from '../../../types';
import {
  COMPENSATING_CONTROL,
  STEP_INDEX,
  WIRE_APPLIED_DELAY_MS,
  WIRE_VERIFIED_DELAY_MS,
} from '../governed-response-studio.data';
import type { ResponseTarget } from '../governed-response-studio.types';
import { createLocalPermitId, formatContainmentReason, formatTargetResource } from '../governed-response-studio.utils';

interface UseResponseLifecycleParams {
  incident: ResponseTarget;
  selectedAction: string;
  killSwitchEngaged: boolean;
}

export const useResponseLifecycle = ({ incident, selectedAction, killSwitchEngaged }: UseResponseLifecycleParams) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(STEP_INDEX.PROPOSAL);
  const [permitId, setPermitId] = useState<string | null>(null);
  const [approver1Signed, setApprover1Signed] = useState(false);
  const [approver2Signed, setApprover2Signed] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionState, setExecutionState] = useState<ResponseActionState>('REQUESTED');

  const proposePermit = async () => {
    setIsSubmitting(true);
    try {
      const permit = await responseService.issuePermit({
        actionType: selectedAction,
        targetResource: formatTargetResource(incident),
        reason: formatContainmentReason(incident),
        compensatingControl: COMPENSATING_CONTROL,
      });
      setPermitId(permit.id);
      setApprover1Signed(true);
      setApprover2Signed(false);
      setCurrentStepIndex(STEP_INDEX.AUTHORIZATION);
      setExecutionState('AUTHORIZED');
    } catch (err) {
      console.error('Failed to issue execution permit', err);
      setPermitId(createLocalPermitId());
      setApprover1Signed(true);
      setCurrentStepIndex(STEP_INDEX.AUTHORIZATION);
    } finally {
      setIsSubmitting(false);
    }
  };

  const signSecondApprover = async () => {
    setIsSubmitting(true);
    try {
      if (permitId) {
        await responseService.approvePermit(permitId);
      }
      setApprover2Signed(true);
      setExecutionState('AUTHORIZED');
    } catch (err) {
      console.error('Failed to co-sign permit on backend', err);
      setApprover2Signed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeResponse = () => {
    if (!approver1Signed || !approver2Signed || killSwitchEngaged) return;

    setIsExecuting(true);
    setCurrentStepIndex(STEP_INDEX.EXECUTION);
    setExecutionState('APPLYING');

    setTimeout(() => {
      setExecutionState('APPLIED');
      setCurrentStepIndex(STEP_INDEX.VERIFICATION);
    }, WIRE_APPLIED_DELAY_MS);

    setTimeout(() => {
      setExecutionState('VERIFIED');
      setIsExecuting(false);
    }, WIRE_VERIFIED_DELAY_MS);
  };

  const rollback = async () => {
    setCurrentStepIndex(STEP_INDEX.ROLLBACK);
    setExecutionState('ROLLED_BACK');
    if (permitId) {
      try {
        await responseService.executeRollback(permitId);
      } catch (err) {
        console.warn('Rollback call handled', err);
      }
    }
  };

  return {
    currentStepIndex,
    permitId,
    approver1Signed,
    approver2Signed,
    isExecuting,
    isSubmitting,
    executionState,
    proposePermit,
    signSecondApprover,
    executeResponse,
    rollback,
  };
};
