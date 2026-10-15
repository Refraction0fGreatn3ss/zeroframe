import { ZEROFLASH_THEMES } from '../data/themes.data';
import { createStore, useStore } from '../lib/create-store';
import type { ThemeConfig, ZeroFlashThemeId } from '../types/theme';
import { applyThemeToDocument } from './theme-store/apply-theme';
import { loadPersistedTheme, persistTheme } from './theme-store/theme-persistence';

export { ZEROFLASH_THEMES } from '../data/themes.data';
export type { ThemeConfig, ZeroFlashThemeId } from '../types/theme';
export { applyThemeToDocument } from './theme-store/apply-theme';

interface ThemeState {
  theme: ZeroFlashThemeId;
}

const themeStore = createStore<ThemeState>({ theme: loadPersistedTheme() });

applyThemeToDocument(themeStore.getState().theme);

function findThemeConfig(theme: ZeroFlashThemeId): ThemeConfig {
  return ZEROFLASH_THEMES.find((config) => config.id === theme) || ZEROFLASH_THEMES[0];
}

export const themeActions = {
  setTheme(theme: ZeroFlashThemeId) {
    persistTheme(theme);
    applyThemeToDocument(theme);
    themeStore.setState({ theme });
  },
};

export function useThemeStore() {
  const { theme } = useStore(themeStore);
  return {
    theme,
    setTheme: themeActions.setTheme,
    themes: ZEROFLASH_THEMES,
    currentThemeConfig: findThemeConfig(theme),
  };
}
