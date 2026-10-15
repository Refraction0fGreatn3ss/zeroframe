export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

const BASE_BUTTON_CLASS = 'px-2 py-0.5 rounded transition-all cursor-pointer font-medium';
const ACTIVE_BUTTON_CLASS =
  'bg-[var(--zf-nav-active-bg)] text-[var(--zf-text-primary)] border border-[var(--zf-brand-accent)]';
const INACTIVE_BUTTON_CLASS = 'text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)]';

export const SegmentedControl = <T extends string>({ options, value, onChange }: SegmentedControlProps<T>) => (
  <div className="flex items-center rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] p-0.5 text-[11px] font-mono">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        className={`${BASE_BUTTON_CLASS} ${value === option.value ? ACTIVE_BUTTON_CLASS : INACTIVE_BUTTON_CLASS}`}
      >
        {option.label}
      </button>
    ))}
  </div>
);
