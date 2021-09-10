import immer, { Draft } from 'immer';
import { useSyncExternalStoreExtra as useSyncExternalStore } from 'use-sync-external-store/extra';

type Listener = Function;

type UpdaterFn<State> = (prevState: State) => State;

export interface Store<State> {
  get(): State;
  set(nextState: State): void;
  set(updater: UpdaterFn<State>): void;
  on(listener: Listener): () => void;
  off(listener: Listener): void;
  reset(): void;
  mutate(updater: (draft: Draft<State>) => void | State): void;
}

export function createStore<State>(initialState: State) {
  let listeners: Listener[] = [];
  let currentState = initialState;
  const store = {
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
  };

  function useStore<DerivedValue>(
    selector: (state: State) => DerivedValue = state =>
      (state as unknown) as DerivedValue
  ) {
    const selection = useSyncExternalStore(store.on, store.get, selector);
    return selection;
  }

  return [store, useStore] as const;
}
