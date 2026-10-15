import { createStore, useStore } from '../lib/create-store';
import type { ContextItem } from '../types/context-drawer';

export type { ContextItem, ContextItemData, ContextType } from '../types/context-drawer';

interface ContextDrawerState {
  isOpen: boolean;
  history: ContextItem[];
  currentIndex: number;
}

const drawerStore = createStore<ContextDrawerState>({
  isOpen: false,
  history: [],
  currentIndex: -1,
});

function canGoBack(state: ContextDrawerState): boolean {
  return state.currentIndex > 0;
}

function canGoForward(state: ContextDrawerState): boolean {
  return state.currentIndex < state.history.length - 1;
}

function getCurrentItem(state: ContextDrawerState): ContextItem | null {
  return state.currentIndex >= 0 ? state.history[state.currentIndex] : null;
}

export const drawerActions = {
  openContext(item: ContextItem) {
    drawerStore.setState((state) => {
      // Opening a new item discards any forward history, like browser navigation.
      const history = [...state.history.slice(0, state.currentIndex + 1), item];
      return { isOpen: true, history, currentIndex: history.length - 1 };
    });
  },

  closeDrawer() {
    drawerStore.setState({ isOpen: false });
  },

  goBack() {
    if (canGoBack(drawerStore.getState())) {
      drawerStore.setState((state) => ({ currentIndex: state.currentIndex - 1 }));
    }
  },

  goForward() {
    if (canGoForward(drawerStore.getState())) {
      drawerStore.setState((state) => ({ currentIndex: state.currentIndex + 1 }));
    }
  },
};

export function useDrawerStore() {
  const state = useStore(drawerStore);
  return {
    ...state,
    currentItem: getCurrentItem(state),
    canGoBack: canGoBack(state),
    canGoForward: canGoForward(state),
    ...drawerActions,
  };
}
