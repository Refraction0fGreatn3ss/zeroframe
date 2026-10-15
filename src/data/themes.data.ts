import type { ThemeConfig } from '../types/theme';

export const ZEROFLASH_THEMES: ThemeConfig[] = [
  {
    id: 'obsidian-onyx',
    name: 'Valkyrie Blackout',
    category: 'dark',
    tagline: 'Zero-OLED Blackout · Laser Cyan',
    description:
      'Pitch-black stealth operations canvas with razor-sharp hyper-cyan luminescence and surgical platinum contrast.',
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
    description:
      'Pristine daylight operations console with bright porcelain surfaces, deep ink navy text, and cobalt precision.',
    previewBg: '#ffffff',
    previewAccent: '#2563eb',
    badgeColor: 'border-blue-500/40 text-blue-600 bg-blue-50',
  },
];
