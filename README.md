# SimpleState

SimpleState is an easy to use state managment tool complete with actions, reducers, and more. Best of all there is minimal boilerplating needed!

## Setup
To start you'll need to create a new simple state, by calling `new SimpleState(initialState, setter)` where setter is a function
called when the state changes, which has only one argument `state`. An example usage would look like...

### Inital setup with no bindings

```javascript
const simple = new SimpleState({
	count: 0
}, (state) => console.log('internal state exposed here', state));
```

## Actions

### Creating an action
You create an action using `simple.create(name, action)`, the action should be a function that returns any information needed by your reducer. (don't worry about defining type, this is done for you and will be equal to the string value of the actions name).

```javascript
simple.create('increment', function(incrementBy) {
  return {
    value: this.state.count + incrementBy,
  };
});
```
If your action doesn't require arguments, you can omit the function.
```javascript
simple.create('showMeWhatYouGot');
```

## Reducers

### Creating your reducers
Your reducers will be a function that returns the previous state plus any modifications you've done. As mentioned above type will be equal to the string value of the action you're reducing on.

```javascript
simple.reducers(function(action) {
  switch (action.type) {
    case 'increment':
      return {
        ...this.state,
        count: action.value,
      };
      break;

    default:
      break;
  }
});
```

### Using an action
Using an action is simple, simply call the action and provide any arguments needed for that actions reducer.

```javascript
simple.increment(5);
```

Chaining is also supported.
```javascript
simple.increment(5).someOtherAction();
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

## Complete example

```javascript
const simple = new SimpleState({ count: 0 });

simple.reducers(function(action) {
  switch (action.type) {
    case 'increment':
      return {
        ...this.state,
        count: action.value,
      };
      break;

    default:
      break;
  }
});

simple.create('increment', function(incrementBy) {
  return {
    value: this.state.count + incrementBy,
  };
});

simple.onIncrement(state => console.log('incremented', state));

simple.increment(5);
```


### That's it! The source is also tiny, if you'd like to skim through it [click here.](https://gitlab.com/wski/SimpleState/blob/master/src.js)

# Extras

## Bind state to localstorage for persistance

```javascript
const simple = new SimpleState(function() {
  return (localStorage.getItem('simplestate-state') === null) ?
    { count: 0 } : JSON.parse(localStorage.getItem('simplestate-state'));
}, simple => localStorage.setItem('simplestate-state', JSON.stringify(simple.state)));
```

### Binding to React State

```javascript
constructor(props) {
  super(props);

  this.state = {
    simple: new SimpleState({
      // Inital State
      account: false,
    }, simple => this.setState({ simple, })),
  };
}
```