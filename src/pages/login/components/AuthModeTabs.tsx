import type { FC } from 'react';
import type { AuthMode } from '../login.types';

interface AuthModeTabsProps {
  authMode: AuthMode;
  onSelect: (mode: AuthMode) => void;
}

const AUTH_MODE_TABS: { id: AuthMode; label: string }[] = [
  { id: 'CREDENTIALS', label: 'Operator ID' },
  { id: 'SSO', label: 'Enterprise SSO' },
];

export const AuthModeTabs: FC<AuthModeTabsProps> = ({ authMode, onSelect }) => (
  <div className="grid grid-cols-2 p-1 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] mb-5 text-xs font-medium">
    {AUTH_MODE_TABS.map(({ id, label }) => (
      <button
        key={id}
        type="button"
        onClick={() => onSelect(id)}
        className={`py-1.5 rounded transition-all cursor-pointer ${
          authMode === id
            ? 'bg-[var(--zf-nav-active-bg)] text-[var(--zf-text-primary)] shadow-xs border border-[var(--zf-brand-accent)]'
            : 'text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)]'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);
