import isObject from 'is-plain-object'

function deepMerge (target, source) {
  if (!isObject(target) || !isObject(source)) {
    return source
  }
  const destination = {}
  for (const key in source) {
    if (target[key]) {
      destination[key] = deepMerge(target[key], source[key])
    } else {
      destination[key] = source[key]
    }
  }
  for (const key in target) {
    if (key in destination) {
      continue
    }
    destination[key] = target[key]
  }
  return destination
}

function createObjectByPath ([head, ...tail], value) {
  if (!head) {
    return value
  }
  return {
    [head]: createObjectByPath(tail, value)
  }
}

function path ([head, ...tail], object) {
  if (!head) {
    return object
  }
  return path(tail, object[head])
}

export default (h, Component, createContext) => (initialSpecification = {}) => {
  const State = createContext({})

  let update
  function wireSpecification (that, scope, specification) {
    const actions = {}
    for (const key in specification) {
      const value = specification[key]
      if (typeof value === 'function') {
        actions[key] = (...parameters) => {
          const state = path(['state', ...scope], that)
          Promise.resolve(value(state, ...parameters))
            .then((partial) => {
              if (partial === undefined || partial === {}) {
                return
              }

              update(createObjectByPath(scope, wireSpecification(that, scope, partial)))
            })
        }
      }
    }
    return Object.assign({}, specification, actions)
  }

  const preAddedStates = []
  let that
  class StateProvider extends Component {
    constructor (props) {
      super(props)

      that = this
      update = (partial) => {
        const nextState = deepMerge(this.state, partial)
        this.setState(nextState)
      }
      this.state = wireSpecification(this, [], initialSpecification)
    }

    componentWillMount () {
      preAddedStates.forEach(({scope, specification}) => {
        update(createObjectByPath(scope, wireSpecification(this, scope, specification)))
      })
    }

    render () {
      return h(State.Provider, {
        value: this.state
      }, this.props.children)
    }
  }

  return {
    StateProvider,
    GlobalState: State.Consumer,
    addState (name, specification) {
      const scope = name.split('.')
      if (update) {
        update(createObjectByPath(scope, wireSpecification(that, scope, specification)))
      } else {
        preAddedStates.push({scope, specification})
      }
      return ({children, render}) => {
        const closure = typeof children === 'function'
          ? children
          : children[0] || render
        if (!closure) {
          return
        }
        return h(State.Consumer, {}, (state) => closure(path(scope, state)))
      }
    }
  }
}
