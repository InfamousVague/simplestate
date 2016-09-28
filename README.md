# SimpleState

SimpleState is an easy to use state managment tool complete with actions, reducers, and more. Best of all there is little to no boilerplating needed!

## Setup
To start you'll need to create a new simple state, by calling `new SimpleState(initialState, setter)` where setter is a function
called when the state changes, which has only one argument `state`. An example usage would look like...
### Inital setup with no bindings
```javascript
const simple = new SimpleState({
	count: 0
}, (state) => console.log('internal state exposed here', state));
```

### Binding to React State
```javascript
componentWillMount() {
  const simple = new SimpleState({
    count: 0,
  }, (state) => this.setState({ simple: state }));
}
```

## Actions

### Creating an action
You create an action using `simple.create(name, action)`, the action should be a function that returns a modified state as shown below. SimpleState's internal state is bound to your action (using this.state).
```javascript
simple.create('increment', function(incrementBy) {
  return {
    ...this.state,
    count: this.state.count + incrementBy
  };
});
```

### Using an action
Using an action is simple, simply call the action and provide any arguments needed for that actions reducer.
```javascript
simple.increment(5);
```

### Listening to an action
Listening to an action is simple as well, simply call the on method and provide the actions name, as well as a callback.
```javascript
simple.onIncrement((state) => console.log('Increment incremented!', state));
```

You can also listen to all changes with `subscribe`
```javascript
simple.subscribe((state) => console.log('Internal state changed!', state));
```

### Complete Source
```javascript
/** Class representing a SimpleState. */
export default class {
  /**
  * Create a state container.
  * @param {object} state - The inital state.
  * @param {function} setter - The function used to bind state to external tool.
  */
  constructor(state, setter) {
    this.state = state;
    this.setter = setter || function() {/*noop*/};
    this.listeners = { ['*']: [] };
    this.reserved = [...Object.keys(this), 'reserved'];
  }

  /**
  * Subscribe to all changes.
  * @param {function} er - The function to call on events.
  */
  subscribe(er) {
    this.listeners['*'].push(er);
  }

 	/**
  * Trigger a change to the state.
  * @param {string} action - The action which triggered the change.
  */
  change(action) {
    this.listeners[action].map(f => f(this.state));
    this.listeners['*'].map(f => f(this.state));

    const actions = Object.assign({}, this);
    this.reserved.map(key => delete actions[key]);

    this.setter({
      state: this.state,
      actions: actions
    });
  }

  /**
  * Create a new action / reducer.
  * @param {string} action - The actions name.
  * @param {function} reducer - The actions associated reducer (must return state).
  */
  create(action, reducer) {
    this.listeners[action] = [];

    this[action] = function() {
      this.state = reducer.apply(this, arguments);
      this.change(action);
    };

    const sugar = `on${action.charAt(0).toUpperCase() + action.slice(1)}`;
    this[sugar] = cb => this.listeners[action] = [...this.listeners[action], cb];

    this.change(action);
  }
}
```