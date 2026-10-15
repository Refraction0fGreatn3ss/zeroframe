import { INITIAL_ACTIVITY_LOGS } from '../data/activity-log.data';
import { createStore, useStore } from '../lib/create-store';
import type { ActivityCategory, ActivitySeverity, SecurityActivityItem } from '../types/activity-log';
import { clearNewFlag, createActivityEvent, prependActivity } from './activity-log-store/activity-events';
import { countActivityLogs, filterActivityLogs } from './activity-log-store/activity-log-filters';
import { startActivityStream } from './activity-log-store/activity-stream';
import { tenantRegistry } from './tenant-registry';

interface ActivityLogStoreState {
  logs: SecurityActivityItem[];
  isStreaming: boolean;
  filterCategory: ActivityCategory | 'ALL';
  filterSeverity: ActivitySeverity | 'ALL';
  searchQuery: string;
  selectedLog: SecurityActivityItem | null;
  autoScroll: boolean;
}

const NEW_EVENT_HIGHLIGHT_MS = 3000;

const activityLogStore = createStore<ActivityLogStoreState>({
  logs: [...INITIAL_ACTIVITY_LOGS],
  isStreaming: true,
  filterCategory: 'ALL',
  filterSeverity: 'ALL',
  searchQuery: '',
  selectedLog: null,
  autoScroll: true,
});

function addEvent(event: SecurityActivityItem) {
  activityLogStore.setState((state) => ({ logs: prependActivity(state.logs, event) }));
}

function streamEvent(event: SecurityActivityItem) {
  addEvent(event);
  setTimeout(() => {
    activityLogStore.setState((state) => ({ logs: clearNewFlag(state.logs, event.id) }));
  }, NEW_EVENT_HIGHLIGHT_MS);
}

if (typeof window !== 'undefined') {
  startActivityStream(
    () => activityLogStore.getState().isStreaming,
    (template) => streamEvent(createActivityEvent(template)),
  );
}

tenantRegistry.register('activity-log', {
  clear: () => activityLogStore.setState({ logs: [] }),
  reload: async () => activityLogStore.setState({ logs: [...INITIAL_ACTIVITY_LOGS] }),
});

export const activityLogActions = {
  toggleStreaming: () => activityLogStore.setState((state) => ({ isStreaming: !state.isStreaming })),
  setCategoryFilter: (filterCategory: ActivityCategory | 'ALL') => activityLogStore.setState({ filterCategory }),
  setSeverityFilter: (filterSeverity: ActivitySeverity | 'ALL') => activityLogStore.setState({ filterSeverity }),
  setSearchQuery: (searchQuery: string) => activityLogStore.setState({ searchQuery }),
  setSelectedLog: (selectedLog: SecurityActivityItem | null) => activityLogStore.setState({ selectedLog }),
  setAutoScroll: (autoScroll: boolean) => activityLogStore.setState({ autoScroll }),
  clearLogs: () => activityLogStore.setState({ logs: [] }),
  resetLogs: () => activityLogStore.setState({ logs: [...INITIAL_ACTIVITY_LOGS] }),
  addManualEvent: (event: Omit<SecurityActivityItem, 'id' | 'timestamp'>) => addEvent(createActivityEvent(event)),
};

export function useActivityLogStore() {
  const state = useStore(activityLogStore);
  return {
    ...state,
    filteredLogs: filterActivityLogs(state.logs, state),
    counts: countActivityLogs(state.logs),
    ...activityLogActions,
  };
}
