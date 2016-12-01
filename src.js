const _change = Symbol('change');
const _socket = Symbol('socket');
const _listeners = Symbol('listeners');
const _reducers = Symbol('reducers');

/** Class representing a SimpleState. */
export default class {
  /**
   * Create a state container.
   * @param {object} state - The inital state.
   * @param {function} socket - The function used to bind state to external tool.
   */
  constructor(state) {
    this.state = state;
    this[_socket] = socket || function() {};
    this[_listeners] = { ['*']: [] };
    this[_reducers] = () => this.state;
  }

  /**
   * Connect to internal state.
   * @param {function} socket - The function to send state to.
   */

  connect(socket) {
    this[_socket] = socket;
    return this;
  }

  /**
   * Set reducers.
   * @param {function} reducers - The function containing reducers.
   */
  reducers(reducers) {
    this[_reducers] = function(action, type) {
      this.state = reducers.call(this, {
        ...action,
        type,
      });

      this[_change](type);
    };
  }

  /**
   * Subscribe to all changes.
   * @param {function} er - The function to call on events.
   */
  subscribe(er) {
    this[_listeners]['*'].push(er);
  }

  /**
   * Trigger a change to the state.
   * @param {string} action - The action which triggered the change.
   */
  [_change](action) {
    this[_listeners][action].map(f => f(this.state));
    this[_listeners]['*'].map(f => f(this.state));

    // Prevent mutation of reducers and actions after first action is called.
    const clensed = Object.assign({}, this);
    delete clensed.create;
    delete clensed.reducers;

    this[_socket](clensed);
  }

  /**
   * Create a new action / reducer.
   * @param {string} action - The actions name.
   * @param {function} reducer - The actions associated reducer (must return state).
   */
  create(name, action) {
    this[_listeners][name] = [];

    this[name] = function() {
      this[_reducers] = this[_reducers].bind(this);
      this[_reducers]((action) ? action.apply(
        this, arguments) : () => {},
        name,
      );

      return this;
    }

    const sugar = `on${name.charAt(0).toUpperCase() + name.slice(1)}`;
    this[sugar] = l => this[_listeners][name] = [...this[_listeners][name], l];
  }
}
