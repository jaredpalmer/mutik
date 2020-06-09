[Home](../index.md) &gt; [Provider](./provider_1.md)

# Function Provider()

Mutik context provider.

Pass your store as a prop. It shares the store (really now a MutableSource wrapper) with components below in the tree that read from the store.

<b>Signature:</b>

```typescript
function Provider<S>({ children, store }: ProviderProps<S>): React.FunctionComponentElement<React.ProviderProps<Store<unknown>>>;
```

## Example


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
      <div />
    </Provider>
  );
}

```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  { children, store } | `ProviderProps<S>` |  |

<b>Returns:</b>

`React.FunctionComponentElement<React.ProviderProps<Store<unknown>>>`

