import type { FC } from 'react';
import { useInvestigationStore } from '../../stores/investigation-store';
import { useKillSwitch } from '../../stores/kill-switch-store';
import { ActionParametersPanel } from './components/ActionParametersPanel';
import { AuthorizationPanel } from './components/AuthorizationPanel';
import { KillSwitchBanner } from './components/KillSwitchBanner';
import { LifecycleProgressTracker } from './components/LifecycleProgressTracker';
import { StudioHeader } from './components/StudioHeader';
import { useResponseLifecycle } from './hooks/use-response-lifecycle';
import { useResponseTarget } from './hooks/use-response-target';

export const GovernedResponseStudioPage: FC = () => {
  const { incidents } = useInvestigationStore();
  const { state: killSwitchState } = useKillSwitch();
  const responseBlocked = killSwitchState !== 'DISENGAGED';
  const target = useResponseTarget(incidents);
  const lifecycle = useResponseLifecycle({
    incident: target.incident,
    selectedAction: target.selectedAction,
    responseBlocked,
  });

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      <StudioHeader responseBlocked={responseBlocked} />

      {killSwitchState === 'ENGAGED' && <KillSwitchBanner />}

      <LifecycleProgressTracker currentStepIndex={lifecycle.currentStepIndex} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <ActionParametersPanel
          incidents={incidents}
          incident={target.incident}
          selectedIncidentId={target.selectedIncidentId}
          onIncidentChange={target.setSelectedIncidentId}
          selectedAction={target.selectedAction}
          onActionChange={target.setSelectedAction}
          permitId={lifecycle.permitId}
          isSubmitting={lifecycle.isSubmitting}
          onPropose={lifecycle.proposePermit}
        />

        <AuthorizationPanel
          permitId={lifecycle.permitId}
          approver1Signed={lifecycle.approver1Signed}
          approver2Signed={lifecycle.approver2Signed}
          isSubmitting={lifecycle.isSubmitting}
          isExecuting={lifecycle.isExecuting}
          responseBlocked={responseBlocked}
          executionState={lifecycle.executionState}
          onSignSecondApprover={lifecycle.signSecondApprover}
          onExecute={lifecycle.executeResponse}
          onRollback={lifecycle.rollback}
        />
      </div>
    </div>
  );
};
