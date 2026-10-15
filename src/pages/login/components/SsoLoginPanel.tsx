import { Globe } from 'lucide-react';
import type { FC, MouseEvent } from 'react';

interface SsoLoginPanelProps {
  isLoading: boolean;
  onSignIn: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const SsoLoginPanel: FC<SsoLoginPanelProps> = ({ isLoading, onSignIn }) => (
  <div className="space-y-4 text-center">
    <p className="text-xs text-[var(--zf-text-secondary)] leading-relaxed">
      Federated identity provider SAML 2.0 / OIDC authentication with Okta Verify or Azure AD.
    </p>

    <button
      type="button"
      onClick={onSignIn}
      disabled={isLoading}
      className="w-full py-2.5 px-4 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
    >
      <Globe className="w-4 h-4 text-[var(--zf-brand-accent)]" />
      <span>Single Sign-On (Okta / Azure AD)</span>
    </button>
  </div>
);
