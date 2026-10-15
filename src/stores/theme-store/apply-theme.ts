import { ZEROFLASH_THEMES } from '../../data/themes.data';
import type { ZeroFlashThemeId } from '../../types/theme';

const LIGHT_THEME_ID: ZeroFlashThemeId = 'solaris-daylight';

export function applyThemeToDocument(theme: ZeroFlashThemeId) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.setAttribute('data-theme', theme);
  for (const config of ZEROFLASH_THEMES) root.classList.remove(`theme-${config.id}`);
  root.classList.add(`theme-${theme}`);

  const isLight = theme === LIGHT_THEME_ID;
  root.classList.remove(isLight ? 'dark' : 'light');
  root.classList.add(isLight ? 'light' : 'dark');
}
