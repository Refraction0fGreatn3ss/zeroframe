import { useState } from 'react';
import type { LivingEntity } from '../../../types';
import type { AssetCategoryFilter } from '../assets.types';
import { filterEntities } from '../assets.utils';

export const useAssetFilters = (entities: LivingEntity[]) => {
  const [categoryFilter, setCategoryFilter] = useState<AssetCategoryFilter>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntities = filterEntities(entities, categoryFilter, searchTerm);

  return { categoryFilter, setCategoryFilter, searchTerm, setSearchTerm, filteredEntities };
};
