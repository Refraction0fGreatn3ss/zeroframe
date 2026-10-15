import { type KeyboardEvent, useId } from 'react';

export interface TabDefinition<TId extends string> {
  id: TId;
  label: string;
}

interface TabsProps<TId extends string> {
  tabs: readonly TabDefinition<TId>[];
  activeTab: TId;
  onChange: (tab: TId) => void;
  label: string;
}

export function tabPanelId(baseId: string, tab: string): string {
  return `${baseId}-panel-${tab}`;
}

export function Tabs<TId extends string>({ tabs, activeTab, onChange, label }: TabsProps<TId>) {
  const baseId = useId();

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const offset = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (offset === 0) return;
    event.preventDefault();
    const next = tabs[(index + offset + tabs.length) % tabs.length];
    onChange(next.id);
    document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className="flex gap-1 border-b border-[var(--zf-border-subtle)]">
      {tabs.map((tab, index) => {
        const selected = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            id={`${baseId}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`px-3 py-1.5 text-xs border-b-2 -mb-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--zf-border-focus)] ${
              selected
                ? 'border-[var(--zf-brand-accent)] text-[var(--zf-text-primary)]'
                : 'border-transparent text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
