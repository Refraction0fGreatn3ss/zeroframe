export interface SavedView<TConfig> {
  id: string;
  name: string;
  config: TConfig;
  savedAt: string;
}

const STORAGE_PREFIX = 'zf_saved_views:';

function storageKey(viewKey: string): string {
  return `${STORAGE_PREFIX}${viewKey}`;
}

export function readSavedViews<TConfig>(viewKey: string): SavedView<TConfig>[] {
  try {
    const raw = localStorage.getItem(storageKey(viewKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as SavedView<TConfig>[]) : [];
  } catch {
    return [];
  }
}

export function writeSavedViews<TConfig>(viewKey: string, views: SavedView<TConfig>[]): void {
  try {
    localStorage.setItem(storageKey(viewKey), JSON.stringify(views));
  } catch {
    // Saved views are a convenience; failing to persist them is not an error state.
  }
}
