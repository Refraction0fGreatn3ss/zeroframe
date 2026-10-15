import { CheckCircle2 } from 'lucide-react';
import type React from 'react';
import type { ThemeConfig } from '../../../stores/theme-store';

interface ThemeOptionButtonProps {
  themeConfig: ThemeConfig;
  isSelected: boolean;
  onSelect: () => void;
}

export const ThemeOptionButton: React.FC<ThemeOptionButtonProps> = ({ themeConfig: t, isSelected, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`w-full text-left px-2.5 py-2 rounded-md flex items-center gap-3 transition-colors cursor-pointer ${
      isSelected
        ? 'bg-[var(--zf-nav-active-bg)] text-[var(--zf-text-primary)] font-medium border border-[var(--zf-border-medium)]'
        : 'text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] hover:bg-[var(--zf-surface-card-hover)]'
    }`}
  >
    <div
      className="w-6 h-6 rounded-md border border-black/20 dark:border-white/10 flex items-center justify-center shrink-0 shadow-xs"
      style={{ backgroundColor: t.previewBg }}
    >
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.previewAccent }} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-xs text-[var(--zf-text-primary)]">{t.name}</span>
        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--zf-brand-accent)] shrink-0 ml-1" />}
      </div>
      <div className="text-[10px] font-mono text-[var(--zf-brand-accent)] font-medium mt-0.5">{t.tagline}</div>
      <span className="text-[10px] text-[var(--zf-text-muted)] block truncate mt-0.5">{t.description}</span>
    </div>
  </button>
);
