# SimpleState

SimpleState is a very simple state managmnet tool.

## Setup
To start you'll need to create a new simple state, by calling `new SimpleState(initialState, setter)` where setter is a function
called when the state changes, which has only one argument `state`. An example usage would look like...
```javascript
const simple = new SimpleState({
	count: 0
}, (state) => {
  // Do something like setState here to bind the simplestate object to a components state.
});
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
simple.onIncrement((state) => {
  console.log('Increment incremented state!', state);
});
```