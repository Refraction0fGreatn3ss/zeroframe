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
