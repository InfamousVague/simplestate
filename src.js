const _change = Symbol('change');

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
    this.reducer = function() { return this.state; };
  }

  /**
  * Set reducers.
  * @param {function} reducers - The function containing reducers.
  */
  reducers(reducers) {
    this.reducer = function(action, name) {
      this.state = reducers.call(this, {
        ...action,
        type: name,
      });

      this[_change](name);
    };
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
  [_change](action) {
    this.listeners[action].map(f => f(this.state));
    this.listeners['*'].map(f => f(this.state));

    this.setter(this);
  }

  /**
  * Create a new action / reducer.
  * @param {string} action - The actions name.
  * @param {function} reducer - The actions associated reducer (must return state).
  */
  create(name, action) {
    this.listeners[name] = [];

    this[name] = function() {
      this.reducer = this.reducer.bind(this);
      this.reducer(action.apply(this, arguments), name);
    };

    const sugar = `on${name.charAt(0).toUpperCase() + name.slice(1)}`;
    this[sugar] = l => this.listeners[name] = [...this.listeners[name], l];
  }
}
