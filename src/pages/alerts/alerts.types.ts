export type ActionFilter = 'ALL' | 'NEEDS_ACTION' | 'INVESTIGATION' | 'MONITORING';

export interface ActionFilterTab {
  filter: ActionFilter;
  label: string;
  showTotalCount: boolean;
  activeClassName: string;
  inactiveClassName: string;
}
