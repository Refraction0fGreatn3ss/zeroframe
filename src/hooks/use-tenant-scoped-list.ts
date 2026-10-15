import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { tenantRegistry } from '../stores/tenant-registry';

interface TenantScopedList<T> {
  items: T[];
  setItems: Dispatch<SetStateAction<T[]>>;
  isLoading: boolean;
  reload: () => Promise<void>;
}

/**
 * Loads a list on mount and re-loads it whenever the active tenant changes.
 * `fetchItems` must be referentially stable (e.g. defined at module scope).
 */
export const useTenantScopedList = <T>(
  fetchItems: () => Promise<T[] | null | undefined>,
  errorMessage: string,
): TenantScopedList<T> => {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const reload = useCallback(async () => {
    setIsLoading(true);
    try {
      const loaded = await fetchItems();
      setItems(loaded || []);
    } catch (err) {
      console.warn(errorMessage, err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems, errorMessage]);

  useEffect(() => {
    reload();

    const unregister = tenantRegistry.register(
      () => setItems([]),
      async () => {
        await reload();
      },
    );

    return () => {
      unregister();
    };
  }, [reload]);

  return { items, setItems, isLoading, reload };
};
