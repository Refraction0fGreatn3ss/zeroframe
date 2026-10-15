import type { Page } from '../services/http-types';
import { protectedAssetsService } from '../services/protected-assets-service';
import type { ProtectedAsset, ProtectedAssetQuery } from '../types/protected-assets';
import { createResourceStore } from './core/create-resource-store';

export const protectedAssetsResource = createResourceStore<Page<ProtectedAsset>, ProtectedAssetQuery>({
  name: 'protected-assets',
  initialFilters: { search: '', protectedOnly: false },
  fetch: ({ filters, page, signal, tenantId }) =>
    protectedAssetsService.list(filters, page, { signal, tenantId: tenantId ?? undefined }),
  pageInfo: (data) => ({ nextCursor: data.nextCursor, total: data.total }),
});
