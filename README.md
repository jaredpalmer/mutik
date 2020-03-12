# Mutik

> A tiny (495B) immutable state management library based on Immer

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Quick Start](#quick-start)
  - [Example](#example)
- [API](#api)
  - [`createStore<S>(intialState: S): Store<S>`](#createstoresintialstate-s-stores)
    - [`store`](#store)
  - [`useSelector<S, V>(selector: (s: S) => V)`](#useselectors-vselector-s-s--v)
  - [`<Provider />`](#provider-)
- [Author](#author)
- [Inspiration](#inspiration)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Quick Start

```bash
yarn add mutik
```

### Example

To use Mutik with React, you'll need to install the React and React DOM from the experimental release channel because Mutik uses the recently-merged `useMutableSource` hook internally.

```bash
yarn add react@experimental react-dom@experimental
```

```jsx
import React from 'react';
import { render } from 'react-dom';
import { createStore, Provider, useSelector } from 'mutik';

// Create a lil' store with some state
let store = createStore({
  count: 0,
});

// Pass the store to the Provider.
function App() {
  return (
    <Provider store={store}>
      <div>
        <Label />
        <Buttons />
      </div>
    </Provider>
  );
}

// You can mutate the store from anywhere you want to,
// even outside of React code. Mutate is based on immer.
function increment() {
  store.mutate(state => {
    state.count++;
  });
}

function decrement() {
  store.mutate(state => {
    state.count--;
  });
}

// You don't need to pass it down as props either,
// although you can if you need to.
function Buttons() {
  return (
    <React.Fragment>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </React.Fragment>
  );
}

function Label() {
  // You can subcribe to "slices" of mutable state with useSelector
  // Note: be sure to memoize these with React.useCallback
  const selector = React.useCallback(state => state.count, []);
  const count = useSelector(selector);
  return <p>The count is {count}</p>;
}

render(<App />, window.root);
```

## API

### `createStore<S>(intialState: S): Store<S>`

Create a Mutik `store` given some initial state. The `store` has the following API you can use in or out of React.

#### `store`

| **Method**                                            | **Description**                                                                                                                                 |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `get()`                                               | Get the current state. Do not use this inside of React, you should instead use [`useSelector`](#useselectors-vselector-s-s--v)                  |
| `set(nextState: S): void;`                            | Set state (the entire thing)                                                                                                                    |
| `on(listener: Function): () => void;`                 | Subscribe to store. Pass in a callback function that will be executed on updates. `on()` returns the unsubscribe function for your convenience. |
| `off(listener: Function): void;`                      | Unsubscribe a given listener function                                                                                                           |
| `reset(): void`                                       | Set state back to the `initialState` used when creating the store                                                                               |
| `mutate(updater: (draft: Draft) => void \| S): void;` | Immer-style updater function.                                                                                                                   |

### `useSelector<S, V>(selector: (s: S) => V)`

React hook to subscribe to Mutik state. Must be called underneath a Mutik `Provider`. For performance, it's a good idea to memoize the selector with `React.useCallback`. For example:

```jsx
function Label() {
  const selector = React.useCallback(state => state.count, []);
  const count = useSelector(selector);
  return <p>The count is {count}</p>;
}
```

### `<Provider />`

Mutik context provider. Pass your store as `store` prop. For example:

```jsx
import React from 'react';
import { createStore, Provider } from 'mutik';

// Create a lil' store with some state
let store = createStore({
  count: 0,
});

// Pass the store to the Provider.
function App() {
  return (
    <Provider store={store}>
      <div>{/* ... stuff */}</div>
    </Provider>
  );
}
```

## Author

- Jared Palmer [@jaredpalmer](https://twitter.com/jaredpalmer)

## Inspiration

- [bey](https://gitub.com/jamiebuilds/bey)
- [react-copy-write](https://github.com/aweary/react-copy-write)
- [Brian Vaughn's fake redux](https://codesandbox.io/s/react-redux-usemutablesource-eyxoe)

---

> MIT License
