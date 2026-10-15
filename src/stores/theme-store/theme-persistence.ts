import { ZEROFLASH_THEMES } from '../../data/themes.data';
import type { ZeroFlashThemeId } from '../../types/theme';

const THEME_STORAGE_KEY = 'zeroflash_enterprise_theme_v2';
const LEGACY_THEME_STORAGE_KEY = 'zeroflash_enterprise_theme';
const DEFAULT_THEME: ZeroFlashThemeId = 'obsidian-onyx';

const LEGACY_THEME_MIGRATIONS = new Map<string, ZeroFlashThemeId>([
  ['light-operations', 'solaris-daylight'],
  ['midnight-blue', 'midnight-phantom'],
  ['graphite-green', 'matrix-terminal'],
]);

function isThemeId(value: string | null): value is ZeroFlashThemeId {
  return value !== null && ZEROFLASH_THEMES.some((theme) => theme.id === value);
}

export function loadPersistedTheme(): ZeroFlashThemeId {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeId(savedTheme)) {
      return savedTheme;
    }
    const migratedTheme = LEGACY_THEME_MIGRATIONS.get(localStorage.getItem(LEGACY_THEME_STORAGE_KEY) ?? '');
    if (migratedTheme) {
      return migratedTheme;
    }
  } catch {
    // Storage unavailable; fall back to the default theme.
  }
  return DEFAULT_THEME;
}

export function persistTheme(theme: ZeroFlashThemeId): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage unavailable; the theme still applies for this session.
  }
}
