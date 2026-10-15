/**
 * Enterprise Theme Selector Menu
 * Clean, compact theme switcher for top bar / user dropdown
 */

import React, { useState, useRef, useEffect } from 'react';
import { useThemeStore, ZeroFlashThemeId } from '../../stores/theme-store';
import { Palette, Check, Sun, Moon } from 'lucide-react';

interface ThemeSwitcherProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ variant = 'compact', className = '' }) => {
  const { theme, setTheme, themes, currentThemeConfig } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] hover:border-[var(--zf-border-medium)] transition-colors text-xs font-sans cursor-pointer group"
        title={`Current theme: ${currentThemeConfig.name}. Click to switch theme.`}
        aria-label="Select appearance theme"
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20"
          style={{ backgroundColor: currentThemeConfig.previewAccent }}
        />
        {variant === 'full' ? (
          <span className="truncate max-w-[110px] font-medium">{currentThemeConfig.name}</span>
        ) : (
          <span className="hidden xl:inline text-[11px] font-medium">{currentThemeConfig.name}</span>
        )}
        <Palette className="w-3 h-3 text-[var(--zf-text-muted)] group-hover:text-[var(--zf-text-primary)] shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 p-1.5 rounded-md shadow-xl bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] z-50 animate-in fade-in zoom-in-95 duration-100 text-xs font-sans">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--zf-text-muted)] border-b border-[var(--zf-border-subtle)] mb-1 flex items-center justify-between">
            <span>Appearance Palette</span>
            <span>{themes.length} Master Themes</span>
          </div>

          <div className="space-y-1">
            {themes.map((t) => {
              const isSelected = t.id === theme;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded flex items-start gap-2.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--zf-nav-active-bg)] text-[var(--zf-text-primary)] font-medium border-l-2 border-[var(--zf-brand-accent)]'
                      : 'text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] hover:bg-[var(--zf-surface-card-hover)]'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full mt-0.5 shrink-0 border border-black/20 flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: t.previewBg }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: t.previewAccent }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[var(--zf-text-primary)]">
                        {t.name}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[var(--zf-brand-accent)] shrink-0 ml-1" />
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--zf-text-muted)] leading-tight mt-0.5 line-clamp-2">
                      {t.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-1.5 border-t border-[var(--zf-border-subtle)] px-2 text-[10px] text-[var(--zf-text-muted)] flex items-center justify-between">
            <span>Persistent preference</span>
            <span className="font-mono text-[9px]">v1.0 SOC</span>
          </div>
        </div>
      )}
    </div>
  );
};
