import * as React from 'react';
import immer, { Draft } from 'immer';

type Listener = Function;

type UpdaterFn<S> = (prevState: S) => S;

export interface Store<S> {
  get(): S;
  set(nextState: S): void;
  set(updater: UpdaterFn<S>): void;
  on(listener: Function): () => void;
  off(listener: Function): void;
  reset(): void;
  mutate(updater: (draft: Draft<S>) => void | S): void;
}

export function createStore<S>(initialState: S): Store<S> {
  let listeners: Listener[] = [];
  let currentState = initialState;
  return {
    get() {
      return currentState;
    },
    set(nextState: S | UpdaterFn<S>) {
      currentState =
        typeof nextState === 'function'
          ? (nextState as UpdaterFn<S>)(currentState)
          : nextState;
      listeners.forEach(listener => listener());
    },
    on(listener: Listener) {
      listeners.push(listener);
      return () => this.off(listener);
    },
    off(listener: Listener) {
      listeners = listeners.filter(fn => fn !== listener);
    },
    reset() {
      this.set(initialState);
    },
    mutate(updater: (draft: Draft<S>) => void | S) {
      let currState = this.get();
      let nextState = immer(currState, updater);
      if (nextState !== currState) this.set(nextState as S);
    },
  };
}

// Because the state is immutable,
// it can be used as the "version".
function getStoreVersion<S>(store: Store<S>) {
  return store.get();
}

// Subscribe is simple in the case of Mutik.
// Since it does not require any seletor-specific logic,
// it can be declared in module scope.
function subscribe<S>(store: Store<S>, callback: Listener) {
  return store.on(callback);
}

const MutableSourceContext = React.createContext<Store<unknown>>(null as any);

// This mimics the current Redux <Provider> API.
// It shares the store (really now a MutableSource wrapper)
// with components below in the tree that read from the store.
export function Provider<S>({
  children,
  store,
}: {
  children: React.ReactNode;
  store: Store<S>;
}) {
  const mutableSource = React.useMemo(() => {
    // Wrap the Mutik store in a MutableSource object.
    // The useMutableSource() hook works with this type of object.
    return (React as any).unstable_createMutableSource(store, getStoreVersion);
  }, [store]);

  return React.createElement(
    MutableSourceContext.Provider,
    { value: mutableSource },
    children
  );
}

// It requires a selector and returns a derived store value.
export function useSelector<S, V>(selector: (s: S) => V): V {
  const mutableSource = React.useContext(MutableSourceContext);
  // Pass the store state to user selector:
  const getSnapshot = React.useCallback(store => selector(store.get()), [
    selector,
  ]);

  return (React as any).unstable_useMutableSource(
    mutableSource,
    getSnapshot,
    subscribe
  );
}
