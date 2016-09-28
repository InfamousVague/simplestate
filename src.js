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
    this.listeners = {};
    this.reserved = [...Object.keys(this), 'reserved'];
  }

 	/**
  * Trigger a change to the state.
  * @param {string} action - The action which triggered the change.
  */
  change(action) {
  	if (this.listeners[action])
    	this.listeners[action].map(f => f(this.state));

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
    this[action] = function() {
    	this.state = reducer.apply(this, arguments);
      this.change(action);
    };

    this[`on${action.charAt(0).toUpperCase() + action.slice(1)}`] = function(cb) {
    	this.listeners[action] = (this.listeners[action]) ?
      	[...this.listeners[action], cb] : [cb];
    }

    this.change(action);
  }
}