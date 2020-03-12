import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, createStore, useSelector, Store } from '../.';

export interface State {
  count: number;
}
export const store = createStore<State>({
  count: 0,
});

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <Label />
        <Buttons store={store} />
        <ResetButton />
      </div>
    </Provider>
  );
};

function Label() {
  // Since our Mutik state is just the  { count } itself,
  // our selector is very simple!
  const selector = React.useCallback(state => state.count, []);
  const count = useSelector(selector);
  return <p>The count is {count}</p>;
}

function Buttons({ store }: { store: Store<State> }) {
  function increment() {
    store.set(state => ({
      ...state,
      count: state.count + 1,
    }));
  }

  function decrement() {
    store.mutate(state => {
      state.count--;
    });
  }
  return (
    <>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </>
  );
}

function ResetButton() {
  // Notice how `store` isn't a prop? This still updates because the
  // selector in Label is wired into the mutable store. #justtheviewlayer
  return <button onClick={() => store.reset()}>Reset</button>;
}

// Simlarly, this works too!
setInterval(() => {
  store.mutate(state => {
    state.count++;
  });
}, 3000);

ReactDOM.render(<App />, document.getElementById('root'));
