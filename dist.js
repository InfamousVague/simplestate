'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _change = Symbol('change');
var _setter = Symbol('setter');
var _listeners = Symbol('listeners');
var _reducers = Symbol('reducers');

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
    this[_setter] = setter || function () {/*noop*/};
    this[_listeners] = _defineProperty({}, '*', []);
    this[_reducers] = function () {
      return this.state;
    };
  }

  /**
  * Set reducers.
  * @param {function} reducers - The function containing reducers.
  */


  _createClass(_class, [{
    key: 'reducers',
    value: function reducers(_reducers2) {
      this[_reducers] = function (action, name) {
        this.state = _reducers2.call(this, _extends({}, action, {
          type: name
        }));

        this[_change](name);
      };
    }

    /**
    * Subscribe to all changes.
    * @param {function} er - The function to call on events.
    */

  }, {
    key: 'subscribe',
    value: function subscribe(er) {
      this[_listeners]['*'].push(er);
    }

    /**
    * Trigger a change to the state.
    * @param {string} action - The action which triggered the change.
    */

  }, {
    key: _change,
    value: function value(action) {
      var _this = this;

      this[_listeners][action].map(function (f) {
        return f(_this.state);
      });
      this[_listeners]['*'].map(function (f) {
        return f(_this.state);
      });

      // Prevent mutation of reducers and actions after first action is called.
      var clensed = Object.assign({}, this);
      delete clensed.create;
      delete clensed.reducers;

      this[_setter](clensed);
    }

    /**
    * Create a new action / reducer.
    * @param {string} action - The actions name.
    * @param {function} reducer - The actions associated reducer (must return state).
    */

  }, {
    key: 'create',
    value: function create(name, action) {
      var _this2 = this;

      this[_listeners][name] = [];

      this[name] = function () {
        this[_reducers] = this[_reducers].bind(this);
        this[_reducers](action.apply(this, arguments), name);
      };

      var sugar = 'on' + (name.charAt(0).toUpperCase() + name.slice(1));
      this[sugar] = function (l) {
        return _this2[_listeners][name] = [].concat(_toConsumableArray(_this2[_listeners][name]), [l]);
      };
    }
  }]);

  return _class;
}();

exports.default = _class;