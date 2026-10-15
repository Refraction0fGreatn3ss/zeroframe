/**
 * Universal Context Drawer Store
 * Enables one-click pivots across IPs, Assets, Users, Detectors, Sensors, and Evidence
 * without destroying the analyst's current investigation context.
 * Maintains full Back / Forward investigation history trail.
 */

import { useState, useEffect } from 'react';

export type ContextType = 'IP' | 'ASSET' | 'USER' | 'DETECTOR' | 'SENSOR' | 'EVIDENCE' | 'MITRE' | 'TRUTH_PROOF';

export interface ContextItem {
  type: ContextType;
  id: string;
  title: string;
  subtitle?: string;
  data?: any;
}

interface ContextDrawerState {
  isOpen: boolean;
  history: ContextItem[];
  currentIndex: number;
}

let drawerGlobalState: ContextDrawerState = {
  isOpen: false,
  history: [],
  currentIndex: -1,
};

const listeners = new Set<(state: ContextDrawerState) => void>();

function notify() {
  listeners.forEach((l) => l({ ...drawerGlobalState }));
}

export function useDrawerStore() {
  const [state, setState] = useState<ContextDrawerState>(drawerGlobalState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const openContext = (item: ContextItem) => {
    // If opening a new item, truncate any forward history
    const newHistory = drawerGlobalState.history.slice(0, drawerGlobalState.currentIndex + 1);
    newHistory.push(item);

    drawerGlobalState = {
      isOpen: true,
      history: newHistory,
      currentIndex: newHistory.length - 1,
    };
    notify();
  };

  const closeDrawer = () => {
    drawerGlobalState = {
      ...drawerGlobalState,
      isOpen: false,
    };
    notify();
  };

  const goBack = () => {
    if (drawerGlobalState.currentIndex > 0) {
      drawerGlobalState = {
        ...drawerGlobalState,
        currentIndex: drawerGlobalState.currentIndex - 1,
      };
      notify();
    }
  };

  const goForward = () => {
    if (drawerGlobalState.currentIndex < drawerGlobalState.history.length - 1) {
      drawerGlobalState = {
        ...drawerGlobalState,
        currentIndex: drawerGlobalState.currentIndex + 1,
      };
      notify();
    }
  };

  const currentItem = drawerGlobalState.currentIndex >= 0
    ? drawerGlobalState.history[drawerGlobalState.currentIndex]
    : null;

  const canGoBack = drawerGlobalState.currentIndex > 0;
  const canGoForward = drawerGlobalState.currentIndex < drawerGlobalState.history.length - 1;

  return {
    ...state,
    currentItem,
    canGoBack,
    canGoForward,
    openContext,
    closeDrawer,
    goBack,
    goForward,
  };
}
