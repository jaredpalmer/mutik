# mutik

A tiny (495B) immutable state management library based on Immer

## Quick Start

```bash
yarn add mutik
```

To use Mutik with React, you'll need to install the React and React DOM from the experimental release channel because Mutik uses the recently-merged `useMutableSource` hook internally.

**Requirements** 
```bash
yarn add react@experimental react-dom@experimental
```

### Example

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
    <>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </>
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

- `get()` - Get the current state. Do not use this inside of React, you should instead use `useSelector`
- `set(nextState: S): void;` - Set state (the entire thing)
- `on(listener: Function): () => void;` - Subscribe to store. Pass in a callback function that will be executed on updates. `on()` returns the unsubscribe function for your convenience.
- off(listener: Function): void; - Unsubscribe a givien listener
- `reset(): void` - Set state back to the `initialState` used when creating the store
- `mutate(updater: (draft: Draft<S>) => void | S): void;` - `immer`-style updater function.

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
