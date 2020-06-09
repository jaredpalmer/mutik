import * as React from 'react';
import immer, { Draft } from 'immer';
import { Store, Listener, UpdaterFn } from './types';

/**
 * Create a Mutik `store` given some initial state. The `store` can be used in or out of React.
 *
 * @typeParam State - The type of state to be stored in Mutik
 * @param initialState - Initial store state
 * @returns Mutik store
 * @public
 */
export function createStore<State>(initialState: State) {
  let listeners: Listener[] = [];
  let currentState = initialState;
  return {
    get() {
      return currentState;
    },
    set(nextState: State | UpdaterFn<State>) {
      currentState =
        typeof nextState === 'function'
          ? (nextState as UpdaterFn<State>)(currentState)
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
    mutate(updater: (draft: Draft<State>) => void | State) {
      let currState = this.get();
      let nextState = immer(currState, updater);
      if (nextState !== currState) this.set(nextState as State);
    },
  } as Store<State>;
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

/**
 * @public
 */
export interface ProviderProps<State> {
  /**
   * React children
   */
  children: React.ReactNode;
  /**
   * Mutik store
   */
  store: Store<State>;
}

/**
 * Mutik context provider.
 *
 * @remarks
 * Pass your store as a prop. It shares the store
 * (really now a MutableSource wrapper)
 * with components below in the tree that read from the store.
 *
 *
 * @example
 * ```jsx
 * import React from 'react';
 * import { createStore, Provider } from 'mutik';
 *
 * // Create a lil' store with some state
 * let store = createStore({
 *   count: 0,
 * });
 *
 * // Pass the store to the Provider.
 * function App() {
 *   return (
 *     <Provider store={store}>
 *       <div />
 *     </Provider>
 *   );
 * }
 * ```
 *
 * @public
 */
export function Provider<S>({ children, store }: ProviderProps<S>) {
  const mutableSource = React.useMemo(() => {
    // Wrap the Mutik store in a MutableSource object.
    // The useMutableSource() hook works with this type of object.
    return (React as any).createMutableSource(store, getStoreVersion);
  }, [store]);

  return React.createElement(
    MutableSourceContext.Provider,
    { value: mutableSource },
    children
  );
}

/**
 * React hook to subscribe to Mutik state. Must be called underneath a Mutik {@link Provider}.
 *
 * @typeParam State - The type of Mutik state
 * @typeParam Value - The type of the value returned by the selector function
 *
 * @param selector - A selector function
 * @returns The slice of Mutik state
 *
 * @example
 * ```jsx
 * const selector = state => state.count;
 *
 * function Label() {
 *   const count = useSelector(selector);
 *   return <p>The count is {count}</p>;
 * }
 * ```
 *
 * @example
 * ```jsx
 * function User({ id }) {
 *   const selector = React.useCallback(state => state.users[id], [id]);
 *   const user = useSelector(selector);
 *   return <p>The username is {user.name}</p>;
 * }
 * ```
 *
 * @public
 */
export function useSelector<State, Value>(selector: (s: State) => Value) {
  const mutableSource = React.useContext(MutableSourceContext);
  // Pass the store state to user selector:
  const getSnapshot = React.useCallback(store => selector(store.get()), [
    selector,
  ]);

  return (React as any).useMutableSource(mutableSource, getSnapshot, subscribe);
}
