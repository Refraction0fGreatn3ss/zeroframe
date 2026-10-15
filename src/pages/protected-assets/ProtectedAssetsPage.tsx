import type { FC } from 'react';
import { PageHeader } from '../../components/page/PageHeader';
import { FreshnessIndicator } from '../../components/ui/FreshnessIndicator';
import { ResourceStateView } from '../../components/ui/ResourceStateView';
import { SavedViewsMenu } from '../../components/ui/SavedViewsMenu';
import { VirtualTable } from '../../components/ui/VirtualTable';
import { useLoadOnMount, useResource } from '../../stores/core/create-resource-store';
import { protectedAssetsResource } from '../../stores/protected-assets-store';
import { ProtectedAssetFilters } from './components/ProtectedAssetFilters';
import { PROTECTED_ASSET_COLUMNS } from './protected-assets.columns';

export const ProtectedAssetsPage: FC = () => {
  useLoadOnMount(protectedAssetsResource);
  const { data, loadState, issue, lastUpdated, filters, setFilters, load } = useResource(protectedAssetsResource);

  return (
    <div className="p-4 space-y-4">
      <PageHeader
        title="Protected Assets"
        description="Response policy enforced by the backend for each asset. The console never overrides it."
        actions={
          <div className="flex items-center gap-2">
            <FreshnessIndicator lastUpdated={lastUpdated} loadState={loadState} label="Policy" />
            <SavedViewsMenu viewKey="protected-assets" currentConfig={filters} onApply={setFilters} />
          </div>
        }
      />
      <ProtectedAssetFilters filters={filters} onChange={setFilters} />
      <ResourceStateView loadState={loadState} issue={issue} onRetry={load}>
        <VirtualTable
          caption="Protected assets and their response policy"
          rows={data?.items ?? []}
          columns={PROTECTED_ASSET_COLUMNS}
          getRowId={(row) => row.assetId}
        />
      </ResourceStateView>
    </div>
  );
};
