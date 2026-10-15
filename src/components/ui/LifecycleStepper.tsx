import type { FC } from 'react';

interface LifecycleStepperProps<TStep extends string = string> {
  steps: readonly TStep[];
  current: TStep | null;
  failed?: boolean;
  label: string;
}

type StepStatus = 'done' | 'current' | 'failed' | 'pending';

const STATUS_CLASSES: Record<StepStatus, string> = {
  done: 'border-emerald-500/40 text-emerald-300',
  current: 'border-cyan-500/60 text-cyan-200 bg-cyan-500/10',
  failed: 'border-rose-500/60 text-rose-300 bg-rose-500/10',
  pending: 'border-[var(--zf-border-subtle)] text-[var(--zf-text-muted)]',
};

const STATUS_GLYPHS: Record<StepStatus, string> = { done: '✓', current: '●', failed: '✕', pending: '○' };

export const LifecycleStepper: FC<LifecycleStepperProps> = ({ steps, current, failed = false, label }) => {
  const currentIndex = current ? steps.indexOf(current) : -1;

  const statusOf = (index: number): StepStatus => {
    if (index < currentIndex) return 'done';
    if (index === currentIndex) return failed ? 'failed' : 'current';
    return 'pending';
  };

  return (
    <ol aria-label={label} className="flex flex-wrap gap-1">
      {steps.map((step, index) => {
        const status = statusOf(index);
        return (
          <li
            key={step}
            aria-current={status === 'current' ? 'step' : undefined}
            className={`px-1.5 py-0.5 rounded border text-[10px] font-mono ${STATUS_CLASSES[status]}`}
          >
            <span aria-hidden="true">{STATUS_GLYPHS[status]} </span>
            {step}
            <span className="sr-only"> ({status})</span>
          </li>
        );
      })}
    </ol>
  );
};
