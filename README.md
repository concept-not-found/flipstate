# <img src="https://cdn.rawgit.com/concept-not-found/flipstate/0a018d3d/logo/mono-black.svg" width="486" height="198"/>

*Flip to any state*

React v16.3 Context API solved prop drilling but produced a huge unmanagable state tree. `flipstate` solves this by decomposing `Context.Provider` into smaller state. Easily manage state per component, but keep the power of having all the state in a single place.

Getting started
---------------
Here is a simple counter application.
```js
import React from 'react'
import {render} from 'react-dom'
import createState from 'flipstate'

const {
  StateProvider,
  GlobalState,
  addState
} = createState()

const CounterState = addState('Counter', {
  count: 0,
  increment({count}, amount) {
    return {
      count: count + amount
    }
  },
  decrement({count}, amount) {
    return {
      count: count - amount
    }
  }
})
const Counter = () =>
  <CounterState>{({count, increment, decrement}) =>
    <>
      <p>count: {count}</p>
      <button onClick={() => increment(1)}>+</button>
      <button onClick={() => decrement(1)}>-</button>
    </>
  }</CounterState>

render(<StateProvider>
  <Counter/>
</StateProvider>, document.getElementById('entry'))
```

Highlights
----------
 * added state are just render prop components
 * `StateProvider` is the Context API provider and works in the same way. Only state components that are decendents of `StateProvider` will receive updates (but don't need to be direct children)
 * modules can export state for others to consume. Think `AuthState` that updates when user logins.
 * compose states from multiple components using https://github.com/gnapse/render-props-compose
 * state is composed of data + actions
 * actions return an update to merge into the state
 * actions can be `async`
 * read state `value` directly off state components and call `delete` to remove itself (make sure it is actually no longer used or else `undefined` will be rendered)
 * use dynamic import to code split new data/actions/state/components
 * supports preact, just import 'flipstate/preact'. Requires https://github.com/valotas/preact-context

Devtool
-------
`flipstate` devtool delivers on the promise of "Flip to any state".

### [Try demo](https://concept-not-found.github.io/flipstate-devtool/iframe/https%3A%2F%2Fconcept-not-found.github.io%2Fflipstate-samples%2Fcomposed-state%2F)

You can run the devtool locally https://github.com/concept-not-found/flipstate-devtool or use the hosted version https://concept-not-found.github.io/flipstate-devtool/

Samples
-------
 * [Composed state](https://codesandbox.io/s/zwkxqj1xnm)
 * [Counter](https://codesandbox.io/s/rro76qy63m)
 * [Dyanmic counters](https://codesandbox.io/s/43ykljoy37)
 * [Code splitting](https://codesandbox.io/s/pwk9kwl2nm)
 * [Blog site](https://codesandbox.io/s/52rm8lovv4)
