[Home](./index.md)

# mutik

A tiny (495B) immutable state management library based on Immer

Quick Start

```bash
yarn add mutik

```
or

[Edit on Codesandbox](https://codesandbox.io/s/mutik-2so66?fontsize=14&hidenavigation=1&theme=dark)

## Example

To use Mutik with React, you'll need to install React and React DOM from the experimental release channel because Mutik uses the recently-merged `useMutableSource` hook internally.

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

// Or you can update it like `React.useState`'s update
function decrement() {
  store.set(prevState => ({
    ...state,
    count: state.count - 1
  });
}

// You don't need to pass the store down as a prop either
function Buttons() {
  return (
    <React.Fragment>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </React.Fragment>
  );
}

// Lastly, you can subcribe to "slices" of state with `useSelector`
// Note: be sure to memoize these with `React.useCallback` if you need to select based on props
function Label() {
  const selector = React.useCallback(state => state.count, []);
  const count = useSelector(selector);
  return <p>The count is {count}</p>;
}

render(<App />, window.root);

```

## Functions

|  Function | Description |
|  --- | --- |
|  [createStore(initialState)](./variables/createstore_1.md) | Create a Mutik `store` given some initial state. The `store` can be used in or out of React. |
|  [Provider({ children, store })](./variables/provider_1.md) | Mutik context provider. |
|  [useSelector(selector)](./variables/useselector_1.md) | React hook to subscribe to Mutik state. Must be called underneath a Mutik [Provider()](./variables/provider_1.md)<!-- -->. |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [ProviderProps](./interfaces/providerprops.md) | Mutik Provider component props. |
|  [Store](./interfaces/store.md) | Mutik Store |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [Listener](./types/listener.md) | Callback listener |
|  [UpdaterFn](./types/updaterfn.md) | Mutik updater function |

