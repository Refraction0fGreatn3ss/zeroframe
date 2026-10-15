import { type FC, useEffect, useState } from 'react';
import { useDebouncedValue } from '../../../hooks/use-debounced-value';
import type { ProtectedAssetQuery } from '../../../types/protected-assets';

const SEARCH_DEBOUNCE_MS = 300;

interface ProtectedAssetFiltersProps {
  filters: ProtectedAssetQuery;
  onChange: (patch: Partial<ProtectedAssetQuery>) => void;
}

export const ProtectedAssetFilters: FC<ProtectedAssetFiltersProps> = ({ filters, onChange }) => {
  const [searchDraft, setSearchDraft] = useState(filters.search);
  const debouncedSearch = useDebouncedValue(searchDraft, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (debouncedSearch !== filters.search) onChange({ search: debouncedSearch });
  }, [debouncedSearch, filters.search, onChange]);

  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px]">
      <label className="flex items-center gap-1.5 text-[var(--zf-text-secondary)]">
        Search
        <input
          type="search"
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          placeholder="Asset, owner, policy…"
          className="px-2 py-1 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-primary)] focus:outline focus:outline-2 focus:outline-[var(--zf-border-focus)]"
        />
      </label>
      <label className="flex items-center gap-1.5 text-[var(--zf-text-secondary)]">
        <input
          type="checkbox"
          checked={filters.protectedOnly}
          onChange={(event) => onChange({ protectedOnly: event.target.checked })}
        />
        Protected only
      </label>
    </div>
  );
};
