import { ChevronDown, Palette } from 'lucide-react';
import type React from 'react';
import type { ThemeConfig, ZeroFlashThemeId } from '../../../stores/theme-store';
import { ThemeOptionButton } from './ThemeOptionButton';
import { useDismissablePopover } from './use-dismissable-popover';

interface ThemeMenuProps {
  activeThemeId: ZeroFlashThemeId;
  themes: ThemeConfig[];
  currentThemeConfig: ThemeConfig;
  onSelectTheme: (themeId: ZeroFlashThemeId) => void;
}

export const ThemeMenu: React.FC<ThemeMenuProps> = ({ activeThemeId, themes, currentThemeConfig, onSelectTheme }) => {
  const { isOpen, toggle, close, containerRef } = useDismissablePopover();

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] transition-colors cursor-pointer text-xs font-sans shadow-xs"
        title={`Current Theme: ${currentThemeConfig.name}. Click to switch console themes.`}
        aria-label="Console Appearance Themes"
      >
        <Palette className="w-3.5 h-3.5 text-[var(--zf-brand-accent)] shrink-0" />
        <span className="hidden sm:inline font-medium text-[11px] text-[var(--zf-text-primary)]">
          {currentThemeConfig.name}
        </span>
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/30 dark:border-white/20"
          style={{ backgroundColor: currentThemeConfig.previewAccent }}
        />
        <ChevronDown className="w-3 h-3 text-[var(--zf-text-muted)] shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-80 p-2 rounded-lg shadow-2xl bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] z-50 animate-in fade-in zoom-in-95 duration-100 text-xs font-sans">
          <div className="px-2.5 py-1.5 border-b border-[var(--zf-border-subtle)] mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[var(--zf-text-primary)]">
              <Palette className="w-3.5 h-3.5 text-[var(--zf-brand-accent)]" />
              <span>Console Palettes</span>
            </div>
            <span className="text-[10px] font-mono text-[var(--zf-brand-accent)] font-semibold">
              {themes.length} Master Themes
            </span>
          </div>

          <div className="space-y-1">
            {themes.map((t) => (
              <ThemeOptionButton
                key={t.id}
                themeConfig={t}
                isSelected={t.id === activeThemeId}
                onSelect={() => {
                  onSelectTheme(t.id);
                  close();
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
