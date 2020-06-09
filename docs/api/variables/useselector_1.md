[Home](../index.md) &gt; [useSelector](./useselector_1.md)

# Function useSelector()

React hook to subscribe to Mutik state. Must be called underneath a Mutik [Provider()](./provider_1.md)<!-- -->.

<b>Signature:</b>

```typescript
function useSelector<State, Value>(selector: (s: State) => Value): Value;
```

## Example 1


```jsx
const selector = state => state.count;

function Label() {
  const count = useSelector(selector);
  return <p>The count is {count}</p>;
}

```

## Example 2

You can use props with Mutik selector. For performance, it is a good idea to memoize the selector with `React.useCallback`<!-- -->. For example:

```jsx
function User({ id }) {
  const selector = React.useCallback(state => state.users[id], [id]);
  const user = useSelector(selector);
  return <p>The username is {user.name}</p>;
}

```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  selector | `(s: State) => Value` | A selector function |

<b>Returns:</b>

`Value`

The slice of Mutik state

