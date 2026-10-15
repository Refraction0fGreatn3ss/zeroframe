/**
 * Enterprise Theme System for ZeroFrame NDR/XDR
 * 
 * 5 Re-engineered, Striking & Distinct Aesthetic Palettes:
 * 1. Obsidian Onyx (Stealth OLED Black with Hyper-Cyan & Platinum Contrast)
 * 2. Midnight Phantom (Deep Marine Navy SpecOps with Radiant Electric Azure)
 * 3. Matrix Terminal (Cyber Phosphor Green Hacker Terminal on Dark Slate)
 * 4. Tokyo Cyberpunk (Dark Synthwave Violet with Hot Magenta Rose & Amber)
 * 5. Solaris Daylight (Surgical White High-Clarity Daylight Operations)
 */

import { useState, useEffect } from 'react';

export type ZeroFlashThemeId =
  | 'obsidian-onyx'
  | 'midnight-phantom'
  | 'matrix-terminal'
  | 'tokyo-cyberpunk'
  | 'solaris-daylight';

export interface ThemeConfig {
  id: ZeroFlashThemeId;
  name: string;
  category: 'dark' | 'light';
  tagline: string;
  description: string;
  previewBg: string;
  previewAccent: string;
  badgeColor: string;
}

export const ZEROFLASH_THEMES: ThemeConfig[] = [
  {
    id: 'obsidian-onyx',
    name: 'Valkyrie Blackout',
    category: 'dark',
    tagline: 'Zero-OLED Blackout · Laser Cyan',
    description: 'Pitch-black stealth operations canvas with razor-sharp hyper-cyan luminescence and surgical platinum contrast.',
    previewBg: '#000000',
    previewAccent: '#00f0ff',
    badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40',
  },
  {
    id: 'midnight-phantom',
    name: 'Cobalt Spectre',
    category: 'dark',
    tagline: 'Abyssal Navy · Electric Azure',
    description: 'US Cyber Command bunker navy sapphire with glowing cobalt pipelines and electric azure signal paths.',
    previewBg: '#06122e',
    previewAccent: '#38bdf8',
    badgeColor: 'border-sky-500/40 text-sky-400 bg-sky-950/40',
  },
  {
    id: 'matrix-terminal',
    name: 'Viper Cyberpunk',
    category: 'dark',
    tagline: 'Phosphor Matrix · Toxic Emerald',
    description: 'Radioactive DEFCON hacker terminal with phosphor CRT emerald green and dark bio-slate.',
    previewBg: '#03170a',
    previewAccent: '#10b981',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40',
  },
  {
    id: 'tokyo-cyberpunk',
    name: 'Kitsune Neon',
    category: 'dark',
    tagline: 'Tokyo After-Hours · Hot Magenta & Violet',
    description: 'High-voltage synthwave nightfall with hot magenta threat triggers and royal amethyst accents.',
    previewBg: '#18042b',
    previewAccent: '#f43f5e',
    badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-950/40',
  },
  {
    id: 'solaris-daylight',
    name: 'Solaris Pure Light',
    category: 'light',
    tagline: 'Surgical Daylight · Porcelain & Cobalt',
    description: 'Pristine daylight operations console with bright porcelain surfaces, deep ink navy text, and cobalt precision.',
    previewBg: '#ffffff',
    previewAccent: '#2563eb',
    badgeColor: 'border-blue-500/40 text-blue-600 bg-blue-50',
  },
];

const THEME_STORAGE_KEY = 'zeroflash_enterprise_theme_v2';

function getInitialTheme(): ZeroFlashThemeId {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ZeroFlashThemeId | null;
    if (saved && ZEROFLASH_THEMES.some((t) => t.id === saved)) {
      return saved;
    }
    // Backward compatibility for v1 keys
    const oldKey = localStorage.getItem('zeroflash_enterprise_theme');
    if (oldKey === 'light-operations') return 'solaris-daylight';
    if (oldKey === 'midnight-blue') return 'midnight-phantom';
    if (oldKey === 'graphite-green') return 'matrix-terminal';
  } catch {
    // ignore
  }
  return 'obsidian-onyx';
}

let activeTheme: ZeroFlashThemeId = getInitialTheme();
const listeners = new Set<(theme: ZeroFlashThemeId) => void>();

export function applyThemeToDocument(theme: ZeroFlashThemeId) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  
  // Set theme data attribute and clean old theme classes
  root.setAttribute('data-theme', theme);
  ZEROFLASH_THEMES.forEach((t) => root.classList.remove(`theme-${t.id}`));
  root.classList.add(`theme-${theme}`);

  // Dark or light class for standard tailwind helpers
  if (theme === 'solaris-daylight') {
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
  }
}

// Initial application
if (typeof document !== 'undefined') {
  applyThemeToDocument(activeTheme);
}

export function useThemeStore() {
  const [theme, setThemeState] = useState<ZeroFlashThemeId>(activeTheme);

  useEffect(() => {
    listeners.add(setThemeState);
    applyThemeToDocument(activeTheme);
    return () => {
      listeners.delete(setThemeState);
    };
  }, []);

  const setTheme = (newTheme: ZeroFlashThemeId) => {
    activeTheme = newTheme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }
    applyThemeToDocument(newTheme);
    listeners.forEach((listener) => listener(newTheme));
  };

  const currentThemeConfig = ZEROFLASH_THEMES.find((t) => t.id === theme) || ZEROFLASH_THEMES[0];

  return {
    theme,
    setTheme,
    themes: ZEROFLASH_THEMES,
    currentThemeConfig,
  };
}
