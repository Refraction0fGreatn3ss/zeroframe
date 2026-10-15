export type AssetCategoryFilter = 'ALL' | 'IT' | 'IOT_OT' | 'SERVERS' | 'CRITICAL';

export type AssetDrawerTab = 'CONTEXT' | 'BITEMPORAL';

export interface CategoryFilterTab {
  id: AssetCategoryFilter;
  label: string;
}
