'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Context = undefined;

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
    let ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    for (let name in ctx) {
      let value = ctx[name];

      (0, _defineProperty2.default)(this, name, {
        get: () => value,
        enumerable: true // do not expose as object key
      });
    }

    Object.defineProperty(this, '_models', {
      value: {},
      writable: false // do not expose as object key
    });
  }

  /*
  * Creates a new Model class and stores it on the context.
  */

  defineModel(name, schema) {
    this._models[name] = (0, _model.createModel)(schema, this);
    return this.getModel(name);
  }

  /*
  * Creates a new Model class and stores it on the context.
  */

  getModel(name) {
    return this._models[name];
  }

  /*
  * Creates a new Model class and stores it on the context.
  */

  deleteModel(name) {
    delete this._models[name];
  }

}
exports.Context = Context;