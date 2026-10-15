import { ArrowRight } from 'lucide-react';
import type { FC, FormEvent } from 'react';
import { DEFAULT_PASSWORD_PLACEHOLDER, DEFAULT_USERNAME } from '../login.data';

interface CredentialsFormProps {
  username: string;
  password: string;
  isLoading: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export const CredentialsForm: FC<CredentialsFormProps> = ({
  username,
  password,
  isLoading,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className="block text-[11px] font-semibold text-[var(--zf-text-secondary)] uppercase tracking-wider mb-1.5">
        Operator Identifier
      </label>
      <div className="relative">
        <input
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          className="w-full px-3 py-2 text-xs font-mono rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-medium)] focus:border-[var(--zf-brand-accent)] text-[var(--zf-text-primary)] focus:outline-hidden"
          placeholder={DEFAULT_USERNAME}
          required
        />
      </div>
    </div>

    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] font-semibold text-[var(--zf-text-secondary)] uppercase tracking-wider">
          Master Passphrase
        </label>
        <span className="text-[10px] text-[var(--zf-text-muted)] font-mono">mTLS Bound</span>
      </div>
      <input
        type="password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        className="w-full px-3 py-2 text-xs font-mono rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-medium)] focus:border-[var(--zf-brand-accent)] text-[var(--zf-text-primary)] focus:outline-hidden"
        placeholder={DEFAULT_PASSWORD_PLACEHOLDER}
        required
      />
    </div>

    <button
      type="submit"
      disabled={isLoading}
      className="w-full mt-2 py-2.5 px-4 rounded bg-[var(--zf-brand-accent)] hover:opacity-90 text-white font-medium text-xs flex items-center justify-center gap-2 transition-opacity cursor-pointer shadow-md disabled:opacity-50"
    >
      <span>Authenticate Session</span>
      <ArrowRight className="w-3.5 h-3.5" />
    </button>
  </form>
);
