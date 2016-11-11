'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Context = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _models = require('./models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* The core class for creating context.
*/

var Context = exports.Context = function () {

  /*
  * Class constructor.
  */

  function Context() {
    var _this = this;

    var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Context);

    var _loop = function _loop(name) {
      _this.defineProperty(name, {
        get: function get() {
          return context[name];
        },
        enumerable: true
      });
    };

    for (var name in context) {
      _loop(name);
    }
  }

  /*
  * Defines a new property directly on the context object.
  */

  (0, _createClass3.default)(Context, [{
    key: 'defineProperty',
    value: function defineProperty(name, descriptor) {
      Object.defineProperty(this, name, descriptor);

      return this[name];
    }

    /*
    * Creates a new Model class and stores it on the context.
    */

  }, {
    key: 'defineModel',
    value: function defineModel(name, schema) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var model = (0, _models.createModel)(schema, this);

      var descriptor = (0, _extends3.default)({
        enumerable: true
      }, options, {
        get: function get() {
          return model;
        }
      });
      delete descriptor.set;
      delete descriptor.value;

      return this.defineProperty(name, descriptor);
    }
  }]);
  return Context;
}();