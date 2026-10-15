import type { FC } from 'react';
import { useAppStore } from '../../stores/app-store';
import { useInvestigationStore } from '../../stores/investigation-store';
import { INCIDENTS_PATH } from './assets.data';
import { AssetDetailDrawer } from './components/AssetDetailDrawer';
import { AssetFilterBar } from './components/AssetFilterBar';
import { AssetsHeader } from './components/AssetsHeader';
import { AssetsTable } from './components/AssetsTable';
import { useAssetDrawer } from './hooks/use-asset-drawer';
import { useAssetFilters } from './hooks/use-asset-filters';

export const AssetsPage: FC = () => {
  const { entities } = useInvestigationStore();
  const { setCurrentPath } = useAppStore();
  const filters = useAssetFilters(entities);
  const drawer = useAssetDrawer();

  const pivotToIncident = () => {
    drawer.closeDrawer();
    setCurrentPath(INCIDENTS_PATH);
  };

  return (
    <div className="p-5 space-y-4 text-[#e6edf3] max-w-[1720px] mx-auto font-sans">
      <AssetsHeader entities={entities} />

      <AssetFilterBar
        totalCount={entities.length}
        categoryFilter={filters.categoryFilter}
        onCategoryChange={filters.setCategoryFilter}
        searchTerm={filters.searchTerm}
        onSearchChange={filters.setSearchTerm}
      />

      <AssetsTable entities={filters.filteredEntities} onSelect={drawer.openDrawer} />

      {drawer.activeEntity && (
        <AssetDetailDrawer
          entity={drawer.activeEntity}
          activeTab={drawer.drawerTab}
          onTabChange={drawer.setDrawerTab}
          onClose={drawer.closeDrawer}
          onPivotToIncident={pivotToIncident}
        />
      )}
    </div>
  );
};
