import type { ProtectedAsset, ProtectedAssetQuery } from '../types/protected-assets';
import { backendContractRequired } from './api-error';
import type { Page, PageRequest, RequestContext } from './http-types';

export const protectedAssetsService = {
  list(_query: ProtectedAssetQuery, _page: PageRequest, _context: RequestContext): Promise<Page<ProtectedAsset>> {
    return backendContractRequired('GET /response/protected-assets');
  },
};
