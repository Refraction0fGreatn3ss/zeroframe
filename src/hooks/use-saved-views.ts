import { useCallback, useState } from 'react';
import { readSavedViews, type SavedView, writeSavedViews } from '../lib/saved-views';

/**
 * Saved views persist presentation and query configuration only (filters, columns, sort, density,
 * time-range template). Never pass security data as the config.
 */
export function useSavedViews<TConfig>(viewKey: string) {
  const [views, setViews] = useState<SavedView<TConfig>[]>(() => readSavedViews<TConfig>(viewKey));

  const persist = useCallback(
    (next: SavedView<TConfig>[]) => {
      setViews(next);
      writeSavedViews(viewKey, next);
    },
    [viewKey],
  );

  const saveView = (name: string, config: TConfig) =>
    persist([...views, { id: crypto.randomUUID(), name, config, savedAt: new Date().toISOString() }]);

  const deleteView = (id: string) => persist(views.filter((view) => view.id !== id));

  return { views, saveView, deleteView };
}
