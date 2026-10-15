import type { FC } from 'react';
import { LIFECYCLE_STEPS } from '../governed-response-studio.data';
import { getStepBadgeClassName, getStepLabelClassName } from '../governed-response-studio.utils';

interface LifecycleProgressTrackerProps {
  currentStepIndex: number;
}

export const LifecycleProgressTracker: FC<LifecycleProgressTrackerProps> = ({ currentStepIndex }) => (
  <div className="p-3.5 bg-[#101215] border border-[#20242a] rounded">
    <div className="flex items-center justify-between text-xs">
      {LIFECYCLE_STEPS.map((step, idx) => {
        const isCompleted = idx < currentStepIndex;
        const isCurrent = idx === currentStepIndex;

        return (
          <div key={step} className="flex-1 flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded flex items-center justify-center font-mono text-[11px] font-medium ${getStepBadgeClassName(isCompleted, isCurrent)}`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span className={`text-xs ${getStepLabelClassName(isCompleted, isCurrent)}`}>{step}</span>
            </div>
            {idx < LIFECYCLE_STEPS.length - 1 && <div className="flex-1 h-px bg-[#20242a] mx-3" />}
          </div>
        );
      })}
    </div>
  </div>
);
