import { Draft } from 'immer';

/**
 * Callback listener
 *
 * @public
 */
export type Listener = () => void;

/**
 * Mutik updater function
 *
 * @public
 */
export type UpdaterFn<State> = (prevState: State) => State;

/**
 * Mutik Store
 *
 * @public
 */
export interface Store<State> {
  /**
   * Get the current state. Do not use this inside of React, you should
   * instead use {@link useSelector}
   *
   * @public
   */
  get(): State;

  /**
   * Set state. This can either take a new value or and updater function (just like `React.useState`'s updater)
   *
   * @public
   */
  set(nextState: State): void;

  /**
   * Set state. This can either take a new value or and updater function (just like `React.useState`'s updater)
   *
   * @public
   */
  set(updater: UpdaterFn<State>): void;

  /**
   * Subscribe to store. Pass in a callback function that will be executed on updates. on() returns the unsubscribe function for your convenience.
   *
   * @public
   */
  on(listener: Listener): () => void;

  /**
   * Unsubscribe a given listener function
   *
   * @public
   */
  off(listener: Listener): void;

  /**
   * Set state back to the initialState used when creating the store
   *
   * @public
   */
  reset(): void;

  /**
   * Immer-style updater function.
   *
   * @public
   */
  mutate(updater: (draft: Draft<State>) => void | State): void;
}
