'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Class representing a SimpleState. */
var _class = function () {
  /**
  * Create a state container.
  * @param {object} state - The inital state.
  * @param {function} setter - The function used to bind state to external tool.
  */
  function _class(state, setter) {
    _classCallCheck(this, _class);

    this.state = state;
    this.setter = setter || function () {/*noop*/};
    this.listeners = _defineProperty({}, '*', []);
    this.reserved = [].concat(_toConsumableArray(Object.keys(this)), ['reserved']);
  }

  /**
  * Subscribe to all changes.
  * @param {function} er - The function to call on events.
  */


  _createClass(_class, [{
    key: 'subscribe',
    value: function subscribe(er) {
      this.listeners['*'].push(er);
    }

    /**
    * Trigger a change to the state.
    * @param {string} action - The action which triggered the change.
    */

  }, {
    key: 'change',
    value: function change(action) {
      var _this = this;

      this.listeners[action].map(function (f) {
        return f(_this.state);
      });
      this.listeners['*'].map(function (f) {
        return f(_this.state);
      });

      var actions = Object.assign({}, this);
      this.reserved.map(function (key) {
        return delete actions[key];
      });

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

  }, {
    key: 'create',
    value: function create(action, reducer) {
      var _this2 = this;

      this.listeners[action] = [];

      this[action] = function () {
        this.state = reducer.apply(this, arguments);
        this.change(action);
      };

      var sugar = 'on' + (action.charAt(0).toUpperCase() + action.slice(1));
      this[sugar] = function (cb) {
        return _this2.listeners[action] = [].concat(_toConsumableArray(_this2.listeners[action]), [cb]);
      };

      this.change(action);
    }
  }]);

  return _class;
}();

exports.default = _class;