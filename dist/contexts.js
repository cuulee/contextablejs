'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Context = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

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
      (0, _defineProperty2.default)(this, name, descriptor);

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

      var descriptor = (0, _assign2.default)({
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