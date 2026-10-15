import type { SecurityIncident } from '../../types';

export type ResponseTarget = Pick<SecurityIncident, 'id' | 'title' | 'primaryVictim'>;

export type LifecycleStep = 'Proposal' | 'Authorization' | 'Execution' | 'Verification' | 'Rollback';

export type ContainmentActionId = 'ISOLATE_HOST_QUARANTINE' | 'TCP_RST_ACTIVE_TEARDOWN' | 'BGP_FLOWSPEC_BLACKHOLE';

export interface ContainmentActionOption {
  id: ContainmentActionId;
  label: string;
}

export interface Approver {
  title: string;
  role: string;
}
