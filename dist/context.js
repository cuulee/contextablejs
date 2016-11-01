'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Context = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _model = require('./model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* The core class for creating context.
*/

class Context {

  /*
  * Class constructor.
  */

  constructor() {
    let context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    for (let name in context) {
      this.defineProperty(name, {
        get: () => context[name],
        enumerable: true
      });
    }
  }

  /*
  * Defines a new property directly on the context object.
  */

  defineProperty(name, descriptor) {
    (0, _defineProperty2.default)(this, name, descriptor);

    return this[name];
  }

  /*
  * Creates a new Model class and stores it on the context.
  */

  defineModel(name, schema) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    let model = (0, _model.createModel)(schema, this);

    let descriptor = (0, _assign2.default)({
      enumerable: true
    }, options, {
      get: () => model
    });
    delete descriptor.set;
    delete descriptor.value;

    return this.defineProperty(name, descriptor);
  }

}
exports.Context = Context;