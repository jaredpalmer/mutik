[Home](../index.md) &gt; [Store](./store.md)

# Interface Store

Mutik Store

<b>Signature:</b>

```typescript
interface Store<State> 
```

## Methods

|  Method | Description |
|  --- | --- |
|  [get()](./store.md#get-method-1) | Get the current state. Do not use this inside of React, you should instead use [useSelector()](../variables/useselector_1.md) |
|  [mutate(updater)](./store.md#mutate-method-1) | Immer-style updater function. |
|  [off(listener)](./store.md#off-method-1) | Unsubscribe a given listener function |
|  [on(listener)](./store.md#on-method-1) | Subscribe to store. Pass in a callback function that will be executed on updates. on() returns the unsubscribe function for your convenience. |
|  [reset()](./store.md#reset-method-1) | Set state back to the initialState used when creating the store |
|  [set(nextState)](./store.md#set-method-1) | Set state. This can either take a new value or and updater function (just like `React.useState`<!-- -->'s updater) |
|  [set(updater)](./store.md#set-method-2) | Set state. This can either take a new value or and updater function (just like `React.useState`<!-- -->'s updater) |

## Method Details

<a id="get-method-1"></a>

### get()

Get the current state. Do not use this inside of React, you should instead use [useSelector()](../variables/useselector_1.md)

<b>Signature:</b>

```typescript
get(): State;
```
<b>Returns:</b>

`State`

<a id="mutate-method-1"></a>

### mutate(updater)

Immer-style updater function.

<b>Signature:</b>

```typescript
mutate(updater: (draft: Draft<State>) => void | State): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  updater | `(draft: Draft<State>) => void \| State` |  |

<b>Returns:</b>

`void`

<a id="off-method-1"></a>

### off(listener)

Unsubscribe a given listener function

<b>Signature:</b>

```typescript
off(listener: Listener): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  listener | [Listener](../types/listener.md) |  |

<b>Returns:</b>

`void`

<a id="on-method-1"></a>

### on(listener)

Subscribe to store. Pass in a callback function that will be executed on updates. on() returns the unsubscribe function for your convenience.

<b>Signature:</b>

```typescript
on(listener: Listener): () => void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  listener | [Listener](../types/listener.md) |  |

<b>Returns:</b>

`() => void`

<a id="reset-method-1"></a>

### reset()

Set state back to the initialState used when creating the store

<b>Signature:</b>

```typescript
reset(): void;
```
<b>Returns:</b>

`void`

<a id="set-method-1"></a>

### set(nextState)

Set state. This can either take a new value or and updater function (just like `React.useState`<!-- -->'s updater)

<b>Signature:</b>

```typescript
set(nextState: State): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  nextState | `State` |  |

<b>Returns:</b>

`void`

<a id="set-method-2"></a>

### set(updater)

Set state. This can either take a new value or and updater function (just like `React.useState`<!-- -->'s updater)

<b>Signature:</b>

```typescript
set(updater: UpdaterFn<State>): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  updater | `UpdaterFn<State>` |  |

<b>Returns:</b>

`void`

