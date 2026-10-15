import { useSyncExternalStore } from 'react';

type Listener = () => void;
type StateUpdate<T> = Partial<T> | ((state: T) => Partial<T>);

export interface Store<T> {
  getState: () => T;
  setState: (update: StateUpdate<T>) => void;
  subscribe: (listener: Listener) => () => void;
}

export function createStore<T extends object>(initialState: T): Store<T> {
  let state = initialState;
  const listeners = new Set<Listener>();

  return {
    getState: () => state,

    setState(update) {
      const patch = typeof update === 'function' ? update(state) : update;
      state = { ...state, ...patch };
      for (const listener of listeners) listener();
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}
